import React, { useEffect, useState } from "react";

import { Drawer, Form, Input, Button, Space, message, InputNumber, Modal, Card } from "antd";
import { RobotOutlined, EditOutlined } from "@ant-design/icons";
import BannerEditor from "../BannerEditor";
import ListEditor from "../ListEditor";
import FunctionalityEditor from "../FunctionalityEditor";
import ContentEditor from "../ContentEditor";
import LexicalEditor from "../../LexicalEditor";
import SliderEditor from "../SliderEditor";
import _service from "@netuno/service-client";
import Cluar from "../../../common/Cluar";

const SectionEditor = ({ open, onClose, sectionData, onConfirmChanges }) => {
  const [form] = Form.useForm();
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiPrompt, setAIPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [titleValue, setTitleValue] = useState(sectionData?.title || "");

  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [contentValue, setContentValue] = useState(sectionData?.content || "");

  useEffect(() => {
    setTitleValue(sectionData?.title || "");
    setContentValue(sectionData?.content || "");
  }, [sectionData]);

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
        html: contentValue || "",
        prompt: aiPrompt,
      },
      success: (res) => {
        if (res.json.result) {
          setContentValue(res.json.html);
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

  const handleSaveTitleModal = () => {
    form.setFieldsValue({ title: titleValue });
    setIsTitleModalOpen(false);
    message.success("Título atualizado!");
  };

  const handleSaveContentModal = () => {
    form.setFieldsValue({ content: contentValue });
    setIsContentModalOpen(false);
    message.success("Conteúdo atualizado!");
  };

  const isContentSection = sectionData?.section === "content";

  return (
    <>
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
          <Form.Item label="Título">
            <Card
              size="small"
              actions={[
                <div style={{ textAlign: 'left', paddingLeft: '12px' }}>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setIsTitleModalOpen(true)}
                  >
                    Editar Título
                  </Button>
                </div>
              ]}
            >
              <div
              >
                {Cluar.plainHTML(titleValue).slice(0, 97) + "..."}
              </div>
            </Card>
          </Form.Item>

          <Form.Item name="title" hidden>
            <Input />
          </Form.Item>

          <Form.Item label="Conteúdo">
            <Card
              size="small"
              actions={[
                <div style={{ textAlign: 'left', paddingLeft: '12px' }}>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setIsContentModalOpen(true)}
                  >
                    Editar Conteúdo
                  </Button>
                </div>
              ]}
            >
              <div
              >
                {Cluar.plainHTML(contentValue).slice(0, 97) + "..."}
              </div>
            </Card>
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

      <Modal
        title="Editar Título"
        open={isTitleModalOpen}
        onOk={handleSaveTitleModal}
        onCancel={() => setIsTitleModalOpen(false)}
        width={1000}
        okText="Salvar"
        cancelText="Cancelar"
        centered
        destroyOnClose
      >
        <div>
          <LexicalEditor
            initialHtml={titleValue}
            onChange={(html) => setTitleValue(html)}
          />
        </div>
      </Modal>

      <Modal
        title="Editar Conteúdo"
        open={isContentModalOpen}
        onOk={handleSaveContentModal}
        onCancel={() => setIsContentModalOpen(false)}
        width={1000}
        okText="Salvar"
        cancelText="Cancelar"
        centered
        destroyOnClose
      >
        <div>
          <LexicalEditor
            initialHtml={contentValue}
            onChange={(html) => setContentValue(html)}
          />
        </div>


        {isContentSection && (
          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
            <Button
              type="primary"
              icon={<RobotOutlined />}
              onClick={() => setShowAIPrompt(!showAIPrompt)}
              style={{ marginBottom: 16 }}
            >
              {showAIPrompt ? "Esconder AI" : "Assistente AI"}
            </Button>
          </div>
        )}

        {showAIPrompt && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: 8, display: 'block', fontWeight: 500 }}>
              Instruções para a IA:
            </label>
            <Input.TextArea
              rows={3}
              value={aiPrompt}
              onChange={(e) => setAIPrompt(e.target.value)}
              placeholder="Descreva o que você deseja que a IA gere ou modifique no conteúdo..."
              style={{ marginBottom: 12 }}
            />
            <Button
              type="primary"
              onClick={handleAIGenerate}
              loading={generating}
              style={{ alignSelf: 'flex-start' }}
            >
              Gerar
            </Button>
          </div>
        )}

      </Modal>
    </>
  );
};

export default SectionEditor;
