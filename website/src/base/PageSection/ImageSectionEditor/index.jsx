import React, { useState, useEffect } from "react";

import { Form, Upload, Image, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import "./index.less";

const ImageSectionEditor = ({
  sectionData,
  form,
  imageName = "image",
  imageTitleName = "image_title",
  imageAltName = "image_alt",
  onChangeImage,
  onChangeImageTitle,
  onChangeImageAlt,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

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
        form.setFieldValue(imageName, file.thumbUrl);

        if (onChangeImage) {
          onChangeImage(file.thumbUrl);
        }
      }
    } else {
      setFileList([]);
      if (form) {
        form.setFieldValue(imageName, "");

        if (onChangeImage) {
          onChangeImage("");
        }
      }
    }
  };

  const uploadButton = (
    <button className="upload-btn" type="button">
      <PlusOutlined />
      <p>Upload</p>
    </button>
  );

  useEffect(() => {
    if (sectionData) {
      if (sectionData.image) {
        setFileList([
          {
            url:
              sectionData.image.indexOf("base64") === -1
                ? `/cluar/images/page_${sectionData.section}/${sectionData.image}`
                : sectionData.image,
          },
        ]);
      }
    }
  }, [sectionData]);

  return (
    <div className="image-section-editor">
      <Form.Item label="Imagem" name={imageName}>
        <Upload
          listType="picture"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          beforeUpload={(file) => {
            const isImage =
              file.type === "image/png" ||
              file.type === "image/jpeg" ||
              file.type === "image/jpg";

            const isLimit1M = file.size / 1024 / 1024 < 1;

            if (!isImage) {
              return Upload.LIST_IGNORE;
            }

            if (!isLimit1M) {
              return Upload.LIST_IGNORE;
            }

            return false;
          }}
          accept=".png,.jpg,.jpeg"
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

      <Form.Item label="Título da Image" name={imageTitleName}>
        <Input
          onChange={(e) => {
            if (onChangeImageTitle) {
              onChangeImageTitle(e.target.value);
            }
          }}
        />
      </Form.Item>

      <Form.Item
        label="Título Alt"
        name={imageAltName}
        onChange={(e) => {
          if (onChangeImageAlt) {
            onChangeImageAlt(e.target.value);
          }
        }}
      >
        <Input />
      </Form.Item>
    </div>
  );
};

export default ImageSectionEditor;
