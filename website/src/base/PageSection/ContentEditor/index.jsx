import React, { useState, useEffect } from "react";

import { Form, Select } from "antd";
import ImageSectionEditor from "../ImageSectionEditor";
import _service from "@netuno/service-client";
import Cluar from "../../../common/Cluar"

const ContentEditor = ({ sectionData, form }) => {
  const [templateOptions, setTemplateOptions] = useState([]);


  useEffect(() => {
    _service({
      url: "/components/content/list",
      method: "POST",
      data: {
        language: Cluar.currentLanguage().locale
      },
      success: (res) => {
        setTemplateOptions(res.json.templates);
      },
      fail: (error) => {
        console.log(error);
      },
    });
  }, []);

  return (
    <div className="content-editor">
      <Form.Item label="Tipo" name="type">
        <Select
          options={templateOptions.map((item) => ({
            label: item.info.label,
            value: item.name,
          }))}
        />
      </Form.Item>
      <ImageSectionEditor sectionData={sectionData} form={form} />
    </div>
  );
};

export default ContentEditor;
