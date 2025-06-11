import React, { useState, useEffect } from "react";

import {
  Drawer,
  Form,
  Input,
  Button,
  Switch,
  notification,
  Select,
  Upload,
  List,
} from "antd";
import { PlusOutlined, HolderOutlined } from "@ant-design/icons";
import _service from "@netuno/service-client";
import Cluar from "../../common/Cluar";
import { useSearchParams, useNavigate } from "react-router-dom";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import "./index.less";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const PageConfiguration = ({ pageData, open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pagesOptions, setPagesOptions] = useState([]);
  const [structure, setStructure] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isNewPage = !pageData;

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

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

      if (!file.thumbUrl && file.originFileObj) {
        file.thumbUrl = await getBase64(file.originFileObj);
      }

      setFileList([...fileList]);

      if (form) {
        form.setFieldValue("social_image", file.thumbUrl);
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
        Upload
      </div>
    </button>
  );

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (pageData) {
        form.setFieldsValue(pageData);
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
        if (values[key]) {
          if (key === "social_image" && fileList.length > 0) {
            formData.append(key, fileList[0].originFileObj);
          } else {
            formData.append(key, values[key]);
          }
        }
      });

      if (isNewPage) {
        formData.append("language_code", Cluar.currentLanguage().code);
      } else {
        formData.append("uid", pageData.uid);
      }

      // Adiciona o idioma atual aos dados quando estiver a ser criado uma nova página
      // const data = isNewPage
      //   ? { ...values, language_code: Cluar.currentLanguage().code }
      //   : { ...values, uid: pageData.uid };

      _service({
        url: "page",
        method,
        data: formData,
        success: (response) => {
          setLoading(false);
          notification.success({
            message: isNewPage
              ? "Página criada com sucesso"
              : "Página atualizada com sucesso",
          });

          if (onClose) onClose();

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
            console.log("errorCode", errorCode);
            console.log(
              "Cluar.plainDictionary(errorCode)",
              Cluar.plainDictionary(errorCode)
            );

            notification.error({
              message: Cluar.plainDictionary(errorCode),
            });
          } else {
            notification.error({
              message: isNewPage
                ? "Falha ao criar página"
                : "Falha ao atualizar página",
            });
          }
        },
      });
    });

    if (hasStructChanges) {
      _service({
        url: "/editor/page-version/save",
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
              message: "Nova ordem de estruturas salva com sucesso.",
            });
            console.log("ddd", res.json);
            window.location = `?version=${res.json.data}`;
          }
        },
        fail: (error) => {
          console.log("ror", error);
          notification.error({
            message: "Falha ao salvar nova ordem de estruturas.",
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
    if (searchParams.get("version")) {
      _service({
        url: "/editor/page-version",
        method: "GET",
        data: {
          version: searchParams.get("version"),
        },
        success: (res) => {
          if (res.json.result) {
            setStructure(res.json.structure);
          }
        },
        fail: (res) => {
          console.log(res);
        },
      });
    } else {
      fetch(
        `/cluar/structures/${pageData.uid}.json?time=${new Date().getTime()}`
      )
        .then((response) => response.json())
        .then((data) => {
          setError(false);
          setStructure(data);
          setHasDiff(false);
        })
        .catch((error) => {
          setError(true);
          console.error("Failed to load page structure: ", { pageData, error });
        });
    }
  }, [pageData, searchParams]);

  // Verifica se o link é "/" para desabilitar a edição
  const isRootLink = pageData?.link === "/";

  return (
    <div className="page-configuration">
      <Drawer
        open={open}
        onClose={onClose}
        width={520}
        title={isNewPage ? "Nova Página" : "Configurações da Página"}
        extra={
          <Button type="primary" onClick={handleSave} loading={loading}>
            {isNewPage ? "Adicionar" : "Guardar"}
          </Button>
        }
      >
        <Form layout="vertical" initialValues={pageData || {}} form={form}>
          <Form.Item
            label="Título"
            name="title"
            rules={[
              {
                required: true,
                message: "Por favor, insira o título da página",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Descrição" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Palavras-chave" name="keywords">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="Imagem para partilha do link" name="social_image">
            <Upload
              className="page-upload"
              listType="picture-card"
              fileList={fileList}
              action={""}
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={() => false}
              style={{ width: "100%" }}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            {previewImage && (
              <Image
                wrapperStyle={{
                  display: "none",
                }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            )}
          </Form.Item>
          <Form.Item
            label="Descrição para Redes Sociais"
            name="social_description"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label="Link"
            name="link"
            rules={[
              { required: true, message: "Por favor, insira o link da página" },
            ]}
            tooltip={
              isRootLink
                ? "O link da página inicial não pode ser alterado."
                : ""
            }
          >
            <Input disabled={isRootLink} />
          </Form.Item>

          <Form.Item
            label="Página Parente"
            name="parent_uid"
            tooltip="Selecione a página parente desta página"
          >
            <Select
              allowClear
              placeholder="Selecione uma página pai"
              options={pagesOptions}
              optionFilterProp="label"
              showSearch
              disabled={isRootLink}
            />
          </Form.Item>

          <Form.Item
            label="Mostrar no Menu"
            name="menu"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item label="Título no Menu" name="menu_title">
            <Input />
          </Form.Item>
          <Form.Item
            label="Navegável"
            name="navigable"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
          <Form.Item label="Estrutura">
            <DndContext
              sensors={useSensors(useSensor(PointerSensor))}
              collisionDetection={closestCenter}
              onDragEnd={({ active, over }) => {
                if (active.id !== over?.id) {
                  const oldIndex = structure.findIndex(
                    (i) => i.uid === active.id
                  );
                  const newIndex = structure.findIndex(
                    (i) => i.uid === over?.id
                  );
                  setStructure((items) => arrayMove(items, oldIndex, newIndex));
                }
              }}
            >
              <SortableContext
                items={structure.map((item) => item.uid)}
                strategy={verticalListSortingStrategy}
              >
                <List
                  dataSource={structure}
                  size="small"
                  className="structure-config"
                  renderItem={(item) => {
                    const {
                      attributes,
                      listeners,
                      setNodeRef,
                      transform,
                      transition,
                    } = useSortable({ id: item.uid });

                    const style = {
                      transform: CSS.Transform.toString(transform),
                      transition,
                      cursor: "grab",
                    };

                    return (
                      <List.Item
                        key={item.uid}
                        ref={setNodeRef}
                        style={style}
                        {...attributes}
                        {...listeners}
                        className="structure-config__item"
                      >
                        <HolderOutlined style={{ marginRight: 8 }} />{" "}
                        {item.title}
                      </List.Item>
                    );
                  }}
                />
              </SortableContext>
            </DndContext>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default PageConfiguration;
