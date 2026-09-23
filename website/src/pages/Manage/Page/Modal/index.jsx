import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Switch,
  notification
} from "antd";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from "react";
import _service from "@netuno/service-client";
import Cluar from "../../../../common/Cluar";

const PageModal = forwardRef(({ onReloadTable, pageData }, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState({
    saving: false,
    languages: false,
    pages: false
  });
  const [languages, setLanguages] = useState([]);
  const [pages, setPages] = useState([]);
  const [templateOptions, setTemplateOptions] = useState([]);
  const editMode = pageData ? true : false;
  const [formRef] = Form.useForm();
  const menuEnabled = Form.useWatch("menu", formRef);

  const onOpenModal = () => {
    setIsModalOpen(true);
  };

  const onLoadLanguages = () => {
    setLoading({ ...loading, languages: true });
    _service({
      url: "reserved-area/language/list",
      method: "POST",
      success: (response) => {
        setLoading({ ...loading, languages: false });
        const { items } = response.json.page;
        setLanguages(items);
      },
      fail: (error) => {
        setLoading({ ...loading, languages: false });
        console.error(error);
        notification.error({
          message: "Falha ao carregar idiomas.",
        });
      },
    });
  };

  const onLoadPages = (languageCode) => {
    if (!languageCode) return;

    setLoading({ ...loading, pages: true });
    _service({
      url: "reserved-area/page/list",
      method: "POST",
      data: {
        filters: {
          language_code: languageCode,
        },
      },
      success: (response) => {
        setLoading({ ...loading, pages: false });
        const { items } = response.json.page;
        setPages(
          items.filter((page) => !pageData || page.uid !== pageData.uid)
        );
      },
      fail: (error) => {
        setLoading({ ...loading, pages: false });
        console.error(error);
        notification.error({
          message: "Falha ao carregar páginas.",
        });
      },
    });
  };

  const onFinish = (values) => {
    const data = {
      ...values,
      parent_uid: values.parent_uid?.value || null,
      language_code: values.language_code?.value,
    };

    if (editMode) {
      setLoading({ ...loading, saving: true });
      _service({
        url: "reserved-area/page",
        method: "PUT",
        data: {
          ...data,
          uid: pageData.uid,
          language_code: pageData.language_code,
        },
        success: (response) => {
          setLoading({ ...loading, saving: false });
          setIsModalOpen(false);
          onReloadTable();
          notification.success({
            message: Cluar.plainTranslation("page-form-edit-success-message"),
          });
        },
        fail: (error) => {
          setLoading({ ...loading, saving: false });
          console.error(error);

          const errorCode = error?.json?.error_code;
          if (errorCode) {
            notification.error({
              message: Cluar.plainTranslation("page-form-edit-failed-message"),
              description: (Cluar.hasTranslation(errorCode) && Cluar.plainTranslation(errorCode))
                || error?.json?.error,
            });
            return;
          }
          notification.error({
            message: Cluar.plainTranslation("page-form-edit-failed-message"),
          });
        },
      });
    } else {
      setLoading({ ...loading, saving: true });
      _service({
        url: "reserved-area/page",
        method: "POST",
        data: {
          ...data,
        },
        success: (response) => {
          setLoading({ ...loading, saving: false });
          setIsModalOpen(false);
          onReloadTable();
          notification.success({
            message: Cluar.plainTranslation("page-form-save-success-message"),
          });
        },
        fail: (error) => {
          setLoading({ ...loading, saving: false });
          console.error(error);

          const errorCode = error?.json?.error_code;
          if (errorCode) {
            notification.error({
              message: Cluar.plainTranslation("page-form-save-failed-message"),
              description: (Cluar.hasTranslation(errorCode) && Cluar.plainTranslation(errorCode))
                || error?.json?.error,
            });
            return;
          }
          notification.error({
            message: Cluar.plainTranslation("page-form-save-failed-message"),
          });
        },
      });
    }
  };

  useImperativeHandle(ref, () => {
    return {
      openModal: onOpenModal,
    };
  }, []);

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
    if (isModalOpen) {
      onLoadLanguages();

      if (editMode) {
        formRef.setFieldsValue({
          ...pageData,
          language_code: pageData.language_code,
          parent_uid: pageData.parent
            ? {
              label: pageData.parent.title,
              value: pageData.parent.uid,
            }
            : undefined,
        });

        //   if (pageData.language_code) {
        //     onLoadPages(pageData.language_code);
        //   }
      }
    }
  }, [isModalOpen]);

  const handleLanguageChange = (value) => {
    onLoadPages(value.value);
  };

  return (
    <Modal
      title={
        editMode
          ? Cluar.plainTranslation("page-modal-edit-title")
          : Cluar.plainTranslation("page-modal-new-title")
      }
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      onClose={() => setIsModalOpen(false)}
      destroyOnHidden
      maskClosable={false}
      afterClose={() => formRef.resetFields()}
      centered
      footer={[
        <Button onClick={() => setIsModalOpen(false)}>
          {Cluar.plainTranslation("page-form-cancel")}
        </Button>,
        <Button
          type="primary"
          onClick={() => formRef.submit()}
          loading={loading.saving}
          disabled={loading.saving}
        >
          {Cluar.plainTranslation("page-form-save")}
        </Button>,
      ]}
    >
      <Form layout="vertical" form={formRef} onFinish={onFinish}>
        <Row justify={"space-between"} align={"middle"} gutter={[10, 0]}>
          <Col span={24}>
            <Form.Item
              name="language_code"
              label={Cluar.plainTranslation("page-form-language")}
              rules={[
                {
                  required: true,
                  message: Cluar.plainTranslation(
                    "page-form-validate-message-required"
                  ),
                },
              ]}
            >
              <Select
                labelInValue
                options={languages.map((language) => ({
                  label: language.description,
                  value: language.code,
                }))}
                loading={loading.languages}
              //   onChange={handleLanguageChange}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="title"
              label={Cluar.plainTranslation("page-form-title")}
              rules={[
                {
                  required: true,
                  message: Cluar.plainTranslation(
                    "page-form-validate-message-required"
                  ),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={Cluar.plainTranslation("page-table-template")}
              name="template"
              rules={[
                {
                  required: true,
                  message: Cluar.plainTranslation(
                    "page-form-validate-message-required"
                  ),
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
          </Col>
          <Col span={24}>
            <Form.Item
              name="description"
              label={Cluar.plainTranslation("page-form-description")}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="keywords"
              label={Cluar.plainTranslation("page-form-keywords")}
            >
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="link"
              label={Cluar.plainTranslation("page-form-link")}
              rules={[
                {
                  required: true,
                  message: Cluar.plainTranslation(
                    "page-form-validate-message-required"
                  ),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="parent_uid"
              label={Cluar.plainTranslation("page-form-parent")}
            >
              <Select
                labelInValue
                allowClear
                options={pages.map((page) => ({
                  label: page.title,
                  value: page.uid,
                }))}
                loading={loading.pages}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="menu"
              label={Cluar.plainTranslation("page-form-menu")}
              valuePropName="checked"
              initialValue={false}
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="navigable"
              label={Cluar.plainTranslation("page-form-navigable")}
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="menu_title"
              label={Cluar.plainTranslation("page-form-menu-title")}
              dependencies={["menu"]}
              rules={[
                {
                  required: !!menuEnabled,
                  message: Cluar.plainTranslation(
                    "page-form-validate-message-required"
                  ),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="sorter"
              label={Cluar.plainTranslation("page-form-sorter")}
              tooltip={Cluar.plainTranslation("page-configuration-tooltip-sorter")}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                step={10}
                placeholder={Cluar.plainTranslation("page-form-sorter-placeholder")}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
})

export default PageModal;
