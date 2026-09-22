import {
  Button,
  Col,
  Row
} from "antd";
import { PlusOutlined } from "@ant-design/icons"

import HeadTitle from "../../../components/HeadTitle";
import LanguageTable from "./Table";
import LanguageModal from "./Modal";
import Cluar from "../../../common/Cluar";

import "./index.less"
import { useRef } from "react";

const Language = () => {
  const languageTableRef = useRef();
  const languageModalRef = useRef();
  return (
    <div className="language-page">
      <LanguageModal
        ref={languageModalRef}
        onReloadTable={() => languageTableRef.current.onReloadTable()}
      />
      <Row gutter={[0, 40]} >
        <Col span={24}>
          <Row justify={"space-between"} align={"middle"} gutter={[16, 16]}>
            <Col>
              <HeadTitle level={4} type={"secondary"} text={Cluar.plainTranslation('language-page-title')} />
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => { languageModalRef.current.openModal() }}
              >
                {Cluar.plainTranslation('language-page-new')}
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <LanguageTable
                ref={languageTableRef}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default Language
