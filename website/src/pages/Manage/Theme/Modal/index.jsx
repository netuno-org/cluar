import { Button, Col, Form, Input, Modal, Row, notification } from "antd";
import { AppstoreOutlined, CodeOutlined } from "@ant-design/icons";
import {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useRef,
} from "react";
import _service from "@netuno/service-client";
import Cluar from "../../../../common/Cluar";
import MetadataEditor from "../../../../base/MetadataEditor";

import "./index.less";

const ThemeModal = forwardRef(
  ({ themeData, onReloadTable, onThemeSaved }, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [onFinishLoading, setOnFinishLoading] = useState(false);
    const [contentMode, setContentMode] = useState("editor");
    const [formRef] = Form.useForm();
    const editMode = themeData ? true : false;
    const themeDataRef = useRef(themeData);
    themeDataRef.current = themeData;

    const openModal = (data = themeDataRef.current) => {
      let nextContentMode = "editor";
      if (data?.content) {
        try {
          JSON.parse(data.content);
        } catch (error) {
          nextContentMode = "text";
        }
      }
      setContentMode(nextContentMode);
      setIsModalOpen(true);
    };

    const toggleContentMode = () => {
      if (contentMode === "text") {
        const content = formRef.getFieldValue("content");
        if (content) {
          try {
            JSON.parse(content);
          } catch (error) {
            notification.error({
              message: Cluar.plainTranslation(
                "theme-form-content-invalid-json",
              ),
            });
            return;
          }
        }
      }
      setContentMode((mode) => (mode === "editor" ? "text" : "editor"));
    };

    useImperativeHandle(ref, () => {
      return {
        openModal,
      };
    }, []);

    useEffect(() => {
      if (editMode && isModalOpen) {
        formRef.setFieldsValue({
          ...themeData,
        });
      }
    }, [isModalOpen]);

    const onFinish = (values) => {
      const data = {
        ...values,
        applied: editMode ? themeData.applied : false,
      };
      setOnFinishLoading(true);
      if (editMode) {
        _service({
          method: "PUT",
          url: "reserved-area/theme",
          data: {
            ...data,
            uid: themeData.uid,
          },
          success: () => {
            setOnFinishLoading(false);
            notification.success({
              message: Cluar.plainTranslation(
                "theme-form-edit-success-message",
              ),
            });
            setIsModalOpen(false);
            onReloadTable();
            if (themeData.applied) {
              onThemeSaved();
            }
          },
          fail: (error) => {
            setOnFinishLoading(false);
            console.error(error);
            notification.error({
              message: Cluar.plainTranslation("theme-form-edit-failed-message"),
            });
          },
        });
      } else {
        _service({
          method: "POST",
          url: "reserved-area/theme",
          data: {
            ...data,
          },
          success: () => {
            setOnFinishLoading(false);
            notification.success({
              message: Cluar.plainTranslation(
                "theme-form-save-success-message",
              ),
            });
            setIsModalOpen(false);
            onReloadTable();
          },
          fail: (error) => {
            setOnFinishLoading(false);
            console.error(error);
            notification.error({
              message: Cluar.plainTranslation("theme-form-save-failed-message"),
            });
          },
        });
      }
    };

    return (
      <div className="modal-content">
        <Modal
          title={
            editMode
              ? Cluar.plainTranslation("theme-modal-edit-title")
              : Cluar.plainTranslation("theme-modal-new-title")
          }
          maskClosable={false}
          destroyOnHidden={true}
          centered
          width={640}
          open={isModalOpen}
          onOk={() => {}}
          onCancel={() => setIsModalOpen(false)}
          afterClose={() => formRef.resetFields()}
          footer={[
            <Button key="back" onClick={() => setIsModalOpen(false)}>
              {Cluar.plainTranslation("theme-form-cancel")}
            </Button>,
            <Button
              key="send"
              type="primary"
              onClick={() => {
                formRef.submit();
              }}
              loading={onFinishLoading}
            >
              {Cluar.plainTranslation("theme-form-save")}
            </Button>,
          ]}
        >
          <Form layout="vertical" form={formRef} onFinish={onFinish}>
            <Row justify={"space-between"} align={"middle"} gutter={[10, 0]}>
              <Col span={24}>
                <Form.Item
                  label={Cluar.plainTranslation("theme-form-title")}
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: Cluar.plainTranslation(
                        "theme-form-validate-message-required",
                      ),
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <div className="theme-content-header">
                  <span className="theme-content-header-label">
                    {Cluar.plainTranslation("theme-form-content")}
                  </span>
                  <Button type="link" size="small" onClick={toggleContentMode}>
                    {contentMode === "editor"
                      ? Cluar.plainTranslation("theme-form-content-mode-text")
                      : Cluar.plainTranslation(
                          "theme-form-content-mode-editor",
                        )}
                  </Button>
                </div>
                <Form.Item
                  name="content"
                  rules={[
                    {
                      required: true,
                      message: Cluar.plainTranslation(
                        "theme-form-validate-message-required",
                      ),
                    },
                  ]}
                >
                  {contentMode === "editor" ? (
                    <MetadataEditor />
                  ) : (
                    <Input.TextArea rows={16} />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  },
);

export default ThemeModal;
