import {
    Button,
    Modal,
    Form,
    Row,
    Col,
    Select,
    Input
} from "antd";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import _service from "@netuno/service-client";

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
        entry: false
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
            title={editeMode ? "Editar Dicionário" : "Novo Dicionário"}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onClose={() => { setIsModalOpen(false) }}
            destroyOnClose
            centered

            afterClose={() => formRef.resetFields()}
            footer={[
                <Button onClick={() => setIsModalOpen(false)} >Cancelar</Button>,
                <Button
                    type="primary"
                >
                    Guardar
                </Button>
            ]}
        >
            <Form
                layout="vertical"
                form={formRef}
            >
                <Row justify={"space-between"} align={"middle"} gutter={[10, 0]} >
                    <Col span={24}>
                        <Form.Item
                            name="language_code"
                            label="Idioma"
                            rules={[{ required: true, message: "Selecione um idioma." }]}
                        >
                            <Select
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
                            label="Chave"
                            rules={[{ required: true, message: "Selecione uma chave." }]}
                        >
                            <Select
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
                            label="Valor"
                            rules={[{ required: true, message: "Insira um valor." }]}
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