import React from "react";
import Actions from "../../Actions";
import Cluar from "../../../common/Cluar";
import config from "./config.json";
import "./index.less";

function Default({
  section,
  type,
  image,
  image_title,
  image_alt,
  title,
  content,
  html_content,
  edit_mode,
  position,
  actions,
}) {
  const backgroundPositionX = position.x !== "" ? position.x : "50%";
  const backgroundPositionY = position.y !== "" ? position.y : "50%";
  const imageSrc =
    image?.indexOf("base64") === -1
      ? `/cluar/images/page_${section}/${image}`
      : image;

  const resolvedContent = edit_mode === 'html'
    ? (html_content || content)
    : content;

  return (
    <section className="banner">
      <div
        className="banner__default"
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundPositionX,
          backgroundPositionY,
        }}
      >
        <div className="banner__wrapper">
          <h1
            data-sal="slide-down"
            data-sal-duration="2000"
            data-sal-easing="ease-out-cubic"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <div
            data-sal="fade"
            data-sal-duration="2000"
            data-sal-easing="ease-out-cubic"
            dangerouslySetInnerHTML={{ __html: resolvedContent }}
          />
          {config.action && (
            <div className="banner__actions">
              <Actions {...{ section, type, actions }} />
            </div>
          )}
        </div>
        <div className="banner__darken-bg" />
      </div>
    </section>
  );
}

export default Default;
