import {
    Row,
    Col,
    Button
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import HeadTitle from "../../../components/HeadTitle";
import ConfigurationTable from "./Table";
import ConfigurationModal from "./Modal";

import "./index.less";
import { useRef } from "react";

const Configuration = () => {
    const configurationModalRef = useRef();
    const configurationTableRef = useRef();

    return (
        <div className="configuration-page">
          <ConfigurationModal
            ref={configurationModalRef}
            onReloadTable={() => configurationTableRef.current.onReloadTable()}
          />
            <Row gutter={[0, 40]} >
                <Col span={24}>
                    <Row justify={"space-between"} align={"middle"} gutter={[16, 16]}>
                        <Col>
                            <HeadTitle level={4} type={"secondary"} text={"Configurações"} />
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {configurationModalRef.current.onOpenModal()}}
                            >
                                Novo
                            </Button>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                           <ConfigurationTable
                            ref={configurationTableRef}
                           />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default Configuration;