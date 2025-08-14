import {
  Button,
  Col,
  Form,
  Input,
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

const ActionsModal = forwardRef(({ onReloadTable, actionData }, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState({
    saving: false,
    languages: false,
    pages: false
  });
  const [languages, setLanguages] = useState([]);
  const [pages, setPages] = useState([]);
  const [templateOptions, setTemplateOptions] = useState([]);
  const editeMode = actionData ? true : false;
  const [formRef] = Form.useForm();

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

  // const onLoadPages = (languageCode) => {
  //   if (!languageCode) return;

  //   setLoading({ ...loading, pages: true });
  //   _service({
  //     url: "page/list",
  //     method: "POST",
  //     data: {
  //       filters: {
  //         language_code: languageCode,
  //       },
  //     },
  //     success: (response) => {
  //       setLoading({ ...loading, pages: false });
  //       const { items } = response.json.page;
  //       setPages(
  //         items.filter((page) => !pageData || page.uid !== pageData.uid)
  //       );
  //     },
  //     fail: (error) => {
  //       setLoading({ ...loading, pages: false });
  //       console.error(error);
  //       notification.error({
  //         message: "Falha ao carregar páginas.",
  //       });
  //     },
  //   });
  // };

  const onFinish = (values) => {
    const data = {
      ...values,
      language_code: values.language_code?.value,
    };

    if (editeMode) {
      setLoading({ ...loading, saving: true });
      _service({
        url: "actions",
        method: "PUT",
        data: {
          ...data,
          uid: actionData.uid,
          language_code: actionData.language_code,  
        },
        success: (response) => {
          setLoading({ ...loading, saving: false });
          setIsModalOpen(false);
          onReloadTable();
          notification.success({
            message: Cluar.plainDictionary("page-form-edit-success-message"),
          });
        },
        fail: (error) => {
          setLoading({ ...loading, saving: false });
          console.log(error);

          if (error?.json?.error_code) {
            notification.error({
              message: Cluar.plainDictionary("page-form-edit-failed-message"),
              description: Cluar.plainDictionary(error.json.error_code),
            });
            return;
          }
          notification.error({
            message: Cluar.plainDictionary("page-form-edit-failed-message"),
          });
        },
      });
    } else {
      setLoading({ ...loading, saving: true });
      _service({
        url: "actions",
        method: "POST",
        data: {
          ...data,
        },
        success: (response) => {
          setLoading({ ...loading, saving: false });
          setIsModalOpen(false);
          onReloadTable();
          notification.success({
            message: Cluar.plainDictionary("page-form-save-success-message"),
          });
        },
        fail: (error) => {
          setLoading({ ...loading, saving: false });
          console.log(error);

          if (error?.json?.error_code) {
            notification.error({
              message: Cluar.plainDictionary("page-form-save-failed-message"),
              description: Cluar.plainDictionary(error.json.error_code),
            });
            return;
          }
          notification.error({
            message: Cluar.plainDictionary("page-form-save-failed-message"),
          });
        },
      });
    }
  };

  console.log("actionsData", actionData)

  useImperativeHandle(ref, () => {
    return {
      openModal: onOpenModal,
    };
  }, []);

  useEffect(() => {
    _service({
      url: "/page/template/list",
      method: "POST",
      success: (res) => {
        setTemplateOptions(res.json.templates);
      },
      fail: (error) => {
        console.log(error);
      },
    });
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      onLoadLanguages();

      if (editeMode) {
        formRef.setFieldsValue({
          ...actionData,
          language_code: actionData.language_code,
        });
      }
    }
  }, [isModalOpen]);

  // const handleLanguageChange = (value) => {
  //   onLoadPages(value.value);
  // };

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
              //   onChange={handleLanguageChange}
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
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
})

export default ActionsModal;