import {
    Row,
    Col,
    Button
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import HeadTitle from "../../../../components/HeadTitle";
import Cluar from "../../../../common/Cluar";
import MembersTable from "./Table";
import MembersModal from "./Modal";

import "./index.less";
import { useRef } from "react";

const Members = () => {
    const membersModalRef = useRef();
    const membersTableRef = useRef();

    return (
        <div className="configuration-page">
          <MembersModal
            ref={membersModalRef}
            onReloadTable={() => membersTableRef.current.onReloadTable()}
          />
            <Row gutter={[0, 40]} >
                <Col span={24}>
                    <Row justify={"space-between"} align={"middle"} gutter={[16, 16]}>
                        <Col>
                            <HeadTitle level={4} type={"secondary"} text={Cluar.plainDictionary('members-page-title')} />
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {membersModalRef.current.onOpenModal()}}
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
                           />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default Members;