import React, { useState, useEffect } from "react";

import { Drawer, Form, Input, Button, Switch, notification, Select } from "antd";
import _service from "@netuno/service-client";
import Cluar from "../../common/Cluar";

const PageConfiguration = ({ pageData, open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pagesOptions, setPagesOptions] = useState([]);
  const isNewPage = !pageData;

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (pageData) {
        console.log("pageData", pageData);
        form.setFieldsValue(pageData);
      }
      
      // Carrega as páginas do mesmo idioma para o Select
      const currentLanguageCode = Cluar.currentLanguage().code;
      const pagesOfSameLanguage = Cluar.pages()[currentLanguageCode] || [];
      
      const filteredPages = pagesOfSameLanguage.filter(page => 
        !pageData || page.uid !== pageData.uid
      );

      console.log("filteredPages", filteredPages);
      
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
      
      console.log("pageData", pageData);
      console.log("values", values);
      
      const method = isNewPage ? "POST" : "PUT";
      // Adiciona o idioma atual aos dados quando estiver a ser criado uma nova página
      const data = isNewPage
        ? { ...values, language_code: Cluar.currentLanguage().code } 
        : { ...values, uid: pageData.uid };
      
      _service({
        url: "page",
        method,
        data,
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

  // Verifica se o link é "/" para desabilitar a edição
  const isRootLink = pageData?.link === "/";

  return (
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
  );
};

export default PageConfiguration;
