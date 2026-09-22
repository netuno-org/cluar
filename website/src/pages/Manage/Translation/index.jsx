import {
  Button,
  Row,
  Col
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import HeadTitle from "../../../components/HeadTitle";
import TranslationTable from "./Table";
import TranslationModal from "./Modal";
import Cluar from "../../../common/Cluar";

import "./index.less"
import { useRef } from "react";

const Translation = () => {
  const translationModalRef = useRef();
  const translationTableRef = useRef();

  return (
    <div className="translation-page">
      <TranslationModal
        ref={translationModalRef}
        onReloadTable={() => translationTableRef.current.onReloadTable()}
      />
      <Row gutter={[0, 40]} >
        <Col span={24}>
          <Row justify={"space-between"} align={"middle"} gutter={[16, 16]}>
            <Col>
              <HeadTitle level={4} type={"secondary"} text={Cluar.plainTranslation('translation-page-title')} />
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => { translationModalRef.current.onOpenModal() }}
              >
                {Cluar.plainTranslation('translation-page-new')}
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <TranslationTable
                ref={translationTableRef}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default Translation;
