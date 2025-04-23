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

const MembersModal = forwardRef(({ onReloadTable, memberData }, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [organizations, setOrganizations] = useState([]);
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState({
        saving: false,
        organization: false,
        user: false,
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

    const onLoadUsers = () => {
        setLoading({ ...loading, user: true });
        _service({
            url: "user/list",
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
                setLoading({ ...loading, user: false });
                const { items } = response.json.page;
                setUsers(items);
            },
            fail: (error) => {
                setLoading({ ...loading, user: false });
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
            parent_code: values.parent_code ? values.parent_code.value : ""
        }

        if (editeMode) {
            setLoading({ ...loading, saving: true });
            _service({
                url: "organization",
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
        onLoadGroups();
        onLoadUsers();
    }, []);

    useEffect(() => {
        if (filters.option === "user") {
            onLoadUsers();
        }
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
                                loading={loading.user}
                                showSearch
                                filterOption={false}
                                allowClear
                                onClear={() => {clearfilters("user")}}
                                onSearch={(value) => onFilter({option:"user", value})}
                                listHeight={200}
                                options={users.map((user) => ({
                                    label: user.name,
                                    value: user.uid
                                }))}
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

export default MembersModal;