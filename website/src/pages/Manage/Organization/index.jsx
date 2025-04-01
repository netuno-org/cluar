import {
    Row,
    Col,
    Button
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import HeadTitle from "../../../components/HeadTitle";
import OrganizationTable from "./Table";
import Cluar from "../../../common/Cluar";
import OrganizationModal from "./Modal";

import "./index.less";
import { useRef } from "react";

const Organization = () => {
    const organizationModalRef = useRef();
    const organizationTableRef = useRef();

    return (
        <div className="configuration-page">
          <OrganizationModal
            ref={organizationModalRef}
            onReloadTable={() => organizationTableRef.current.onReloadTable()}
          />
            <Row gutter={[0, 40]} >
                <Col span={24}>
                    <Row justify={"space-between"} align={"middle"} gutter={[16, 16]}>
                        <Col>
                            <HeadTitle level={4} type={"secondary"} text={Cluar.plainDictionary('organization-page-title')} />
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {organizationModalRef.current.onOpenModal()}}
                            >
                                {Cluar.plainDictionary('organization-page-new')}
                            </Button>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                           <OrganizationTable
                            ref={organizationTableRef}
                           />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default Organization;