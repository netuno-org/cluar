import { Button, Col, Row } from "antd";

import HeadTitle from "../../../components/HeadTitle";
import ActionModal from "./Modal";
import ActionTable from "./Table";
import { PlusOutlined } from "@ant-design/icons"
import Cluar from "../../../common/Cluar";

import "./index.less";
import { useRef, useState } from "react";

const Action = () => {
  const actionModalRef = useRef();
  const actionTableRef = useRef();

  return (
    <div className="action-page">
      <ActionModal
        ref={actionModalRef}
        onReloadTable={() => actionTableRef.current.onReloadTable()}
      />
      <Row gutter={[0, 40]}>
        <Col span={24}>
          <Row justify={"space-between"} align={"middle"} gutter={[16, 16]}>
            <Col>
              <HeadTitle text={Cluar.plainTranslation('action-page-title')} level={4} type={"secondary"} />
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => actionModalRef.current.openModal()}
              >
                {Cluar.plainTranslation('action-page-new')}
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <ActionTable
                ref={actionTableRef}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default Action;
