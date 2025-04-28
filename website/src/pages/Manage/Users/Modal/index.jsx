import {
    Modal,
    Button,
    Form,
    Input,
    Row,
    Col,
    Switch,
    notification,
    Select
} from "antd";
import { useState, useImperativeHandle, forwardRef, useEffect } from "react";
import _service from '@netuno/service-client';
import Cluar from "../../../../common/Cluar";

import "./index.less"

const UserModal = forwardRef(({ userData, onReloadTable }, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [organizations, setOrganizations] = useState([]);
    const [groups, setGroups] = useState([]);
    const [onFinishLoading, setOnFinishLoading] = useState(false);
    const [loading, setLoading] = useState({
        organization: false,
        group: false
    });
    const [formRef] = Form.useForm();
    const editMode = userData ? true : false;
    const [filters, setFilters] = useState({
        option: "",
        value: ""
    });

    const configColumn = {
        xs: {
            span: 24
        },
        sm: {
            span: 12
        }
    }

    const onLoadOrganizations = () => {
        setLoading({ ...loading, organization: true });
        _service({
            url: "organization/list",
            method: "POST",
            data: {
                pagination: {
                    size: 10,
                    page: 1
                },
                filters: {
                    name: filters.value
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
        const { option, value } = filter;
        if (debounces[option]) {
            clearTimeout(debounces[option])
        }

        debounces[option] = setTimeout(() => {
            setFilters({ option, value });
        }, 600);
    }

    const clearfilters = (option) => {
        setFilters({ option, value: "" });
    }

    const openModal = () => {
        setIsModalOpen(true);
    }

    useImperativeHandle(ref, () => {
        return {
            openModal,
        };
    }, []);


    useEffect(() => {
        if (editMode && isModalOpen) {
            formRef.setFieldsValue({
                ...userData
            })
        }
    }, [isModalOpen])

    const onFinish = (values) => {
        const data = {
            ...values,
            organization_code: values?.organization_code?.value,
            group_code: values?.group_code?.value,
        }
        setOnFinishLoading(true);
        if (userData) {
            _service({
                method: "PUT",
                url: "user/",
                data: {
                    ...data,
                    uid: userData.uid
                },
                success: (response) => {
                    setOnFinishLoading(false);
                    notification.success({
                        message: Cluar.plainDictionary('users-form-edit-success-message')
                    });
                    setIsModalOpen(false);
                    onReloadTable();
                },
                fail: (error) => {
                    setOnFinishLoading(false);
                    console.error(error);
                    notification.error({
                        message: Cluar.plainDictionary('users-form-edit-failed-message')
                    })
                }
            })
        } else {
            _service({
                method: "POST",
                url: "user/",
                data: {
                    ...data
                },
                success: (response) => {
                    setOnFinishLoading(false);
                    notification.success({
                        message: Cluar.plainDictionary('users-form-save-success-message')
                    });
                    setIsModalOpen(false);
                    onReloadTable();
                },
                fail: (error) => {
                    setOnFinishLoading(false);
                    console.error(error);
                    notification.error({
                        message: Cluar.plainDictionary('users-form-save-failed-message')
                    })
                }
            })
        }
    }

    useEffect(() => {
        onLoadGroups();
        onLoadOrganizations()
    }, [])

    return (
        <div className="modal-content">
            <Modal
                title={userData ? Cluar.plainDictionary('users-modal-title-edit') : Cluar.plainDictionary('users-modal-title-new')}
                maskClosable={false}
                destroyOnClose={true}
                centered
                open={isModalOpen}
                onOk={() => { }}
                onCancel={() => setIsModalOpen(false)}
                afterClose={() => formRef.resetFields()}
                footer={[
                    <Button key="back" onClick={() => setIsModalOpen(false)}>
                        {Cluar.plainDictionary('users-form-cancel')}
                    </Button>,
                    <Button key="send" type="primary" onClick={() => { formRef.submit() }} loading={onFinishLoading}>
                        {Cluar.plainDictionary('users-form-save')}
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
                                label={Cluar.plainDictionary('users-form-active')}
                                name="active"
                                initialValue={false}
                            >
                                <Switch size="default" />
                            </Form.Item>
                        </Col>
                        <Col {...configColumn}>
                            <Form.Item
                                label={Cluar.plainDictionary('users-form-name')}
                                name="name"
                                rules={[{ required: true, message: Cluar.plainDictionary('users-form-validate-message-required') }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col {...configColumn}>
                            <Form.Item
                                label={Cluar.plainDictionary('users-form-username')}
                                name="username"
                                rules={[{ required: true, message: Cluar.plainDictionary('users-form-validate-message-required') }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col {...configColumn}>
                            <Form.Item
                                label={Cluar.plainDictionary('users-form-password')}
                                name="password"
                                rules={[{ required: userData ? false : true, message: Cluar.plainDictionary('users-form-validate-message-required') }]}
                            >
                                <Input.Password autoComplete="off" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label={Cluar.plainDictionary('users-form-email')}
                                name="email"
                                rules={[{ required: true, type: "email", message: Cluar.plainDictionary('users-form-validate-message-required') }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        {!editMode && (
                            <>
                                <Col span={24}>
                                    <Form.Item
                                        name="organization_code"
                                        label={Cluar.plainDictionary('members-form-organization')}
                                        rules={[{ required: true, message: Cluar.plainDictionary('members-form-validate-message-required') }]}
                                    >
                                        <Select
                                            labelInValue
                                            showSearch
                                            filterOption={false}
                                            allowClear
                                            onClear={() => { clearfilters("organization") }}
                                            onSearch={(value) => onFilter({ option: "organization", value })}
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
                            </>
                        )}
                    </Row>
                </Form>
            </Modal>
        </div>
    )
})

export default UserModal;