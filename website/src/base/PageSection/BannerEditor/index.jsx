import React, { useState, useEffect } from "react";
import { Form, Select } from "antd";
import _service from "@netuno/service-client";
import Cluar from "../../../common/Cluar"

import ImageSectionEditor from "../ImageSectionEditor";

import "./index.less";

const BannerEditor = ({ sectionData, form }) => {

  const [typeOptions, setTypeOptions] = useState([]);

  useEffect(() => {
    _service({
      url: "/components/banner/list",
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
    <div className="banner-editor">
      <Form.Item label="Tipo" name="type">
        <Select
          options={typeOptions.map((item) => ({
            label: item.info.label,
            value: item.name,
          }))}
        />
      </Form.Item>
      <ImageSectionEditor sectionData={sectionData} form={form} />
    </div>
  );
};

export default BannerEditor;
