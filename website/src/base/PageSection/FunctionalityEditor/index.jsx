import React from "react";

import { Form, Select } from "antd";

const FunctionalityEditor = ({ sectionData }) => {
  return (
    <div className="functionality-editor">
      <Form.Item label="Tipo" name="type">
        <Select
          options={[
            { value: "contact-form", label: "Formulário de Contato" },
            { value: "contact-map", label: "Mapar de Contato" },
          ]}
        />
      </Form.Item>
    </div>
  );
};

export default FunctionalityEditor;
