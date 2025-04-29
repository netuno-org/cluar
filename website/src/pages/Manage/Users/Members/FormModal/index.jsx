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

const debounces = {}

const MembersFormModal = forwardRef(({ onReloadTable, memberData, userData }, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [organizations, setOrganizations] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState({
        saving: false,
        organization: false,
        group: false
    });
    
    const  [filters, setFilters] = useState({
        option:"",
        value:""
    }); 
    const editeMode = memberData ? true : false;
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
                pagination:{
                    size:10,
                    page:1
                },
                filters:{
                    name:filters.value
                }
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

    const onLoadGroups = () => {
        setLoading({ ...loading, group: true });
        _service({
            url: "user/group/list",
            method: "GET",
            data: {},
            success: (response) => {
                setLoading({ ...loading, group: false });
                const { groups } = response.json;
                setGroups(groups);
            },
            fail: (error) => {
                setLoading({ ...loading, group: false });
                console.log(error);
            }
        })
    }

    const onFilter = (filter) => {
        const {option, value} = filter;
        if (debounces[option]) {
            clearTimeout(debounces[option])
        }

        debounces[option] = setTimeout(() => {
            setFilters({option, value});
        }, 600);
    }

    const clearfilters = (option) => {
        setFilters({option, value:""});
    }

    const onFinish = (values) => {
        const data = {
            ...values,
            organization_code:values.organization_code.value,
            group_code:values.group_code.value,
            people_uid: values.user_uid.value
        }

        if (editeMode) {
            setLoading({ ...loading, saving: true });
            _service({
                url: "organization/member",
                method: "PUT",
                data: {
                    ...data,
                    uid: memberData.uid
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

                    if (error?.json?.error_code === "person-already-member") {
                        notification.error({
                            description: Cluar.plainDictionary('members-form-already-exists-validation-message'),
                            message: Cluar.plainDictionary('members-form-edit-failed-message')
                        });
                        return;
                    }
                    notification.error({
                        message: Cluar.plainDictionary('members-form-edit-failed-message')
                    });
                }
            })
        } else {
            setLoading({ ...loading, saving: true });
            _service({
                url: "organization/member",
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

                    if (error?.json?.error_code === "person-already-member") {
                        notification.error({
                            description: Cluar.plainDictionary('members-form-already-exists-validation-message'),
                            message: Cluar.plainDictionary('members-form-save-failed-message')
                        });
                        return;
                    }
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
            formRef.setFieldsValue({
                ...memberData,
                user_uid:{
                    label: userData?.name,
                    value: userData?.uid
                },
                group_code:{
                    label: memberData.group.name,
                    value: memberData.group.code
                },
                organization_code:{
                    label: memberData.organization.name,
                    value: memberData.organization.code
                }
            })
        } else {
            formRef.setFieldsValue({
                user_uid:{
                    label: userData?.name,
                    value: userData?.uid
                },
            })
        }
    }, [isModalOpen]);

    useEffect(() => {
        onLoadOrganizations();
        onLoadGroups();
    }, []);

    useEffect(() => {
        if (filters.option === "organization") {
            onLoadOrganizations();
        }
    }, [filters]);

    return (
        <Modal
            title={editeMode ? Cluar.plainDictionary('members-modal-edit-title') : Cluar.plainDictionary('members-modal-new-title')}
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
                                disabled
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="organization_code"
                            label={Cluar.plainDictionary('members-form-organization')}
                            rules={[{ required: true, message: Cluar.plainDictionary('members-form-validate-message-required') }]}
                        >
                            <Select
                                labelInValue
                                showSearch
                                filterOption = {false}
                                allowClear
                                onClear={() => {clearfilters("organization")}}
                                onSearch={(value) => onFilter({option:"organization", value})}
                                listHeight={200}
                                options={organizations.map((organization) => ({
                                    label: organization.name,
                                    value: organization.code
                                }))}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="group_code"
                            label={Cluar.plainDictionary('members-form-group')}
                            rules={[{ required: true, message: Cluar.plainDictionary('members-form-validate-message-required') }]}
                        >
                            <Select
                                labelInValue
                                showSearch
                                listHeight={200}
                                options={groups.map((group) => ({
                                    label: group.name,
                                    value: group.code
                                }))}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
})

export default MembersFormModal;