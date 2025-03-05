import React, { useState } from "react";

import { Row, Col, Switch, Divider, Button } from "antd";
import { HistoryOutlined } from "@ant-design/icons";
import PageConfiguration from "../PageConfiguration";
import PageVersions from "../PageVersions";

import "./index.less";

const AdminBar = ({ onChangeEditMode, extra, pageData }) => {
  const [isPageConfigOpen, setIsPageConfigOpen] = useState(false);
  const [isPageVersionsOpen, setIsPageVersionsOpen] = useState(false);

  return (
    <div className="admin-bar">
      <Row className="admin-bar__row" justify="space-between">
        <Col>
          <Row align="middle" gutter={12}>
            <Col>
              <Button type="text">Configurações do Site</Button>
            </Col>
          </Row>
        </Col>
        <Col>
          <Row align="middle" gutter={6}>
            <Col>
              <Button type="text">Nova Página</Button>
            </Col>
            <Col>
              <Divider type="vertical" />
            </Col>
            <Col>
              <Button type="text" onClick={() => setIsPageConfigOpen(true)}>
                Configurações da Página
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
                onChange={onChangeEditMode}
                checkedChildren="Editar"
                unCheckedChildren="Ver"
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
        pageData={pageData}
      />
      <PageVersions
        open={isPageVersionsOpen}
        onClose={() => setIsPageVersionsOpen(false)}
        pageData={pageData}
      />
    </div>
  );
};

export default AdminBar;
