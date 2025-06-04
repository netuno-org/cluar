import React, { useState, useEffect } from "react";

import { Form, Upload, Image, Input, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import "./index.less";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const BannerEditor = ({ sectionData, form }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = async ({ fileList }) => {
    if (fileList.length > 0) {
      let file = fileList[0];

      if (!file.thumbUrl && file.originFileObj) {
        file.thumbUrl = await getBase64(file.originFileObj);
      }

      setFileList([...fileList]);

      if (form) {
        form.setFieldValue("image", file.thumbUrl);
      }
    } else {
      setFileList([]);
      if (form) {
        form.setFieldValue("image", "");
      }
    }
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  useEffect(() => {
    if (sectionData) {
      if (sectionData.image) {
        setFileList([
          {
            url:
              sectionData.image.indexOf("base64") === -1
                ? `/cluar/images/${sectionData.section}/${sectionData.image}`
                : sectionData.image,
          },
        ]);
      }
    }
  }, [sectionData]);

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
      <Form.Item label="Imagem" name="image">
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          beforeUpload={() => false}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        {previewImage && (
          <Image
            wrapperStyle={{
              display: "none",
            }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </Form.Item>
      <Form.Item label="Título da Image" name="image_title">
        <Input />
      </Form.Item>
      <Form.Item label="Título Alt" name="image_alt">
        <Input />
      </Form.Item>
    </div>
  );
};

export default BannerEditor;
