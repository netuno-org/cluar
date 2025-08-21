import React from "react";
import { Row, Col } from "antd";

import Actions from "../../Actions";
import Cluar from "../../../common/Cluar";
import config from "./config.json"

import "./index.less";

function DefaultSubBanner({
  section,
  type,
  image,
  image_title,
  image_alt,
  title,
  content,
  position,
  actions,
}) {
  let backgroundPositionX = position.x !== "" ? position.x : "50%";
  let backgroundPositionY = position.y !== "" ? position.y : "50%";

  return (
    <section className="banner">
      <div
        className={`banner__default-sub-banner`}
        style={{
          backgroundImage:
            image?.indexOf("base64") === -1
              ? `url(/cluar/images/page_${section}/${image})`
              : `url(${image})`,
          backgroundPositionX: backgroundPositionX,
          backgroundPositionY: backgroundPositionY,
        }}
      >
        <Row className="banner__wrapper" justify="center">
          <Col lg={18} sm={24}>
            <div>
              <h1
                data-sal="slide-down"
                data-sal-duration="2000"
                data-sal-easing="ease-out-cubic"
                dangerouslySetInnerHTML={{ __html: Cluar.plainTitle(title) }}
              />
              <div
                data-sal="fade"
                data-sal-duration="2000"
                data-sal-easing="ease-out-cubic"
                dangerouslySetInnerHTML={{ __html: content }}
              ></div>
            </div>
          </Col>
          {config.action && (
            <Col lg={6} sm={24}>
              <Actions {...{ section, type, actions }} />
            </Col>
          )}
        </Row>
        <div className="banner__sub-banner">
          {Cluar.plainDictionary("text-sub-banner")}
        </div>
        <div className="banner__darken-bg"></div>
      </div>
    </section>
  );
}

export default DefaultSubBanner;
