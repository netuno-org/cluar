import {
    Button,
    Col,
    Form,
    Input,
    Modal,
    Row,
    Switch,
    notification
} from "antd";
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState
} from "react";
import _service from "@netuno/service-client"
import "./index.less"

const LanguageModal = forwardRef(({ onReloadTable, languageData }, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const editeMode = languageData ? true : false;
    const [formRef] = Form.useForm();
    const configColumn = {
        xs: {
            span: 24
        },
        sm: {
            span: 12
        }
    }

    const openModal = () => {
        setIsModalOpen(true);
    }

    const onFinish = (values) => {
        if (editeMode) {
            setLoading(true);
            _service({
                url: "language",
                method: "PUT",
                data: {
                    ...values,
                    uid:languageData.uid
                },
                success: (response) => {
                    setLoading(false);
                    setIsModalOpen(false);
                    onReloadTable();
                    notification.success({
                        message: `Idioma editado com sucesso.`
                    });
                },
                fail: (error) => {
                    setLoading(false);
                    console.log(error);
                    notification.error({
                        message: `Falha ao editar idioma.`
                    });
                }
            })
        } else {
            setLoading(true);
            _service({
                url: "language",
                method: "POST",
                data: {
                    ...values
                },
                success: (response) => {
                    setLoading(false);
                    setIsModalOpen(false);
                    onReloadTable();
                    notification.success({
                        message: `Idioma registado com sucesso.`
                    });
                },
                fail: (error) => {
                    setLoading(false);
                    console.log(error);
                    notification.error({
                        message: `Falha ao registar idioma.`
                    });
                }
            })
        }
    }

    useImperativeHandle(ref, () => {
        return {
            openModal
        }
    }, []);

    useEffect(() => {
        if (editeMode && isModalOpen) {
            formRef.setFieldsValue({
                ...languageData
            })
        }
    }, [isModalOpen]);

    return (
        <Modal
            title={editeMode ? "Editar Idioma" : "Novo Idioma"}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onClose={() => setIsModalOpen(false)}
            destroyOnClose
            afterClose={() => formRef.resetFields()}
            centered
            footer={[
                <Button onClick={() => setIsModalOpen(false)}>
                    Cancelar
                </Button>,
                <Button type="primary" onClick={() => formRef.submit()} loading={loading} disabled={loading}>
                    Guardar
                </Button>
            ]}
        >
            <Form
                layout="vertical"
                form={formRef}
                onFinish={onFinish}
            >
                <Row justify={"space-between"} align={"middle"} gutter={[10, 0]} >
                    <Col {...configColumn}>
                        <Form.Item
                            name="active"
                            label="Activo"
                            initialValue={false}
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col {...configColumn}>
                        <Form.Item
                            name="default"
                            label="Padrão"
                            initialValue={false}
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col {...configColumn}>
                        <Form.Item
                            name="description"
                            label="Descrição"
                            rules={[{ required: true, message: "Insira uma descrição." }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col {...configColumn}>
                        <Form.Item
                            name="code"
                            label="Código"
                            rules={[{ required: true, message: "Insira um código." }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col {...configColumn}>
                        <Form.Item
                            name="locale"
                            label="Localidade"
                            rules={[{ required: true, message: "Insira uma uma localidate." }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
})

export default LanguageModal;