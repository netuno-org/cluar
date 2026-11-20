import {
  Button,
  Col,
  Row
} from "antd";

import HeadTitle from "../../../components/HeadTitle";
import ThemeModal from "./Modal";
import ThemeTable from "./Table";
import { PlusOutlined } from "@ant-design/icons"
import Cluar from "../../../common/Cluar";

import "./index.less";
import { useRef } from "react";

const Theme = () => {
  const themeModalRef = useRef();
  const themeTableRef = useRef();

  return (
    <div className="theme-page">
      <ThemeModal
        ref={themeModalRef}
        onReloadTable={() => themeTableRef.current.onReloadTable()}
      />
      <Row gutter={[0, 40]}>
        <Col span={24}>
          <Row justify={"space-between"} align={"middle"} gutter={[16, 16]}>
            <Col>
              <HeadTitle text={Cluar.plainTranslation("theme-page-title")} level={4} type={"secondary"} />
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => themeModalRef.current.openModal()}
              >
                {Cluar.plainTranslation("theme-page-new")}
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <ThemeTable
                ref={themeTableRef}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default Theme;
