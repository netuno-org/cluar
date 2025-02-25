import {
    Button,
    Row,
    Col
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import HeadTitle from "../../../components/HeadTitle";
import DictionaryTable from "./Table";
import DictionaryModal from "./Modal";

import "./index.less"
import { useRef } from "react";

const Dictionary = () => {
    const dictionaryModalRef = useRef();

    return (
        <div className="dictionary-page">
            <DictionaryModal
                ref={dictionaryModalRef}
            />
            <Row gutter={[0, 40]} >
                <Col span={24}>
                    <Row justify={"space-between"} align={"middle"} gutter={[16, 16]}>
                        <Col>
                            <HeadTitle level={4} type={"secondary"} text={"Dicionários"} />
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                icon={<PlusOutlined/>}
                                onClick={() => { dictionaryModalRef.current.onOpenModal() }}
                            >
                                Novo
                            </Button>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <DictionaryTable/>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default Dictionary;