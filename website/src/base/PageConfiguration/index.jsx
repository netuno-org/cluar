import React, { useState, useEffect } from "react";

import {
  Drawer,
  Form,
  Input,
  InputNumber,
  Button,
  Switch,
  notification,
  Select,
  Upload,
  List,
  Flex,
  Tag,
} from "antd";
import { PlusOutlined, HolderOutlined } from "@ant-design/icons";
import _service from "@netuno/service-client";
import Cluar from "../../common/Cluar";
import { useSearchParams, useNavigate } from "react-router";
import SortableStructure from "./SortableStructure";

import "./index.less";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const PageConfiguration = ({
  pageData,
  open,
  onClose,
  onSuccess,
  currentStructure = [],
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pagesOptions, setPagesOptions] = useState([]);
  const [structure, setStructure] = useState([]);
  const [searchParams] = useSearchParams();
  const [templateOptions, setTemplateOptions] = useState([]);
  const navigate = useNavigate();
  const isNewPage = !pageData;

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  const menuEnabled = Form.useWatch("menu", form);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = async ({ fileList }) => {
    if (fileList.length > 0) {
      let file = fileList[0];

      if (!file.url && !file.thumbUrl && file.originFileObj) {
        file.thumbUrl = await getBase64(file.originFileObj);
      }

      setFileList([...fileList]);

      if (form) {
        form.setFieldValue("social_image", file.thumbUrl || file.url);
      }
    } else {
      setFileList([]);
      if (form) {
        form.setFieldValue("social_image", "");
      }
    }
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        {Cluar.plainDictionary("page-form-upload")}
      </div>
    </button>
  );

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (pageData) {
        const imageUrl = pageData.social_image ? `/cluar/images/page/${pageData.social_image}` : null;
        form.setFieldsValue({
          ...pageData,
          social_image: imageUrl || ""
        });

        if (imageUrl) {
          setFileList([
            {
              uid: "-1",
              name: pageData.social_image,
              status: "done",
              url: imageUrl,
            },
          ]);
        } else {
          setFileList([]);
        }
      } else {
        setFileList([]);
      }

      // Carrega as páginas do mesmo idioma para o Select
      const currentLanguageCode = Cluar.currentLanguage().code;
      const pagesOfSameLanguage = Cluar.pages()[currentLanguageCode] || [];

      const filteredPages = pagesOfSameLanguage.filter(
        (page) => !pageData || page.uid !== pageData.uid
      );

      const options = filteredPages.map((page) => ({
        label: page.title,
        value: page.uid,
      }));

      setPagesOptions(options);
    }
  }, [open, pageData, form]);

  const handleSave = () => {
    const hasStructChanges =
      structure.findIndex((item, index) => item.sorter !== (index + 1) * 10) !==
      -1;

    form.validateFields().then((values) => {
      setLoading(true);
      const method = isNewPage ? "POST" : "PUT";
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        const value = values[key];
        const hasValue = value !== undefined && value !== null && value !== "";
        if (hasValue) {
          if (key === "social_image") {
            if (fileList.length > 0 && fileList[0].originFileObj) {
              formData.append(key, fileList[0].originFileObj);
            } else {
              formData.append(key, "");
            }
          } else if (key === "link") {
            const cleanLink = (value || "").replace(/^\/+|\/+$/g, '');
            const normalizedLink = cleanLink === "" ? "/" : `/${cleanLink}`;
            formData.append(key, normalizedLink);
          } else {
            formData.append(key, value);
          }
        }
      });

      formData.append("language_code", Cluar.currentLanguage().code);

      if (!isNewPage) {
        formData.append("uid", pageData.uid);
      }

      // Adiciona o idioma atual aos dados quando estiver a ser criado uma nova página
      // const data = isNewPage
      //   ? { ...values, language_code: Cluar.currentLanguage().code }
      //   : { ...values, uid: pageData.uid };

      _service({
        url: "reserved-area/page",
        method,
        data: formData,
        success: (response) => {
          setLoading(false);
          notification.success({
            message: isNewPage
              ? Cluar.plainDictionary("page-configuration-notification-create-success")
              : Cluar.plainDictionary("page-configuration-notification-update-success"),
          });

          if (onClose) {
            onClose();
          }

          if (onSuccess) {
            onSuccess(response);
          } else {
            if (!hasStructChanges) {
              setTimeout(() => {
                window.location.reload();
              }, 500);
            }
          }
        },
        fail: (error) => {
          setLoading(false);
          console.error(error);

          const errorCode = error?.json?.error_code;
          if (errorCode) {
            notification.error({
              message: Cluar.plainDictionary(errorCode),
            });
          } else {
            notification.error({
              message: isNewPage
                ? Cluar.plainDictionary("page-configuration-notification-create-fail")
                : Cluar.plainDictionary("page-configuration-notification-update-fail"),
            });
          }
        },
      });
    });

    if (hasStructChanges) {
      _service({
        url: "/reserved-area/editor/page-version/save",
        method: "POST",
        data: {
          structures: structure.map((item, index) => ({
            ...item,
            sorter: (index + 1) * 10,
          })),
          page: pageData.uid,
        },
        success: (res) => {
          if (res.json.result) {
            notification.success({
              message: Cluar.plainDictionary("page-configuration-notification-structure-order-success"),
            });
            window.location = `?version=${res.json.data}`;
          }
        },
        fail: (error) => {
          notification.error({
            message: Cluar.plainDictionary("page-configuration-notification-structure-order-fail"),
          });
        },
      });
    }
  };

  useEffect(() => {
    if (pageData) {
      if (pageData.social_image) {
        setFileList([
          {
            url:
              pageData.social_image.indexOf("base64") === -1
                ? `/cluar/images/page/${pageData.social_image}`
                : pageData.social_image,
          },
        ]);
      }
    }
  }, [pageData]);

  useEffect(() => {
    if (pageData && open && !isNewPage) {
      setStructure([...currentStructure]);
    }
  }, [pageData, searchParams, open, currentStructure]);

  useEffect(() => {
    _service({
      url: "/reserved-area/page/template/list",
      method: "POST",
      data: {
        language: Cluar.currentLanguage().locale,
      },
      success: (res) => {
        setTemplateOptions(res.json.templates);
      },
      fail: (error) => {
        console.error(error);
      },
    });
  }, []);

  useEffect(() => {
    if (!open) {
      form.resetFields();
      setLoading(false);
      setPagesOptions([]);
      setStructure([]);
      setPreviewOpen(false);
      setPreviewImage("");
      setFileList([]);
    }
  }, [open]);

  // Verifica se o link é "/" para desabilitar a edição
  const isRootLink = pageData?.link === "/";

  return (
    <div className="page-configuration">
      <Drawer
        open={open}
        onClose={onClose}
        width={520}
        destroyOnHidden
        title={isNewPage ? Cluar.plainDictionary("page-drawer-new-title") : Cluar.plainDictionary("page-drawer-config-title")}
        extra={
          <Button type="primary" onClick={handleSave} loading={loading}>
            {isNewPage ? Cluar.plainDictionary("page-form-add") : Cluar.plainDictionary("page-form-save")}
          </Button>
        }
      >
        <Form layout="vertical" initialValues={pageData || {}} form={form}>
          <Form.Item
            label={Cluar.plainDictionary("page-form-title")}
            name="title"
            rules={[
              {
                required: true,
                message: Cluar.plainDictionary("page-configuration-validation-title"),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={Cluar.plainDictionary("page-table-template")}
            name="template"
            rules={[
              {
                required: true,
                message: Cluar.plainDictionary("page-configuration-validation-template"),
              },
            ]}
          >
            <Select
              options={templateOptions.map((item) => ({
                label: item.info.label,
                value: item.name,
              }))}
            />
          </Form.Item>
          <Form.Item label={Cluar.plainDictionary("page-form-description")}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label={Cluar.plainDictionary("page-form-keywords")} name="keywords">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label={Cluar.plainDictionary("page-form-social-image")} name="social_image">
            <Upload
              className="page-upload"
              listType="picture-card"
              fileList={fileList}
              action={""}
              onChange={handleChange}
              onRemove={() => {
                form.setFieldValue("social_image", "")
              }}
              beforeUpload={() => false}
              style={{ width: "100%" }}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>

          </Form.Item>
          <Form.Item
            label={Cluar.plainDictionary("page-form-social-description")}
            name="social_description"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label={Cluar.plainDictionary("page-form-link")}
            name="link"
            rules={[
              { required: true, message: Cluar.plainDictionary("page-configuration-validation-link") },
            ]}
            tooltip={
              isRootLink
                ? Cluar.plainDictionary("page-configuration-tooltip-link-root")
                : ""
            }
          >
            <Input disabled={isRootLink} />
          </Form.Item>

          <Form.Item
            label={Cluar.plainDictionary("page-form-parent")}
            name="parent_uid"
            tooltip={Cluar.plainDictionary("page-configuration-tooltip-parent")}
          >
            <Select
              allowClear
              placeholder={Cluar.plainDictionary("page-configuration-placeholder-parent")}
              options={pagesOptions}
              optionFilterProp="label"
              showSearch
              disabled={isRootLink}
            />
          </Form.Item>

          <Form.Item
            label={Cluar.plainDictionary("page-form-menu")}
            name="menu"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item label={Cluar.plainDictionary("page-form-menu-title")} name="menu_title" dependencies={["menu"]} rules={[
            {
              required: !!menuEnabled,
              message: Cluar.plainDictionary("page-configuration-validation-menu-title"),
            },
          ]}>
            <Input />
          </Form.Item>
          <Form.Item
            label={Cluar.plainDictionary("page-form-sorter")}
            name="sorter"
            tooltip={Cluar.plainDictionary("page-configuration-tooltip-sorter")}
          >
            <InputNumber style={{ width: "100%" }} min={0} step={10} placeholder={Cluar.plainDictionary("page-form-sorter-placeholder")} />
          </Form.Item>
          <Form.Item
            label={Cluar.plainDictionary("page-form-navigable")}
            name="navigable"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
          {!isNewPage && (
            <Form.Item label={Cluar.plainDictionary("page-form-structure")}>
              <SortableStructure
                structure={structure}
                setStructure={setStructure}
              />
            </Form.Item>
          )}
        </Form>
      </Drawer>
    </div>
  );
};

export default PageConfiguration;
