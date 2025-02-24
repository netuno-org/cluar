import {
    Button,
    Col,
    Form,
    Input,
    Modal,
    notification,
    Row,
    Select
} from "antd";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import _service from "@netuno/service-client";

const ConfigurationModal = forwardRef(({ configurationData, onReloadTable }, ref) => {
    const configColumn = {
        xs: {
            span: 24
        },
        sm: {
            span: 12
        }
    }
    const [isModalOpen, setIsModalOpen] = useState(false);
    const editeMode = configurationData ? true : false;
    const [formRef] = Form.useForm();
    const [languages, setLanguages] = useState([]);
    const [parameters, setParameters] = useState([]);
    const [loading, setLoading] = useState({
        save: false,
        language: false,
        parameter: false
    });

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

    const onLoadParameters = () => {
        setLoading({ ...loading, parameter: true });
        _service({
            url: "configuration/parameter/list",
            method: "GET",
            success: (response) => {
                setLoading({ ...loading, parameter: false });
                setParameters(response.json.parameters);
            },
            fail: (error) => {
                setLoading({ ...loading, parameter: false });
                console.error(error);
                notification.error({
                    message: "Falha ao carregar paramêtros."
                })
            }
        })
    }

    const onOpenModal = () => {
        setIsModalOpen(true);
    }

    const onFinish = (values) => {
        const data = {
            ...values,
            parameter_code:values.parameter_code.value,
            language_code:values.language_code.value
        };
        if (editeMode) {
            setLoading({ ...loading, save: true });
            _service({
                url: "configuration",
                method: "PUT",
                data: {
                    uid: configurationData.uid,
                    ...data
                },
                success: (reponse) => {
                    setLoading({ ...loading, save: false });
                    setIsModalOpen(false);
                    notification.success({
                        message: "Configuração atualizada com sucesso."
                    })
                    onReloadTable();
                },
                fail: (error) => {
                    setLoading({ ...loading, save: false });
                    console.error(error);
                    notification.error({
                        message: "Falha ao atualizar configuração."
                    });
                }
            });
        } else {
            console.log("ta batendo aqui")
            setLoading({ ...loading, save: true });
            _service({
                url: "configuration",
                method: "POST",
                data: {
                    ...data
                },
                success: (reponse) => {
                    setLoading({ ...loading, save: false });
                    setIsModalOpen(false);
                    notification.success({
                        message: "Configuração registada com sucesso."
                    })
                    onReloadTable();
                },
                fail: (error) => {
                    setLoading({ ...loading, save: false });
                    console.error(error);
                    notification.error({
                        message: "Falha ao registar configuração."
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
        if (editeMode && isModalOpen) {
            formRef.setFieldsValue({
                ...configurationData,
                parameter_code: {
                    value: configurationData.parameter.code,
                    label: configurationData.parameter.description
                },
                language_code: {
                    value: configurationData.language.code,
                    label: configurationData.language.description
                }
            })
        }
    }, [isModalOpen]);

    useEffect(() => {
        onLoadLanguages();
        onLoadParameters();
    }, []);

    return (
        <Modal
            title={editeMode ? "Editar Configuração" : "Nova Configuração"}
            open={isModalOpen}
            maskClosable={false}
            onCancel={() => { setIsModalOpen(false) }}
            onClose={() => { setIsModalOpen(false) }}
            destroyOnClose
            afterClose={() => formRef.resetFields()}
            centered
            footer={[
                <Button
                    onClick={() => { setIsModalOpen(false) }}
                >
                    Cancelar
                </Button>,
                <Button
                    type="primary"
                    loading={loading.save}
                    onClick={() => formRef.submit()}
                >
                    Guardar
                </Button>
            ]}
        >
            <Form
                layout="vertical"
                form={formRef}
                onFinish={onFinish}
            >
                <Row justify={"space-between"} align={"middle"} gutter={[10, 0]}>
                    <Col {...configColumn}>
                        <Form.Item
                            label="Paramêtro"
                            name={"parameter_code"}
                            rules={[{ required: true, message: "Selecione um paramêtro." }]}
                        >
                            <Select
                                loading={loading.parameter}
                                labelInValue
                                options={parameters.map((parameter) => ({
                                    label: parameter.description,
                                    value: parameter.code
                                }))}
                            />
                        </Form.Item>
                    </Col>
                    <Col  {...configColumn}>
                        <Form.Item
                            label="Idioma"
                            name={"language_code"}
                            rules={[{ required: true, message: "Selecione um Idioma." }]}
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
                            label="Valor"
                            name={"value"}
                            rules={[{ required: true, message: "Insira um Valor." }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
})

export default ConfigurationModal;