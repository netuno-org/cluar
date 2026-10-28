import { JsonEditor } from "json-edit-react";

import "./index.less";

const MetadataEditor = ({ value, onChange }) => {
  const data = value ? JSON.parse(value) : {};

  return (
    <JsonEditor
      data={data}
      setData={(updatedData) => onChange(JSON.stringify(updatedData))}
      collapse={false}
    />
  );
};

export default MetadataEditor;
