import React from "react";
import { Col } from "antd";

import "./index.less";

function Item({
  section,
  type,
  image,
  image_title,
  image_alt,
  title,
  content,
  link,
}) {
  let layout = null;
  const imageSrc =
    image?.indexOf("base64") === -1
      ? `/cluar/images/page_${section}/${image}`
      : image;

  if (type === "default") {
    layout = (
      <div
        className={`slider__item__${type} keen-slider__slide`}
        style={{
          backgroundImage: `url(${imageSrc})`,
        }}
      >
        <h2>{title}</h2>
      </div>
    );
  }

  return layout;
}

export default Item;
