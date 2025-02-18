import {
    Button,
    Col,
    Row,
    Typography
} from "antd";

import HeadTitle from "../../../components/HeadTitle";
import UserModal from "./Modal";

import "./index.less";
import { useRef } from "react";

const Users = () => {
    const userModalRef = useRef();

    return (
        <div className="users-page">
            <UserModal  ref={userModalRef}/>
            <Row justify={"space-between"} align={"middle"} gutter={[16,16]}>
                <Col>
                    <HeadTitle text={"Utilizadores"} level={4} type={"secondary"}/>
                </Col>
                <Col>
                    <Button 
                        type="primary"
                        onClick={() => userModalRef.current.openModal()} 
                    >
                        Novo
                    </Button>
                </Col>
            </Row>    
        </div>
    )
}

export default Users;