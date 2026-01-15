import React, { useState } from "react";

import { Drawer, Form, Input, Button, Space, message, InputNumber } from "antd";
import { RobotOutlined } from "@ant-design/icons";
import BannerEditor from "../BannerEditor";
import ListEditor from "../ListEditor";
import FunctionalityEditor from "../FunctionalityEditor";
import ContentEditor from "../ContentEditor";
import LexicalEditor from "../../LexicalEditor";
import SliderEditor from "../SliderEditor";
import _service from "@netuno/service-client";

const SectionEditor = ({ open, onClose, sectionData, onConfirmChanges }) => {
  const [form] = Form.useForm();
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiPrompt, setAIPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  const MoreEditor = () => {
    if (sectionData?.section === "banner") {
      return <BannerEditor sectionData={sectionData} form={form} />;
    } else if (sectionData?.section === "listing") {
      return <ListEditor sectionData={sectionData} form={form} />;
    } else if (sectionData?.section === "functionality") {
      return <FunctionalityEditor sectionData={sectionData} form={form} />;
    } else if (sectionData?.section === "slider") {
      return <SliderEditor sectionData={sectionData} form={form} />;
    } else if (sectionData?.section === "content") {
      return <ContentEditor sectionData={sectionData} form={form} />;
    }
  };

  const handleConfirmChanges = () => {
    if (onConfirmChanges) {
      let confirmData = {
        ...sectionData,
        ...form.getFieldsValue(),
        status: sectionData.status === "to_create" ? "to_create" : "to_update",
      };

      onConfirmChanges(confirmData);

      if (onClose) {
        onClose();
      }
    }
  };

  const handleAIGenerate = () => {
    if (!aiPrompt.trim()) {
      message.warning("Por favor, insira instruções para a IA");
      return;
    }

    setGenerating(true);

    _service({
      url: "/test",
      method: "POST",
      data: {
        html: form.getFieldValue("content") || "",
        prompt: aiPrompt,
      },
      success: (res) => {
        if (res.json.result) {
          form.setFieldsValue({ content: res.json.html });
          message.success("Conteúdo gerado com sucesso");
          setAIPrompt("");
          setShowAIPrompt(false);
        } else {
          message.error(res.json.error || "Falha ao gerar conteúdo");
        }
        setGenerating(false);
      },
      fail: (error) => {
        console.error("Erro ao gerar conteúdo:", error);
        message.error("Falha ao gerar conteúdo");
        setGenerating(false);
      },
    });
  };

  const isContentSection = sectionData?.section === "content";

  return (
    <Drawer
      open={open}
      onClose={onClose}
      destroyOnClose={true}
      width={820}
      extra={
        <Button type="primary" onClick={handleConfirmChanges}>
          Aplicar
        </Button>
      }
    >
      <Form layout="vertical" initialValues={{ ...sectionData, action_uids: sectionData?.actions?.map((item) => item.uid).sort((a, b) => a.sorter - b.sorter) }} form={form}>
        <Form.Item label="Título" style={{ marginBottom: 8 }}>
          <LexicalEditor
            initialHtml={sectionData?.title}
            onChange={(html) => form.setFieldsValue({ title: html })}
            mode="simple"
          />
        </Form.Item>

        <Form.Item name="title" hidden>
          <Input />
        </Form.Item>

        {isContentSection && (
          <div style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              icon={<RobotOutlined />}
              onClick={() => setShowAIPrompt(!showAIPrompt)}
            >
              {showAIPrompt ? "Esconder AI" : "Assistente AI"}
            </Button>
          </div>
        )}

        {isContentSection && showAIPrompt && (
          <Form.Item label="Instruções para IA">
            <Space style={{ width: '100%' }} direction="vertical">
              <Input.TextArea
                rows={3}
                value={aiPrompt}
                onChange={(e) => setAIPrompt(e.target.value)}
                placeholder="Descreva o que você deseja que a IA gere ou modifique no conteúdo..."
              />
              <Button
                type="primary"
                onClick={handleAIGenerate}
                loading={generating}
                style={{ alignSelf: 'flex-end' }}
              >
                Gerar
              </Button>
            </Space>
          </Form.Item>
        )}

        <Form.Item label="Conteúdo" style={{ marginBottom: 8 }}>
          <LexicalEditor
            initialHtml={sectionData?.content}
            onChange={(html) => form.setFieldsValue({ content: html })}
          />
        </Form.Item>

        <Form.Item name="content" hidden>
          <Input.TextArea rows={6} />
        </Form.Item>

        <Form.Item name="sorter" label="Ordem">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <MoreEditor />
      </Form>
    </Drawer>
  );
};

export default SectionEditor;
