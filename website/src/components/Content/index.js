import React from 'react';
import { Row, Col } from 'antd';

import Actions from '../Actions';

import './index.less';

function Content({section, type, title, content, image, image_title, image_alt, image_max_width, actions}) {
  let layout = null;
  const imageStyle = {};
  if (image_max_width > 0) {
    imageStyle["maxWidth"] = `${image_max_width}px`;
  }
  if (type === 'text') {
    layout = (
      <div className="content__text">
        <div className="text">
          <h1>{ title }</h1>
          { title ? <div className="text__title-border"></div> : null }
          <div dangerouslySetInnerHTML={{__html: content}}></div>
        </div>
      </div>
    );
  } else if (type === 'image-left') {
    layout = (
      <div className="content__image-left">
        <Row>
          <Col md={8}>
            <div className="image">
              <img src={`/images/${section}/${image}`} alt={ image_alt } title={ image_title } style={ imageStyle }/>
            </div>
          </Col>
          <Col md={16}>
            <div className="text">
              <h1>{ title }</h1>
              <div dangerouslySetInnerHTML={{__html: content}}></div>
            </div>
          </Col>
        </Row>
      </div>
    );
  } else if (type === 'image-right') {
    layout = (
      <div className="content__image-right">
        <Row>
          <Col md={16}>
            <div className="text">
              <h1>{ title }</h1>
              <div className="text__title-border"></div>
              <div dangerouslySetInnerHTML={{__html: content}}></div>
            </div>
          </Col>
          <Col md={8}>
            <div className="image">
              <img src={`/images/${section}/${image}`} alt={ image_alt } title={ image_title } style={ imageStyle }/>
            </div>
          </Col>
        </Row>
      </div>
    );
  } else if (type === 'image-top') {
    layout = (
      <div className="content__image-top">
        <div className="image">
          <img src={`/images/${section}/${image}`} alt={ image_alt } title={ image_title } style={ imageStyle }/>
        </div>
        <div className="text">
          <h1>{ title }</h1>
          <div dangerouslySetInnerHTML={{__html: content}}></div>
        </div>
      </div>
    );
  } else if (type === 'image-bottom') {
    layout = (
      <div className="content__image-bottom">
        <div className="text">
          <h1>{ title }</h1>
          <div dangerouslySetInnerHTML={{__html: content}}></div>
        </div>
        <div className="image">
          <img src={`/images/${section}/${image}`} alt={ image_alt } title={ image_title } style={ imageStyle }/>
        </div>
      </div>
    );
  } else if (type === 'image') {
    layout = (
      <div className="content__image">
        <div className="image">
          <img src={`/images/${section}/${image}`} alt={ image_alt } title={ image_title } style={ imageStyle }/>
        </div>
      </div>
    );
  } else {
    layout = (
      <div className={`content__${type}`}>
        <div className="image">
          <img src={`/images/${section}/${image}`} alt={ image_alt } title={ image_title } style={ imageStyle }/>
        </div>
        <div className="text">
          <h1>{ title }</h1>
          <div dangerouslySetInnerHTML={{__html: content}}></div>
        </div>
      </div>
    );
  }
  return (
    <section className="content">
      { layout }
      <Actions { ... { section, type, actions } } />
    </section>
  );
}

export default Content;