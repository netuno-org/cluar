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
  link,
  action_uids
}) {
  const imageSrc =
    image?.indexOf("base64") === -1
      ? `/cluar/images/page_${section}/${image}`
      : image;

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
      <h2>{title}</h2>
      {config.action && (
        <div>
          <Actions {...{ section, type, actions }} />
        </div>
      )}
    </div>
  );
}

export default Item;
