import {
  Modal,
  Button,
  Row,
  Col
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { forwardRef, useState, useImperativeHandle } from "react";
import Cluar from "../../../../common/Cluar";
import OrganizationTable from "./Table";
import OrganizationFormModal from "./FormModal"
import { useRef } from "react";

const OrganizationModal = forwardRef(({ pageData }, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const organizationsFormModalRef = useRef();
  const organizationsTableRef = useRef();

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
      title={pageData ? `${Cluar.plainTranslation("page-organizations-title")} ${pageData.title}` : Cluar.plainTranslation("page-organizations-title")}
      maskClosable={false}
      destroyOnHidden={true}
      centered
      open={isModalOpen}
      width={1000}
      onOk={() => { }}
      onCancel={() => setIsModalOpen(false)}
      footer={[
        <Button key="back" onClick={() => setIsModalOpen(false)}>
          {Cluar.plainTranslation("member-form-cancel")}
        </Button>
      ]}
    >
      <div >
        <OrganizationFormModal
          ref={organizationsFormModalRef}
          pageData={pageData}
          onReloadTable={() => organizationsTableRef.current.onReloadTable()}
        />
        <Row gutter={[0, 40]} >
          <Col span={24}>
            <Row justify={"end"} align={"middle"} gutter={[16, 16]}>
              <Col>
                <Button
                  type={"primary"}
                  icon={<PlusOutlined />}
                  onClick={() => { organizationsFormModalRef.current.onOpenModal() }}
                >
                  {Cluar.plainTranslation("member-page-new")}
                </Button>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row>
              <Col span={24}>
                <OrganizationTable
                  ref={organizationsTableRef}
                  pageData={pageData}
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