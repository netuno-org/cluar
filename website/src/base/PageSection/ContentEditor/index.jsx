import React from "react";

import { Form, Select } from "antd";
import ImageSectionEditor from "../ImageSectionEditor";

const ContentEditor = ({ sectionData, form }) => {
  return (
    <div className="content-editor">
      <Form.Item label="Tipo" name="type">
        <Select
          options={[
            { value: "text", label: "Texto" },
            { value: "image-left", label: "Imagem à esquerda" },
            { value: "image-right", label: "Imagem à direita" },
            { value: "image-top", label: "Imagem no top" },
            { value: "image-bottom", label: "Imagem embaixo" },
          ]}
        />
      </Form.Item>
      <ImageSectionEditor sectionData={sectionData} form={form} />
    </div>
  );
};

export default ContentEditor;
