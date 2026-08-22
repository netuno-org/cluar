import { Button, Col, Row, Space, notification } from "antd";

import HeadTitle from "../../../components/HeadTitle";
import PageModal from "./Modal";
import PageTable from "./Table";
import { PlusOutlined, SyncOutlined } from "@ant-design/icons"
import Cluar from "../../../common/Cluar";
import _service from "@netuno/service-client";
import { useSelector } from "react-redux";

import "./index.less";
import { useRef, useState } from "react";

const Pages = () => {
    const pageModalRef = useRef();
    const pageTableRef = useRef();

    const [syncing, setSyncing] = useState(false);

    const loggedUserInfo = useSelector(
        (state) => state.loggedUserInfoState?.loggedUserInfo
    );
    const isAdmin = loggedUserInfo?.groups?.some(
        (group) => group?.code === "administrator"
    );

    const onSync = () => {
        setSyncing(true);
        _service({
            url: "admin/cluar/sync",
            method: "GET",
            success: () => {
                setSyncing(false);
                notification.success({ message: "Site sincronizado com sucesso" });
            },
            fail: (error) => {
                setSyncing(false);
                notification.error({ message: "Falha ao sincronizar o site" });
                console.error(error);
            },
        });
    };

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
                            <Space>
                                {isAdmin && (
                                    <Button
                                        icon={<SyncOutlined />}
                                        loading={syncing}
                                        onClick={onSync}
                                    >
                                        {Cluar.plainDictionary('pages-page-sync')}
                                    </Button>
                                )}
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => pageModalRef.current.openModal()}
                                >
                                    {Cluar.plainDictionary('users-page-new')}
                                </Button>
                            </Space>
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