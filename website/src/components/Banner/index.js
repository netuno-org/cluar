import React, { useContext } from 'react';
import { Row, Col } from 'antd';

import { Planet, ArrowRight, Sun } from 'phosphor-react'

import Actions from '../Actions';
import Cluar from '../../common/Cluar';

import styles from '../../utils/styles'
import ThemeContext from '../../context';

import './index.less';

function Banner({ section, type, image, image_title, image_alt, title, content, position, actions }) {
  let backgroundPositionX = position.x !== "" ? position.x : "50%";
  let backgroundPositionY = position.y !== "" ? position.y : "50%";

  const { colorMode } = useContext(ThemeContext);

  switch (type) {
    case 'default':
      return (
        <section className="banner">
          <div className={`banner__${type}`} style={{
            backgroundImage: `url(/images/${section}/${image})`,
            backgroundPositionX: backgroundPositionX,
            backgroundPositionY: backgroundPositionY
          }}>
            <Row className={`banner__${type}__wrapper container`} justify="center" gutter={[24, 24]}>
              <Col span={24}>
                <div className={`banner__${type}__wrapper_text`}>
                  <div className={`banner__${type}__wrapper_text--subtitle`}>
                    <Planet size={32} color="#ff8319" weight="bold">
                      <animate
                        attributeName="opacity"
                        values="0;1;0"
                        dur="4s"
                        repeatCount="indefinite"
                      ></animate>
                      <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        type="rotate"
                        dur="5s"
                        from="0 0 0"
                        to="360 0 0"
                        repeatCount="indefinite"
                      ></animateTransform>
                    </Planet>
                    <span>Netuno.org</span>
                  </div>
                  <h1 style={styles(colorMode).title} className="title" data-sal="slide-down" data-sal-duration="2000" data-sal-easing="ease-out-cubic">{title}</h1>
                  <div data-sal="fade" data-sal-duration="2000" data-sal-easing="ease-out-cubic" dangerouslySetInnerHTML={{ __html: content }}></div>
                  {console.log(`Styles link: ${JSON.stringify(styles(colorMode).title)}`)}
                </div>
                <div className={`banner__${type}__wrapper_button`}>
                  <button onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `https://github.com/netuno-org`
                  }}>
                    Embarcar no foguete
                    <ArrowRight size={24} />
                  </button>
                </div>
              </Col>
            </Row>
            <div className="banner__sub-banner">
              {Cluar.plainDictionary('text-sub-banner')}
            </div>
            <div className="background-details" style={{ backgroundImage: "url(https://tailwindui.com/img/beams-templates-header.png)" }} />
          </div>
        </section>
      )
    default:
      return (
        <section className="banner">

        </section>
      )
  }

}

export default Banner;