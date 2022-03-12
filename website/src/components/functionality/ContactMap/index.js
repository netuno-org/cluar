import React, { useState } from 'react';
import { Row, Col } from 'antd';
import { PhoneOutlined, HomeOutlined, MailOutlined } from '@ant-design/icons';
import Map, {Marker, Popup, NavigationControl} from 'react-map-gl';

import Cluar from '../../../common/Cluar';

import './index.less';

const MARKER_ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;
const MARKER_SIZE = 50;

function ContactMap({ title, content }){
  const [showPopup, setShowPopup] = useState(false);
  const latitude = Cluar.configurationNumber("map-latitude");
  const longitude = Cluar.configurationNumber("map-longitude");
  let mapStyle = "mapbox://styles/mapbox/light-v10";
  if (Cluar.config().mapbox.dark) {
    mapStyle = "mapbox://styles/mapbox/dark-v9";
  }
  return (
    <section className="map">
      <h1>{title}</h1>
      <div className="map__title-border"></div>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
          <div className="text">
          <Row>
            <Col>
              <div dangerouslySetInnerHTML={{__html: content}}></div>
            </Col>
          </Row>
          </div>
          <div className="text">
          <Row>
            <Col>
              <br />
            </Col>
          </Row>
            <Row>
              <Col><HomeOutlined /></Col>
              <Col>
                <p></p>
              </Col>
            </Row>
            <Row>
              <Col><PhoneOutlined /></Col>
              <Col><p></p></Col>
            </Row>
            <Row>
              <Col><MailOutlined /></Col>
              <Col><p></p></Col>
            </Row>
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
          <div className="map__container">
            <Map
              initialViewState={{
                  latitude,
                  longitude,
                  zoom: 5.5,
                  bearing: 0,
                  pitch: 0
              }}
              width="100%"
              mapStyle={mapStyle}
              mapboxAccessToken={Cluar.config().mapbox.accessToken}
              scrollZoom={false}
            >
              <NavigationControl showCompass={false} />
              <Marker latitude={latitude} longitude={longitude} anchor="bottom">
                <svg
                  height={MARKER_SIZE}
                  width={MARKER_SIZE}
                  viewBox="0 0 25 25"
                  style={{
                      cursor: 'pointer',
                      stroke: 'none',
                      //transform: `translate(${MARKER_SIZE / 2}px,${-MARKER_SIZE / 2}px)`
                  }}
                  onClick={() => setShowPopup(true)}
                >
                  <path d={MARKER_ICON} />
                </svg>
              </Marker>
              { showPopup && (
                  <Popup
                    anchor="top"
                    tipSize={5}
                    latitude={latitude}
                    longitude={longitude}
                    closeOnClick={false}
                    onClose={()=> setShowPopup(false)}
                  >
                    <strong><PhoneOutlined /></strong>
                    <address>
                      <HomeOutlined />
                    </address>
                  </Popup>
              )}
            </Map>
          </div>
        </Col>
      </Row>
    </section>
  );
}

export default ContactMap;