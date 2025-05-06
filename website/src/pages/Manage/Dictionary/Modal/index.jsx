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
        save:false
    });

    const onOpenModal = () => {
        setIsModalOpen(true);
    }

    const onLoadLanguages = () => {
        setLoading({ ...loading, language: true });
        _service({
            url: "language/list",
            method: "POST",
            success: (response) => {
                setLoading({ ...loading, language: false });
                const { items } = response.json.page;
                setLanguages(items);
            },
            fail: (error) => {
                setLoading({ ...loading, language: false });
                console.error(error);
                notification.error({
                    message: "Falha ao carregar idiomas."
                })
            }
        })
    }

    const onLoadEntries = () => {
        setLoading({ ...loading, entry: true });
        _service({
            url: "dictionary/entry/list",
            method: "POST",
            success: (response) => {
                setLoading({ ...loading, entry: false });
                setEntries(response.json.entries);
            },
            fail: (error) => {
                setLoading({ ...loading, entry: false });
                console.error(error);
                notification.error({
                    message: "Falha ao carregar chaves."
                })
            }
        })
    }

    const onFinish = (values) => {
        console.log(values)
        const data = {
            ...values,
            language_code:values.language_code.value,
            entry_code:values.entry_code.value
        }
        if (editeMode) {
            setLoading({...loading, save:true});
            _service({
                url:"dictionary",
                method:"PUT",
                data:{
                    uid:dictionaryData.uid,
                    ...data
                },
                success: (response) => {
                    setLoading({...loading, save:false});
                    notification.success({
                        message: Cluar.plainDictionary('dictionary-form-edit-success-message')
                    });
                    setIsModalOpen(false);
                    onReloadTable();
                },
                fail: (error) => {
                    console.error(error);
                    setLoading({...loading, save:false});
                    notification.error({
                        message: Cluar.plainDictionary('dictionary-form-edit-failed-message')
                    });
                }
            });
        } else {
            setLoading({...loading, save:true});
            _service({
                url:"dictionary",
                method:"POST",
                data:{
                    ...data
                },
                success: (response) => {
                    setLoading({...loading, save:false});
                    notification.success({
                        message: Cluar.plainDictionary('dictionary-form-new-success-message')
                    });
                    setIsModalOpen(false);
                    onReloadTable();
                },
                fail: (error) => {
                    console.error(error);
                    setLoading({...loading, save:false});
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
                language_code:{
                    label:dictionaryData.language.description,
                    value:dictionaryData.language.code
                },
                entry_code:{
                    label:dictionaryData.entry.description,
                    value:dictionaryData.entry.code
                }
            });
        }
    }, [isModalOpen])

    return (
        <Modal
            title={editeMode ? Cluar.plainDictionary('dictionary-modal-edit-title') : Cluar.plainDictionary('dictionary-modal-new-title')}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onClose={() => { setIsModalOpen(false) }}
            destroyOnClose
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
                            name="language_code"
                            label={Cluar.plainDictionary('dictionary-form-language')}
                            rules={[{ required: true, message: Cluar.plainDictionary('dictionary-form-validate-message-required') }]}
                        >
                            <Select
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
                            name="entry_code"
                            label={Cluar.plainDictionary('dictionary-form-entry')}
                            rules={[{ required: true, message: Cluar.plainDictionary('dictionary-form-validate-message-required')}]}
                        >
                            <Select
                                labelInValue
                                showSearch
                                optionFilterProp="label"
                                listHeight={200}
                                options={entries.map((entry) => ({
                                    label: entry.description,
                                    value: entry.code
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