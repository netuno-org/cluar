import { Button, Col, Row } from "antd";

import HeadTitle from "../../../components/HeadTitle";
import PageModal from "./Modal";
import PageTable from "./Table";
import { PlusOutlined } from "@ant-design/icons"
import Cluar from "../../../common/Cluar";

import "./index.less";
import { useRef, useState } from "react";

const Pages = () => {
    const pageModalRef = useRef();
    const pageTableRef = useRef();

    return (
        <div className="pages-page">
            <PageModal
                ref={pageModalRef}
                onReloadTable={() => pageTableRef.current.onReloadTable()}
            />
            <Row gutter={[0, 40]}>
                <Col span={24}>
                    <Row justify={"space-between"} align={"middle"} gutter={[16, 16]}>
                        <Col>
                            <HeadTitle text={Cluar.plainDictionary('pages-page-title')} level={4} type={"secondary"} />
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => pageModalRef.current.openModal()}
                            >
                                {Cluar.plainDictionary('users-page-new')}
                            </Button>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <PageTable
                                ref={pageTableRef}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default Pages;