import React, { useState } from "react";

import { Row, Col, Switch, Divider, Button, Flex, theme } from "antd";
import { HistoryOutlined } from "@ant-design/icons";
import Cluar from "../../common/Cluar"
import PageConfiguration from "../PageConfiguration";
import PageVersions from "../PageVersions";

import "./index.less";

const AdminBar = ({
  onChangeEditMode,
  extra,
  pageData,
  currentStructure = [],
  editMode
}) => {
  const [isPageConfigOpen, setIsPageConfigOpen] = useState(false);
  const [isPageVersionsOpen, setIsPageVersionsOpen] = useState(false);
  const [isNewPage, setIsNewPage] = useState(false);

  const openPageConfig = (isNew = false) => {
    setIsNewPage(isNew);
    setIsPageConfigOpen(true);
  };

  const navigateToReservedArea = () => {
    window.location.href = "/reserved-area/";
  };

  const { token } = theme.useToken();

  return (
    <Flex className="admin-bar" style={{ background: token.colorBgFlex }}>
      <Row className="admin-bar__row" justify="space-between">
        <Col>
          <Row align="middle" gutter={12}>
            <Col>
              <Button type="text" onClick={navigateToReservedArea}>
                {Cluar.plainDictionary("admin-bar-site-config")}
              </Button>
            </Col>
          </Row>
        </Col>
        <Col>
          <Row align="middle" gutter={6}>
            <Col>
              <Button type="text" onClick={() => openPageConfig(true)}>
                {Cluar.plainDictionary("page-drawer-new-title")}
              </Button>
            </Col>
            <Col>
              <Divider type="vertical" />
            </Col>
            <Col>
              <Button type="text" onClick={() => openPageConfig(false)}>
                {Cluar.plainDictionary("page-drawer-config-title")}
              </Button>
            </Col>
            <Col>
              <Divider type="vertical" />
            </Col>
            <Col>
              <Button type="text" onClick={() => setIsPageVersionsOpen(true)}>
                <HistoryOutlined style={{ fontSize: 18 }} />
              </Button>
            </Col>
            <Col>
              <Divider type="vertical" />
            </Col>
            <Col>
              <Switch
                checked={editMode}
                onChange={onChangeEditMode}
                checkedChildren={Cluar.plainDictionary("admin-bar-switch-edit")}
                unCheckedChildren={Cluar.plainDictionary("admin-bar-switch-see")}
              />
            </Col>
            {extra && (
              <Col>
                <Divider type="vertical" />
              </Col>
            )}
            {extra && <Col>{extra}</Col>}
          </Row>
        </Col>
      </Row>
      <PageConfiguration
        open={isPageConfigOpen}
        onClose={() => setIsPageConfigOpen(false)}
        pageData={isNewPage ? null : pageData}
        currentStructure={currentStructure}
      />
      <PageVersions
        open={isPageVersionsOpen}
        onClose={() => setIsPageVersionsOpen(false)}
        pageData={pageData}
      />
    </Flex>
  );
};

export default AdminBar;
