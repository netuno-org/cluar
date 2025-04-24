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

const OrganizationModal = forwardRef(({ onReloadTable, organizationData }, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState({
        saving: false,
        organization: false
    });
    const editeMode = organizationData ? true : false;
    const [formRef] = Form.useForm();

    const onOpenModal = () => {
        setIsModalOpen(true);
    }

    const onLoadOrganizations = () => {
        setLoading({ ...loading, organization: true });
        _service({
            url: "organization/list",
            method: "POST",
            data: {

            },
            success: (response) => {
                setLoading({ ...loading, organization: false });
                const { organizations } = response.json;
                setOrganizations(organizations);
            },
            fail: (error) => {
                setLoading({ ...loading, organization: false });
                console.log(error);
            }
        })
    }

    const onFinish = (values) => {
        const data = {
            ...values,
            parent_code: values.parent_code ? values.parent_code.value : ""
        }

        if (editeMode) {
            setLoading({ ...loading, saving: true });
            _service({
                url: "organization",
                method: "PUT",
                data: {
                    ...data,
                    uid: organizationData.uid
                },
                success: (response) => {
                    setLoading({ ...loading, saving: false });
                    setIsModalOpen(false);
                    onReloadTable();
                    notification.success({
                        message: Cluar.plainDictionary('organization-form-edit-success-message')
                    });
                },
                fail: (error) => {
                    setLoading({ ...loading, saving: false });
                    console.log(error);

                    if (error?.json?.error_code === "code-alread-in-use") {
                        notification.error({
                            message: Cluar.plainDictionary('organization-form-edit-failed-message'),
                            description: Cluar.plainDictionary('organization-form-already-exists-message')
                        });
                        return;
                    }
                    notification.error({
                        message: Cluar.plainDictionary('organization-form-edit-failed-message')
                    });
                }
            })
        } else {
            setLoading({ ...loading, saving: true });
            _service({
                url: "organization",
                method: "POST",
                data: {
                    ...data
                },
                success: (response) => {
                    setLoading({ ...loading, saving: false });
                    setIsModalOpen(false);
                    onReloadTable();
                    notification.success({
                        message: Cluar.plainDictionary('organization-form-save-success-message')
                    });
                },
                fail: (error) => {
                    setLoading({ ...loading, saving: false });
                    console.log(error);

                    if (error?.json?.error_code === "code-alread-in-use") {
                        notification.error({
                            message: Cluar.plainDictionary('organization-form-save-failed-message'),
                            description: Cluar.plainDictionary('organization-form-already-exists-message')
                        });
                        return;
                    }
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
                ...organizationData,
                parent_code: {
                    label: organizationData?.parent?.name,
                    value: organizationData?.parent?.code
                }
            })
        }
    }, [isModalOpen]);

    useEffect(() => {
        onLoadOrganizations();
    }, []);

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
                <Button type="primary" onClick={() => formRef.submit()} loading={loading.saving} disabled={loading.saving}>
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
                            name="parent_code"
                            label={Cluar.plainDictionary('organization-form-parent')}
                            rules={[{ required: true, message: Cluar.plainDictionary('organization-form-validate-message-required') }]}
                        >
                            <Select
                                labelInValue
                                showSearch
                                optionFilterProp="label"
                                listHeight={200}
                                options={
                                    organizations
                                        .filter(organization => organization.uid != organizationData?.uid)
                                        .map((organization) => ({
                                            label: organization.name,
                                            value: organization.code
                                        }))
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="name"
                            label={Cluar.plainDictionary('organization-form-name')}
                            rules={[{ required: true, message: Cluar.plainDictionary('organization-form-validate-message-required') }]}
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
                </Row>
            </Form>
        </Modal>
    )
})

export default OrganizationModal;