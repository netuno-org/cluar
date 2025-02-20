import {
    Button,
    Col,
    Row
} from "antd";
import { PlusOutlined } from "@ant-design/icons"

import HeadTitle from "../../../components/HeadTitle";
import LanguageTable from "./Table";

import "./index.less"
import { useRef } from "react";

const Languages = () => {
    const languageTableRef = useRef();
    return (
        <div className="languages-page">
            <Row gutter={[0, 40]} >
                <Col span={24}>
                    <Row justify={"space-between"} align={"middle"} gutter={[16, 16]}>
                        <Col>
                            <HeadTitle level={4} type={"secondary"} text={"Idiomas"} />
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => userModalRef.current.openModal()}
                            >
                                Novo
                            </Button>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <LanguageTable/>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default Languages