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
    const [groups, setGroups] = useState([]);
    const [loadingGroup, setLoadingGroup] = useState(false);
    const [onFinishLoading, setOnFinishLoading] = useState(false);
    const [formRef] = Form.useForm();
    const editMode = userData ? true : false;

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

    const getGroups = () => {
        setLoadingGroup(true);
        _service({
            method: "GET",
            url: "user/group/list",
            success: (response) => {
                setLoadingGroup(false);
                setGroups(response.json.groups);
            },
            fail: (error) => {
                setLoadingGroup(false);
                console.error(error);
                notification.error({
                    message: Cluar.plainDictionary('users-form-load-groups-failed-message')
                })
            }
        })
    }

    useImperativeHandle(ref, () => {
        return {
            openModal,
        };
    }, []);


    useEffect(() => {
        if (editMode && isModalOpen) {
            formRef.setFieldsValue({
                ...userData,
                group_code: {
                    value: userData.group.code,
                    label: userData.group.name
                }
            })
        }
    }, [isModalOpen])

    const onFinish = (values) => {
        const data = {
            ...values,
            group_code: values.group_code.value
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
        getGroups();
    }, []);

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
                        <Col {...configColumn}>
                            <Form.Item
                                label={Cluar.plainDictionary('users-form-email')}
                                name="email"
                                rules={[{ required: true, type: "email", message: Cluar.plainDictionary('users-form-validate-message-required') }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col {...configColumn}>
                            <Form.Item
                                label={Cluar.plainDictionary('users-form-group')}
                                name="group_code"
                                rules={[{ required: true, message: Cluar.plainDictionary('users-form-validate-message-required') }]}
                            >
                                <Select
                                    loading={loadingGroup}
                                    labelInValue={true}
                                    options={groups.map((group) => ({
                                        value: group.code, label: group.name
                                    }))}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    )
})

export default UserModal;