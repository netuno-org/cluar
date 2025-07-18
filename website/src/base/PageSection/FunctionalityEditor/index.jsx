import React, { useState, useEffect } from "react";

import { Form, Select } from "antd";

import _service from "@netuno/service-client";
import Cluar from "../../../common/Cluar"

const FunctionalityEditor = ({ sectionData }) => {
  const [typeOptions, setTypeOptions] = useState([]);

  useEffect(() => {
    _service({
      url: "/components/functionality/list",
      method: "POST",
      data: {
        language: Cluar.currentLanguage().locale
      },
      success: (res) => {
        setTypeOptions(res.json.types);
      },
      fail: (error) => {
        console.log(error);
      },
    });
  }, []);

  return (
    <div className="functionality-editor">
      <Form.Item label="Tipo" name="type">
        <Select
          options={typeOptions.map((item) => ({
            label: item.info.label,
            value: item.name,
          }))} />
      </Form.Item>
    </div>
  );
};

export default FunctionalityEditor;
