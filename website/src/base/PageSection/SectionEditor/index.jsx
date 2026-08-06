import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  Drawer, Form, Input, Button, Space, message, InputNumber,
  Modal, Card, Switch, Radio
} from "antd";
import { RobotOutlined, EditOutlined } from "@ant-design/icons";
import BannerEditor from "../BannerEditor";
import ListEditor from "../ListEditor";
import FunctionalityEditor from "../FunctionalityEditor";
import ContentEditor from "../ContentEditor";
import LexicalEditor from "../../LexicalEditor";
import MonacoEditor from "../../MonacoEditor";
import SliderEditor from "../SliderEditor";
import _service from "@netuno/service-client";
import Cluar from "../../../common/Cluar";

const SectionEditor = ({ open, onClose, sectionData, onConfirmChanges }) => {
  const [form] = Form.useForm();
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiPrompt, setAIPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  const themeMode = useSelector((state) => state.theme?.mode || "light");

  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [titleValue, setTitleValue] = useState(sectionData?.title || "");

  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [contentValue, setContentValue] = useState(sectionData?.content || "");

  // Modo HTML Puro externo 
  const [contentEditMode, setContentEditMode] = useState(
    sectionData?.edit_mode || "visual"
  );
  // html_content só vem preenchido se o usuário já usou o modo HTML puro antes
  const [htmlContentValue, setHtmlContentValue] = useState(
    sectionData?.html_content || ""
  );

  const [titleInvert, setTitleInvert] = useState(sectionData?.title_invert_background || false);
  const [contentInvert, setContentInvert] = useState(sectionData?.content_invert_background || false);

  useEffect(() => {
    setTitleValue(sectionData?.title || "");
    setContentValue(sectionData?.content || "");
    setContentEditMode(sectionData?.edit_mode || "visual");
    setHtmlContentValue(sectionData?.html_content || "");
  }, [sectionData]);

  // ao alternar para HTML Puro, inicializa com o conteúdo visual se vazio 
  const handleContentEditModeChange = (newMode) => {
    setContentEditMode(newMode);
    if (newMode === "html" && !htmlContentValue && contentValue) {
      setHtmlContentValue(contentValue);
    }
  };

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
      // Garante que os valores mais recentes estão no form
      form.setFieldsValue({
        title: titleValue,
        content: contentValue,
        html_content: htmlContentValue,
        edit_mode: contentEditMode,
      });

      let confirmData = {
        ...sectionData,
        ...form.getFieldsValue(),
        title_invert_background: titleInvert,
        content_invert_background: contentInvert,
        html_content: htmlContentValue,
        edit_mode: contentEditMode,
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

    const activeContent = contentEditMode === "html" ? htmlContentValue : contentValue;

    _service({
      url: "/test",
      method: "POST",
      data: {
        html: activeContent || "",
        prompt: aiPrompt,
      },
      success: (res) => {
        if (res.json.result) {
          // Atualiza o conteúdo do modo ativo
          if (contentEditMode === "html") {
            setHtmlContentValue(res.json.html);
          } else {
            setContentValue(res.json.html);
          }
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
    form.setFieldsValue({
      content: contentValue,
      html_content: htmlContentValue,
      edit_mode: contentEditMode,
    });
    setIsContentModalOpen(false);
    message.success("Conteúdo atualizado!");
  };

  const isContentSection = sectionData?.section === "content";

  // Preview usa o conteúdo do modo ativo
  const activeContentPreview = contentEditMode === "html" ? htmlContentValue : contentValue;

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
        <Form
          layout="vertical"
          initialValues={{
            ...sectionData,
            action_uids: sectionData?.actions
              ?.map((item) => item.uid)
              .sort((a, b) => a.sorter - b.sorter),
          }}
          form={form}
        >
          <Form.Item label="Título">
            <Card
              size="small"
              actions={[
                <div style={{ textAlign: "left", paddingLeft: "12px" }}>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setIsTitleModalOpen(true)}
                  >
                    Editar Título
                  </Button>
                </div>,
              ]}
            >
              <div>
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
                <div
                  style={{
                    textAlign: "left",
                    paddingLeft: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setIsContentModalOpen(true)}
                  >
                    Editar Conteúdo
                  </Button>
                  {/* Indicador do modo ativo  */}
                  <span style={{ fontSize: 12, color: "#888" }}>
                    Modo: {contentEditMode === "html" ? "HTML Puro" : "Visual"}
                  </span>
                </div>,
              ]}
            >
              <div>
                {Cluar.plainHTML(activeContentPreview).slice(0, 97) + "..."}
              </div>
            </Card>
          </Form.Item>

          <Form.Item name="content" hidden>
            <Input.TextArea rows={6} />
          </Form.Item>
          {/* campos hidden para persistência */}
          <Form.Item name="html_content" hidden>
            <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item name="edit_mode" hidden>
            <Input />
          </Form.Item>

          <Form.Item name="sorter" label="Ordem">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <MoreEditor />
        </Form>
      </Drawer>

      {/* Modal Título */}
      <Modal
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingRight: 30,
            }}
          >
            <span>Editar Título</span>
            <Space>
              <span style={{ fontSize: "12px", fontWeight: "normal" }}>
                Inverter cor de fundo:
              </span>
              <Switch
                checked={titleInvert}
                onChange={(checked) => setTitleInvert(checked)}
                size="small"
              />
            </Space>
          </div>
        }
        open={isTitleModalOpen}
        onOk={handleSaveTitleModal}
        onCancel={() => setIsTitleModalOpen(false)}
        width={1000}
        okText="Salvar"
        cancelText="Cancelar"
        centered
        destroyOnClose
      >
        <div
          style={{
            backgroundColor: titleInvert
              ? themeMode === "dark"
                ? "#ffffff"
                : "#141414"
              : "transparent",
            borderRadius: "4px",
            transition: "all 0.3s",
          }}
        >
          <LexicalEditor
            initialHtml={titleValue}
            onChange={(html) => setTitleValue(html)}
            stripRootParagraph={true}
          />
        </div>
      </Modal>

      <Modal
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingRight: 30,
            }}
          >
            <span>Editar Conteúdo</span>
            <Space>
              <Radio.Group
                value={contentEditMode}
                onChange={(e) => handleContentEditModeChange(e.target.value)}
                optionType="button"
                buttonStyle="solid"
                size="small"
              >
                <Radio.Button value="visual">Visual</Radio.Button>
                <Radio.Button value="html">HTML Puro</Radio.Button>
              </Radio.Group>
              <span style={{ fontSize: "12px", fontWeight: "normal" }}>
                Inverter cor de fundo:
              </span>
              <Switch
                checked={contentInvert}
                onChange={(checked) => setContentInvert(checked)}
                size="small"
              />
            </Space>
          </div>
        }
        open={isContentModalOpen}
        onOk={handleSaveContentModal}
        onCancel={() => setIsContentModalOpen(false)}
        width={1000}
        okText="Salvar"
        cancelText="Cancelar"
        centered
        destroyOnClose
      >
        <div
          style={{
            backgroundColor: contentInvert
              ? themeMode === "dark"
                ? "#ffffff"
                : "#141414"
              : "transparent",
            borderRadius: "4px",
            transition: "all 0.3s",
          }}
        >
          {contentEditMode === "visual" ? (
            <LexicalEditor
              key="content-visual"
              initialHtml={contentValue}
              onChange={(html) => setContentValue(html)}
            />
          ) : (
            <MonacoEditor
              key="content-html"
              value={htmlContentValue}
              onChange={(value) => setHtmlContentValue(value)}
            />
          )}
        </div>

        {isContentSection && (
          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16 }}>
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
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              style={{
                marginBottom: 8,
                display: "block",
                fontWeight: 500,
              }}
            >
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
              style={{ alignSelf: "flex-start" }}
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
