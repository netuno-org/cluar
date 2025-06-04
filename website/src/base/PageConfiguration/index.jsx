import React, { useState, useEffect } from "react";

import { Drawer, Form, Input, Button, Switch, notification, Select, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import _service from "@netuno/service-client";
import Cluar from "../../common/Cluar";
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

      const filteredPages = pagesOfSameLanguage.filter(page =>
        !pageData || page.uid !== pageData.uid
      );

      const options = filteredPages.map(page => ({
        label: page.title,
        value: page.uid
      }));

      setPagesOptions(options);
    }
  }, [open, pageData, form]);

  const handleSave = () => {
    form.validateFields().then(values => {
      setLoading(true);
      const method = isNewPage ? "POST" : "PUT";
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (values[key]) {
          if (key === 'social_image' && fileList.length > 0) {
            formData.append(key, fileList[0].originFileObj)
          } else {
            formData.append(key, values[key]);
          }
        }
      })

      if (isNewPage) {
        formData.append('language_code', Cluar.currentLanguage().code);
      } else {
        formData.append('uid', pageData.uid);
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
              : "Página atualizada com sucesso"
          });

          if (onClose) onClose();

          if (onSuccess) {
            onSuccess(response);
          } else {
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }
        },
        fail: (error) => {
          setLoading(false);
          console.error(error);

          const errorCode = error?.json?.error_code;
          if (errorCode) {
            console.log("errorCode", errorCode);
            console.log("Cluar.plainDictionary(errorCode)", Cluar.plainDictionary(errorCode))

            notification.error({
              message: Cluar.plainDictionary(errorCode)
            });
          } else {
            notification.error({
              message: isNewPage
                ? "Falha ao criar página"
                : "Falha ao atualizar página"
            });
          }
        }
      });
    });
  };

  useEffect(() => {
    if (pageData) {
      if (pageData.image) {
        setFileList([
          {
            url:
              pageData.image.indexOf("base64") === -1
                ? `/images/${pageData.section}/${pageData.image}`
                : pageData.image,
          },
        ]);
      }
    }
  }, [pageData]);

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
            rules={[{ required: true, message: 'Por favor, insira o título da página' }]}
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
              style={{ width: '100%' }}
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
          <Form.Item label="Descrição para Redes Sociais" name="social_description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label="Link"
            name="link"
            rules={[{ required: true, message: 'Por favor, insira o link da página' }]}
            tooltip={isRootLink ? "O link da página inicial não pode ser alterado." : ""}
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

          <Form.Item label="Mostrar no Menu" name="menu" valuePropName="checked" initialValue={false}>
            <Switch />
          </Form.Item>
          <Form.Item label="Título no Menu" name="menu_title">
            <Input />
          </Form.Item>
          <Form.Item label="Navegável" name="navigable" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default PageConfiguration;
