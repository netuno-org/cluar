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
import Cluar from "../../../../../common/Cluar";

const MembersModal = forwardRef(({ onReloadTable, organizationData }, ref) => {
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
            data: {},
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
                        message: Cluar.plainDictionary('members-form-edit-success-message')
                    });
                },
                fail: (error) => {
                    setLoading({ ...loading, saving: false });
                    console.log(error);
                    notification.error({
                        message: Cluar.plainDictionary('members-form-edit-failed-message')
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
                        message: Cluar.plainDictionary('members-form-save-success-message')
                    });
                },
                fail: (error) => {
                    setLoading({ ...loading, saving: false });
                    console.log(error);
                    notification.error({
                        message: Cluar.plainDictionary('members-form-save-failed-message')
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

        }
    }, [isModalOpen]);

    useEffect(() => {
        onLoadOrganizations();
    }, []);

    return (
        <Modal
            title={editeMode ? Cluar.plainDictionary('members-modal-new-title') : Cluar.plainDictionary('members-modal-edit-title')}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onClose={() => setIsModalOpen(false)}
            destroyOnClose
            maskClosable={false}
            afterClose={() => formRef.resetFields()}
            centered
            footer={[
                <Button onClick={() => setIsModalOpen(false)}>
                    {Cluar.plainDictionary('members-form-cancel')}
                </Button>,
                <Button type="primary" onClick={() => formRef.submit()} loading={loading.saving} disabled={loading.saving}>
                    {Cluar.plainDictionary('members-form-save')}
                </Button>
            ]}
        >
            <Form
                layout="vertical"
                form={formRef}
                onFinish={onFinish}
            >
                <Row justify={"space-between"} align={"middle"} gutter={[10, 0]} >
                    <Col>
                        <Form.Item
                            name="active"
                            label={Cluar.plainDictionary('members-form-active')}
                            initialValue={false}
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="user_uid"
                            label={Cluar.plainDictionary('members-form-user')}
                            rules={[{ required: true, message: Cluar.plainDictionary('members-form-validate-message-required') }]}
                        >
                            <Select
                                labelInValue
                                showSearch
                                listHeight={200}
                                options={organizations.map((organization) => ({
                                    label: organization.name,
                                    value: organization.uid
                                }))}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="organization_uid"
                            label={Cluar.plainDictionary('members-form-organization')}
                            rules={[{ required: true, message: Cluar.plainDictionary('members-form-validate-message-required') }]}
                        >
                            <Select
                                labelInValue
                                showSearch
                                listHeight={200}
                                options={organizations.map((organization) => ({
                                    label: organization.name,
                                    value: organization.uid
                                }))}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="group_uid"
                            label={Cluar.plainDictionary('members-form-group')}
                            rules={[{ required: true, message: Cluar.plainDictionary('members-form-validate-message-required') }]}
                        >
                            <Select
                                labelInValue
                                showSearch
                                listHeight={200}
                                options={organizations.map((organization) => ({
                                    label: organization.name,
                                    value: organization.uid
                                }))}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
})

export default MembersModal;