import React, { useState, useEffect } from "react";
import { Form, Select } from "antd";
import _service from "@netuno/service-client";
import Cluar from "../../../common/Cluar"

import ImageSectionEditor from "../ImageSectionEditor";

import "./index.less";

const BannerEditor = ({ sectionData, form }) => {

  const [typeOptions, setTypeOptions] = useState([]);
  const [config, setConfig] = useState([]);

  const [showActions, setShowActions] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const actionsData = Cluar.actions() || [];

  useEffect(() => {
    _service({
      url: "/components/banner/list",
      method: "POST",
      data: {
        language: Cluar.currentLanguage().locale
      },
      success: (res) => {
        setTypeOptions(res.json.types);
        setConfig(res.json.config);

        const initialType = form.getFieldValue("type"); // pega o valor padrão do form
        setSelectedType(initialType);

        const typeConfig = res.json.config.find(c => c.name === initialType);
        setShowActions(typeConfig?.action || false);
      },
      fail: (error) => {
        console.log(error);
      },
    });
  }, []);

  return (
    <div className="banner-editor">
      <Form.Item label="Tipo" name="type">
        <Select
          options={typeOptions.map((item) => ({
            label: item.info.label,
            value: item.name,
          }))}
          onChange={(value) => {
            setSelectedType(value);

            //verifica se o tipo selecionado tem action: true
            const typeConfig = config.find(c => c.name === value);
            setShowActions(typeConfig?.action || false);
          }}
        />
      </Form.Item>
      <ImageSectionEditor sectionData={sectionData} form={form} />

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

export default BannerEditor;
