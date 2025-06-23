import React from "react";

import { Form, Select } from "antd";
import ImageSectionEditor from "../ImageSectionEditor";

import "./index.less";

const BannerEditor = ({ sectionData, form }) => {
  return (
    <div className="banner-editor">
      <Form.Item label="Tipo" name="type">
        <Select
          options={[
            { value: "default", label: "Padrão" },
            { value: "secondary", label: "Página secundária" },
            { value: "default-sub-banner", label: "Padrão com Destaque" },
          ]}
        />
      </Form.Item>
      <ImageSectionEditor sectionData={sectionData} form={form} />
    </div>
  );
};

export default BannerEditor;
