import {
    Modal,
    Button,
    Row,
    Col
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { forwardRef, useState, useImperativeHandle } from "react";
import Cluar from "../../../../common/Cluar";
import MembersTable from "../../Organization/Members/Table"
import MembersModal from "../../Organization/Modal"
import HeadTitle from "../../../../components/HeadTitle";
import { useRef } from "react";

const OrganizationModal = forwardRef(({userData}, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const membersModalRef = useRef();
    const membersTableRef = useRef();

    const openModal = () => {
        setIsModalOpen(true);
    }

    useImperativeHandle(ref, () => {
        return {
            openModal,
        };
    }, []);

    return (
        <Modal
            title={"Organizações do Utilizador"}
            maskClosable={false}
            destroyOnClose={true}
            centered
            open={isModalOpen}
            width={1000}
            onOk={() => { }}
            onCancel={() => setIsModalOpen(false)}
            footer={[
                <Button key="back" onClick={() => setIsModalOpen(false)}>
                    {Cluar.plainDictionary('members-form-cancel')}
                </Button>
            ]}
        >
            <div >
                <MembersModal
                    ref={membersModalRef}
                    onReloadTable={() => membersTableRef.current.onReloadTable()}
                />
                <Row gutter={[0, 40]} >
                    <Col span={24}>
                        <Row justify={"end"} align={"middle"} gutter={[16, 16]}>
                            <Col>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => { membersModalRef.current.onOpenModal() }}
                                >
                                    {Cluar.plainDictionary('members-page-new')}
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24}>
                        <Row>
                            <Col span={24}>
                                <MembersTable
                                    ref={membersTableRef}
                                    userData={userData}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </Modal>
    )
})

export default OrganizationModal;