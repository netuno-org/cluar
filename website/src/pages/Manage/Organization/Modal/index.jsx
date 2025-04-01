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

const OrganizationModal = forwardRef(({ onReloadTable, languageData }, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const editeMode = languageData ? true : false;
    const [formRef] = Form.useForm();

    const onOpenModal = () => {
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
                        message: Cluar.plainDictionary('organization-form-edit-success-message')
                    });
                },
                fail: (error) => {
                    setLoading(false);
                    console.log(error);
                    notification.error({
                        message: Cluar.plainDictionary('organization-form-edit-failed-message')
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
                        message: Cluar.plainDictionary('organization-form-save-success-message')
                    });
                },
                fail: (error) => {
                    setLoading(false);
                    console.log(error);
                    notification.error({
                        message: Cluar.plainDictionary('organization-form-save-failed-message')
                    });
                }
            })
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
                ...languageData
            })
        }
    }, [isModalOpen]);

    return (
        <Modal
            title={editeMode ? Cluar.plainDictionary('organization-modal-new-title') : Cluar.plainDictionary('organization-modal-new-title')}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onClose={() => setIsModalOpen(false)}
            destroyOnClose
            maskClosable={false}
            afterClose={() => formRef.resetFields()}
            centered
            footer={[
                <Button onClick={() => setIsModalOpen(false)}>
                    {Cluar.plainDictionary('organization-form-cancel')}
                </Button>,
                <Button type="primary" onClick={() => formRef.submit()} loading={loading} disabled={loading}>
                    {Cluar.plainDictionary('organization-form-save')}
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
                            name="active"
                            label={Cluar.plainDictionary('organization-form-active')}
                            initialValue={false}
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="name"
                            label={Cluar.plainDictionary('organization-form-name')}
                            rules={[{ required: true, message: Cluar.plainDictionary('organization-form-validate-message-required')}]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="code"
                            label={Cluar.plainDictionary('organization-form-code')}
                            rules={[{ required: true, message: Cluar.plainDictionary('organization-form-validate-message-required') }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="parent_code"
                            label={Cluar.plainDictionary('organization-form-parent')}
                            rules={[{ required: true, message: Cluar.plainDictionary('organization-form-validate-message-required')}]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
})

export default OrganizationModal;