import {
  Modal,
  Button,
  Row,
  Col
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { forwardRef, useState, useImperativeHandle } from "react";
import Cluar from "../../../../common/Cluar";
import MemberTable from "./Table";
import MemberFormModal from "./FormModal"
import { useRef } from "react";

const MemberModal = forwardRef(({ userData }, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const membersFormModalRef = useRef();
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
      title={userData ? `${Cluar.plainTranslation("user-members-organizations-title")} ${userData.name}` : Cluar.plainTranslation("user-members-organizations-title")}
      maskClosable={false}
      destroyOnHidden={true}
      centered
      open={isModalOpen}
      width={1000}
      onOk={() => { }}
      onCancel={() => setIsModalOpen(false)}
      footer={[
        <Button key="back" onClick={() => setIsModalOpen(false)}>
          {Cluar.plainTranslation('member-form-cancel')}
        </Button>
      ]}
    >
      <div >
        <MemberFormModal
          ref={membersFormModalRef}
          userData={userData}
          onReloadTable={() => membersTableRef.current.onReloadTable()}
        />
        <Row gutter={[0, 40]} >
          <Col span={24}>
            <Row justify={"end"} align={"middle"} gutter={[16, 16]}>
              <Col>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => { membersFormModalRef.current.onOpenModal() }}
                >
                  {Cluar.plainTranslation('member-page-new')}
                </Button>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row>
              <Col span={24}>
                <MemberTable
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

export default MemberModal;
