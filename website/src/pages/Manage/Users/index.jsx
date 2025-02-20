import {
    Button,
    Col,
    Row,
    Typography
} from "antd";

import HeadTitle from "../../../components/HeadTitle";
import UserModal from "./Modal";
import UserTable from "./Table";
import { PlusOutlined } from "@ant-design/icons"

import "./index.less";
import { useRef, useState } from "react";

const Users = () => {
    const userModalRef = useRef();
    const userTableRef = useRef();

    return (
        <div className="users-page">
            <UserModal 
                ref={userModalRef}
                onReloadTable={() => userTableRef.current.onReloadTable()}
            />
            <Row gutter={[0, 40]}>
                <Col span={24}>
                    <Row justify={"space-between"} align={"middle"} gutter={[16, 16]}>
                        <Col>
                            <HeadTitle text={"Utilizadores"} level={4} type={"secondary"} />
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => userModalRef.current.openModal()}
                            >
                                Novo
                            </Button>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <UserTable 
                                ref={userTableRef}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default Users;