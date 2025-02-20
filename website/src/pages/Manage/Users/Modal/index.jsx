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
                    message: "Falha ao carrear grupos."
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
                        message: "Utilizador atulizado com sucesso."
                    });
                    setIsModalOpen(false);
                    onReloadTable();
                },
                fail: (error) => {
                    setOnFinishLoading(false);
                    console.error(error);
                    notification.error({
                        message: "Falha ao atulizar utilizador."
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
                        message: "Utilizador registado com sucesso."
                    });
                    setIsModalOpen(false);
                    onReloadTable();
                },
                fail: (error) => {
                    setOnFinishLoading(false);
                    console.error(error);
                    notification.error({
                        message: "Falha ao registar utilizador."
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
                title={userData ? "Editar Utilizador" : "Novo Utilizador"}
                maskClosable={false}
                destroyOnClose={true}
                centered
                open={isModalOpen}
                onOk={() => { }}
                onCancel={() => setIsModalOpen(false)}
                afterClose={() => formRef.resetFields()}
                footer={[
                    <Button key="back" onClick={() => setIsModalOpen(false)}>
                        Cancelar
                    </Button>,
                    <Button key="send" type="primary" onClick={() => { formRef.submit() }} loading={onFinishLoading}>
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
                                label="Activo"
                                name="active"
                                initialValue={false}
                            >
                                <Switch size="default" />
                            </Form.Item>
                        </Col>
                        <Col {...configColumn}>
                            <Form.Item
                                label="Nome"
                                name="name"
                                rules={[{ required: true, message: "Insira em nome." }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col {...configColumn}>
                            <Form.Item
                                label="Utilizador"
                                name="username"
                                rules={[{ required: true, message: "Insira um utilizador." }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col {...configColumn}>
                            <Form.Item
                                label="Palavra-passe"
                                name="password"
                                rules={[{ required: userData ? false : true, message: "Insira uma palavra-passe." }]}
                            >
                                <Input.Password autoComplete="off" />
                            </Form.Item>
                        </Col>
                        <Col {...configColumn}>
                            <Form.Item
                                label="E-mail"
                                name="email"
                                rules={[{ required: true, type: "email", message: "Insira um e-mail válido" }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col {...configColumn}>
                            <Form.Item
                                label="Grupo"
                                name="group_code"
                                rules={[{ required: true, message: "Selecione um grupo." }]}
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