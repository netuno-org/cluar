import React, { useState, useEffect } from "react";

import { Form, Select } from "antd";

import _service from "@netuno/service-client";
import Cluar from "../../../common/Cluar"

const FunctionalityEditor = ({ sectionData, form }) => {
  const [typeOptions, setTypeOptions] = useState([]);
  const [config, setConfig] = useState([]);

  const [showActions, setShowActions] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const actionsData = Cluar.actions() || [];

  useEffect(() => {
    _service({
      url: "/components/functionality/list",
      method: "POST",
      data: {
        language: Cluar.currentLanguage().locale
      },
      success: (res) => {
        setTypeOptions(res.json.types);
        setConfig(res.json.config);

        const initialType = form.getFieldValue("type");
        setSelectedType(initialType);

        const typeConfig = res.json.config.find(c => c.name === initialType);
        setShowActions(typeConfig?.action || false);
      },
      fail: (error) => {
        console.log(error);
      },
    });
  }, [selectedType]);

  return (
    <div className="functionality-editor">
      <Form.Item label="Tipo" name="type">
        <Select
          options={typeOptions.map((item) => ({
            label: item.info.label,
            value: item.name,
          }))}
          onChange={(value) => {
            setSelectedType(value);

            const typeConfig = config.find(c => c.name === value);
            setShowActions(typeConfig?.action || false);
          }}
        />
      </Form.Item>

      {showActions && (
        <Form.Item label="Actions" name="action_uids">
          <Select
            options={actionsData.map((action) => ({
              label: action.title,
              value: action.uid,
            }))}
            placeholder="Adicionar"
            mode="multiple"
            allowClear
          />
        </Form.Item>
      )}
    </div>
  );
};

export default FunctionalityEditor;
