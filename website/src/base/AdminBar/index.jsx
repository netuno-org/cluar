import React from "react";

import { Row, Col, Switch, Divider } from "antd";

import "./index.less";

const AdminBar = ({ onChangeEditMode, extra }) => {
  return (
    <div className="admin-bar">
      <Row className="admin-bar__row" justify="space-between">
        <Col>
          <Row>
            <Col></Col>
          </Row>
        </Col>
        <Col>
          <Row align="middle" gutter={12}>
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
    </div>
  );
};

export default AdminBar;
