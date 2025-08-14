import { Button, Col, Row } from "antd";

import HeadTitle from "../../../components/HeadTitle";
import ActionsModal from "./Modal";
import ActionsTable from "./Table";
import { PlusOutlined } from "@ant-design/icons"
import Cluar from "../../../common/Cluar";

import "./index.less";
import { useRef, useState } from "react";

const Actions = () => {
    const actionModalRef = useRef();
    const actionTableRef = useRef();

    return (
        <div className="actions-page">
            <ActionsModal
                ref={actionModalRef}
                onReloadTable={() => actionTableRef.current.onReloadTable()}
            />
            <Row gutter={[0, 40]}>
                <Col span={24}>
                    <Row justify={"space-between"} align={"middle"} gutter={[16, 16]}>
                        <Col>
                            <HeadTitle text={Cluar.plainDictionary('actions-page-title')} level={4} type={"secondary"} />
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => actionModalRef.current.openModal()}
                            >
                                {Cluar.plainDictionary('users-page-new')}
                            </Button>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <ActionsTable
                                ref={actionTableRef}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default Actions;