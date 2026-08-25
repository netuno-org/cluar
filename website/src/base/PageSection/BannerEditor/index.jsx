import React, { useState, useEffect, useRef } from "react";
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

  const currentLangCode = Cluar.currentLanguage()?.code;
  const allActions = Cluar.actions() || [];
  const actionsData = allActions.filter(
    (action) => action.language_code === currentLangCode
  );

  useEffect(() => {
    _service({
      url: "/reserved-area/component/banner/list",
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
        console.error(error);
      },
    });
  }, []);

  return (
    <div className="banner-editor">
      <Form.Item label={Cluar.plainDictionary("banner-editor-field-type")} name="type">
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
      <ImageSectionEditor sectionData={sectionData} form={form} />

      {showActions && (
        <Form.Item label={Cluar.plainDictionary("banner-editor-field-actions")} name="action_uids">
          <Select
            options={actionsData.map((action) => ({
              label: action.title,
              value: action.uid,
            }))}
            placeholder={Cluar.plainDictionary("banner-editor-placeholder-add")}
            mode="multiple"
            allowClear
          />
        </Form.Item>
      )}
    </div>
  );
};

export default BannerEditor;
