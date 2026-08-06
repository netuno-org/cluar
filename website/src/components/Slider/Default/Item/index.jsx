import React from "react";

import "./index.less";
import config from "../config.json"
import Actions from "../../../Actions";
import Cluar from "../../../../common/Cluar";

function Item({
  section,
  type,
  image,
  image_title,
  image_alt,
  title,
  content,
  html_content,
  edit_mode,
  link,
  action_uids
}) {
  const imageSrc =
    image?.indexOf("base64") === -1
      ? `/cluar/images/page_${section}/${image}`
      : image;

  const resolvedContent = edit_mode === 'html'
    ? (html_content || content)
    : content;

  const actionsData = Cluar.actions() || [];
  const actions = (action_uids || []).map(uid =>
    actionsData.find(item => item.uid === uid)
  ).filter(Boolean);

  return (
    <div
      className={`slider__item__${type} keen-slider__slide`}
      style={{
        backgroundImage: `url(${imageSrc})`,
      }}
    >
      <div className="slider__item__wrapper">
        <h1 dangerouslySetInnerHTML={{ __html: title }}
        />
        <div
          data-sal="fade"
          data-sal-duration="2000"
          data-sal-easing="ease-out-cubic"
          dangerouslySetInnerHTML={{ __html: resolvedContent }}
        ></div>
        {config.action && (
          <div className="slider__actions">
            <Actions {...{ section, type, actions }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Item;