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

const UserModal = forwardRef(({ }, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groups, setGroups] = useState([]);
    const [loadingGroup, setLoadingGroup] = useState(false);
    const [onFinishLoading, setOnFinishLoading] = useState(false);
    const [formRef] = Form.useForm();

    const configColumn = {
        xs: {
            span: 24
        },
        sm: {
            span: 12
        }
    }

    const onCloseModal = () => {
        setIsModalOpen(false);
        formRef.resetFields();
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
            openModal
        }
    }, []);

    const onFinish = (values) => {
        setOnFinishLoading(true);
        _service({
            method: "POST",
            url: "user/",
            data:{
                ...values
            },
            success: (response) => {
               setOnFinishLoading(false);
               notification.success({
                message:"Utilizador registado com sucesso."
               });
               onCloseModal();
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

    useEffect(() => {
        getGroups();
    }, []);

    return (
        <div className="modal-content">
            <Modal
                title="Novo Utilizador"
                maskClosable={false}
                centered
                open={isModalOpen}
                onOk={() => { }}
                onCancel={onCloseModal}
                footer={[
                    <Button key="back" onClick={onCloseModal}>
                        Cancelar
                    </Button>,
                    <Button key="send" type="primary" onClick={() => {formRef.submit()}} loading={onFinishLoading}>
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
                                rules={[{ required: true, message: "Insira uma palavra-passe." }]}
                            >
                                <Input.Password />
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