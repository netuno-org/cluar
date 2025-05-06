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
import _service from "@netuno/service-client";
import Cluar from "../../../../common/Cluar";
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
                        message: Cluar.plainDictionary('language-form-edit-success-message')
                    });
                },
                fail: (error) => {
                    setLoading(false);
                    console.log(error);
                    notification.error({
                        message: Cluar.plainDictionary('language-form-edit-failed-message')
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
                        message: Cluar.plainDictionary('language-form-save-success-message')
                    });
                },
                fail: (error) => {
                    setLoading(false);
                    console.log(error);
                    notification.error({
                        message: Cluar.plainDictionary('language-form-save-failed-message')
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
            title={editeMode ? Cluar.plainDictionary('language-modal-new-title') : Cluar.plainDictionary('language-modal-new-title')}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onClose={() => setIsModalOpen(false)}
            destroyOnClose
            maskClosable={false}
            afterClose={() => formRef.resetFields()}
            centered
            footer={[
                <Button onClick={() => setIsModalOpen(false)}>
                    {Cluar.plainDictionary('language-form-cancel')}
                </Button>,
                <Button type="primary" onClick={() => formRef.submit()} loading={loading} disabled={loading}>
                    {Cluar.plainDictionary('language-form-save')}
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
                            label={Cluar.plainDictionary('language-form-active')}
                            initialValue={false}
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col {...configColumn}>
                        <Form.Item
                            name="default"
                            label={Cluar.plainDictionary('language-form-default')}
                            initialValue={false}
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col {...configColumn}>
                        <Form.Item
                            name="description"
                            label={Cluar.plainDictionary('language-form-description')}
                            rules={[{ required: true, message: Cluar.plainDictionary('language-form-validate-message-required')}]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col {...configColumn}>
                        <Form.Item
                            name="code"
                            label={Cluar.plainDictionary('language-form-code')}
                            rules={[{ required: true, message: Cluar.plainDictionary('language-form-validate-message-required') }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="locale"
                            label={Cluar.plainDictionary('language-form-locale')}
                            rules={[{ required: true, message: Cluar.plainDictionary('language-form-validate-message-required')}]}
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