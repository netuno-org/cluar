import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Select,
  Input,
  notification
} from "antd";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import _service from "@netuno/service-client";
import Cluar from "../../../../common/Cluar";
import DictionaryEntrySelect from "./DictionaryEntrySelect";

const DictionaryModal = forwardRef(({ dictionaryData, onReloadTable }, ref) => {
  const configColumn = {
    xs: {
      span: 24
    },
    sm: {
      span: 12
    }
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const editeMode = dictionaryData ? true : false;
  const [formRef] = Form.useForm();
  const [languages, setLanguages] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState({
    language: false,
    entry: false,
    save: false
  });

  const onOpenModal = () => {
    setIsModalOpen(true);
  }

  const onLoadLanguages = () => {
    setLoading((prev) => ({ ...prev, language: true }));
    _service({
      url: "reserved-area/language/list",
      method: "POST",
      success: (response) => {
        setLoading((prev) => ({ ...prev, language: false }));
        const { items } = response.json.page;
        setLanguages(items);
      },
      fail: (error) => {
        setLoading((prev) => ({ ...prev, language: false }));
        console.error(error);
        notification.error({
          message: "Falha ao carregar idiomas."
        })
      }
    })
  }

  const onLoadEntries = () => {
    setLoading((prev) => ({ ...prev, entry: true }));
    _service({
      url: "reserved-area/dictionary/entry/list",
      method: "POST",
      success: (response) => {
        setLoading((prev) => ({ ...prev, entry: false }));
        setEntries(response.json.entries);
      },
      fail: (error) => {
        setLoading((prev) => ({ ...prev, entry: false }));
        console.error(error);
        notification.error({
          message: "Falha ao carregar chaves."
        })
      }
    })
  }

  const onFinish = (values) => {
    const data = {
      ...values,
      language_code: values.language_code.value,
      entry_code: values.entry_code
    }
    if (editeMode) {
      setLoading((prev) => ({ ...prev, save: true }));
      _service({
        url: "reserved-area/dictionary",
        method: "PUT",
        data: {
          uid: dictionaryData.uid,
          ...data
        },
        success: (response) => {
          setLoading((prev) => ({ ...prev, save: false }));
          notification.success({
            message: Cluar.plainDictionary('dictionary-form-edit-success-message')
          });
          setIsModalOpen(false);
          onReloadTable();
        },
        fail: (error) => {
          console.error(error);
          setLoading((prev) => ({ ...prev, save: false }));
          notification.error({
            message: Cluar.plainDictionary('dictionary-form-edit-failed-message')
          });
        }
      });
    } else {
      setLoading((prev) => ({ ...prev, save: true }));
      _service({
        url: "reserved-area/dictionary",
        method: "POST",
        data: {
          ...data
        },
        success: (response) => {
          setLoading((prev) => ({ ...prev, save: false }));
          notification.success({
            message: Cluar.plainDictionary('dictionary-form-new-success-message')
          });
          setIsModalOpen(false);
          onReloadTable();
        },
        fail: (error) => {
          console.error(error);
          setLoading((prev) => ({ ...prev, save: false }));
          notification.error({
            message: Cluar.plainDictionary('dictionary-form-new-failed-message')
          });
        }
      });
    }
  }

  useImperativeHandle(ref, () => {
    return {
      onOpenModal
    }
  }, []);

  useEffect(() => {
    onLoadEntries();
    onLoadLanguages();
  }, []);

  useEffect(() => {
    if (editeMode && isModalOpen) {
      formRef.setFieldsValue({
        ...dictionaryData,
        language_code: {
          label: dictionaryData.language.description,
          value: dictionaryData.language.code
        },
        entry_code: dictionaryData.entry.code
      });
    }
  }, [isModalOpen])

  return (
    <Modal
      title={editeMode ? Cluar.plainDictionary('dictionary-modal-edit-title') : Cluar.plainDictionary('dictionary-modal-new-title')}
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      onClose={() => { setIsModalOpen(false) }}
      destroyOnHidden
      centered

      afterClose={() => formRef.resetFields()}
      footer={[
        <Button onClick={() => setIsModalOpen(false)} > {Cluar.plainDictionary('dictionary-form-cancel')} </Button>,
        <Button
          type="primary"
          onClick={() => formRef.submit()}
          loading={loading.save}
        >
          {Cluar.plainDictionary('dictionary-form-save')}
        </Button>
      ]}
    >
      <Form
        layout="vertical"
        form={formRef}
        onFinish={onFinish}
      >
        <Row justify={"space-between"} align={"middle"} gutter={[10, 0]} >
          <Col span={24}>
            <Form.Item
              name="entry_code"
              label={Cluar.plainDictionary('dictionary-form-entry')}
              rules={[{ required: true, message: Cluar.plainDictionary('dictionary-form-validate-message-required') }]}
            >
              <DictionaryEntrySelect
                entries={entries}
                loading={loading.entry}
                onEntriesChange={setEntries}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="language_code"
              label={Cluar.plainDictionary('dictionary-form-language')}
              rules={[{ required: true, message: Cluar.plainDictionary('dictionary-form-validate-message-required') }]}
            >
              <Select
                loading={loading.language}
                labelInValue
                options={languages.map((language) => ({
                  label: language.description,
                  value: language.code
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="value"
              label={Cluar.plainDictionary('dictionary-form-value')}
              rules={[{ required: true, message: Cluar.plainDictionary('dictionary-form-validate-message-required') }]}
            >
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})

export default DictionaryModal;
