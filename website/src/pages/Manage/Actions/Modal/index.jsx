import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Switch,
  notification,
  Upload
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from "react";
import _service from "@netuno/service-client";
import Cluar from "../../../../common/Cluar";
import "./index.less";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const ActionsModal = forwardRef(({ onReloadTable, actionData }, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState({
    saving: false,
    languages: false,
    pages: false
  });
  const [languages, setLanguages] = useState([]);
  const editeMode = actionData ? true : false;
  const [formRef] = Form.useForm();

  const [fileList, setFileList] = useState([]);

  const handleChange = async ({ fileList }) => {
    if (fileList.length > 0) {
      let file = fileList[0];
      if (!file.url && !file.thumbUrl && file.originFileObj) {
        file.thumbUrl = await getBase64(file.originFileObj);
      }
      setFileList([...fileList]);
      if (formRef) {
        formRef.setFieldValue("image", file.thumbUrl || file.url);
      }
    } else {
      setFileList([]);
      if (formRef) {
        formRef.setFieldValue("image", "");
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

  const onOpenModal = () => {
    setIsModalOpen(true);
  };

  const onLoadLanguages = () => {
    setLoading({ ...loading, languages: true });
    _service({
      url: "language/list",
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

  const onFinish = (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (values[key] !== undefined && values[key] !== null) {
        if (key === 'image') {
          if (fileList.length > 0 && fileList[0].originFileObj) {
            formData.append(key, fileList[0].originFileObj);
          } else {
            formData.append(key, "");
          }
        } else if (key === 'language_code' && values.language_code?.value) {
          formData.append(key, values.language_code.value);
        } else if (typeof values[key] === "boolean") {
          formData.append(key, values[key] ? "true" : "false");
        } else {
          formData.append(key, values[key]);
        }
      }
    })

    if (editeMode) {
      formData.append('uid', actionData.uid);
      formData.append('language_code', actionData.language_code);
    }

    setLoading({ ...loading, saving: true });

    _service({
      url: "actions",
      method: editeMode ? "PUT" : "POST",
      data: formData,
      success: (response) => {
        setLoading({ ...loading, saving: false });
        setIsModalOpen(false);
        onReloadTable();
        notification.success({
          message: editeMode ? Cluar.plainDictionary("page-form-edit-success-message") : Cluar.plainDictionary("page-form-save-success-message"),
        });
      },
      fail: (error) => {
        setLoading({ ...loading, saving: false });
        console.log(error);

        if (error?.json?.error_code) {
          notification.error({
            message: editeMode ? Cluar.plainDictionary("page-form-edit-failed-message") : Cluar.plainDictionary("page-form-save-failed-message"),
            description: Cluar.plainDictionary(error.json.error_code),
          });
          return;
        }
        notification.error({
          message: editeMode ? Cluar.plainDictionary("page-form-edit-failed-message") : Cluar.plainDictionary("page-form-save-failed-message"),
        });
      },
    });
  };

  useImperativeHandle(ref, () => {
    return {
      openModal: onOpenModal,
    };
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      onLoadLanguages();

      if (editeMode) {
        const imageUrl = actionData.image
          ? `${_service.config().prefix}actions/image?uid=${actionData.uid}`
          : null;

        formRef.setFieldsValue({
          ...actionData,
          language_code: actionData.language_code,
          image: imageUrl || ""
        });

        if (imageUrl) {
          setFileList([
            {
              uid: "-1",
              name: actionData.image,
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
    }
  }, [isModalOpen]);

  return (
    <Modal
      title={
        editeMode
          ? Cluar.plainDictionary("action-modal-edit-title")
          : Cluar.plainDictionary("action-modal-new-title")
      }
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      onClose={() => setIsModalOpen(false)}
      destroyOnClose
      maskClosable={false}
      afterClose={() => formRef.resetFields()}
      centered
      footer={[
        <Button onClick={() => setIsModalOpen(false)}>
          {Cluar.plainDictionary("action-form-cancel")}
        </Button>,
        <Button
          type="primary"
          onClick={() => formRef.submit()}
          loading={loading.saving}
          disabled={loading.saving}
        >
          {Cluar.plainDictionary("action-form-save")}
        </Button>,
      ]}
    >
      <Form layout="vertical" form={formRef} onFinish={onFinish}>
        <Row justify={"space-between"} align={"middle"} gutter={[10, 0]}>
          <Col span={24}>
            <Form.Item
              name="language_code"
              label={Cluar.plainDictionary("action-form-language")}
              rules={[
                {
                  required: true,
                  message: Cluar.plainDictionary(
                    "action-form-validate-message-required"
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
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="title"
              label={Cluar.plainDictionary("action-form-title")}
              rules={[
                {
                  required: true,
                  message: Cluar.plainDictionary(
                    "action-form-validate-message-required"
                  ),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="content"
              label={Cluar.plainDictionary("action-form-content")}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="indication"
              label={Cluar.plainDictionary("action-form-indication")}
              rules={[
                {
                  required: true,
                  message: Cluar.plainDictionary(
                    "action-form-validate-message-required"
                  ),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="link"
              label={Cluar.plainDictionary("action-form-link")}
              rules={[
                {
                  required: true,
                  message: Cluar.plainDictionary(
                    "action-form-validate-message-required"
                  ),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="active"
              label={Cluar.plainDictionary("action-form-active")}
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>
          </Col>
          {/* ADICIONAR CAMPO DE IMAGEM */}
          <Col span={24}>
            <Form.Item
              name="image"
              label={Cluar.plainDictionary("action-form-image")}
            >
              <Upload
                className="actions-upload"
                listType="picture-card"
                fileList={fileList}
                action={""}
                onChange={handleChange}
                onRemove={() => {
                  formRef.setFieldValue("image", "");
                }}
                beforeUpload={() => false}
                style={{ width: '100%' }}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
})

export default ActionsModal;