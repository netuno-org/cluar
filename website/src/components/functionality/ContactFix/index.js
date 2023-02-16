import React, { useState } from "react";
import { WhatsAppOutlined } from '@ant-design/icons';
import { WhatsappLogo } from "phosphor-react";
import './index.less'

export default () => {
  return (
    <div className="styles_container">
      <div className="contact-whatsapp-fix">
          <a title="Whatsapp" href='https://wa.me/+351912524751' target="_blank">
            <WhatsAppOutlined style={{ fontSize: '32px', color: '#fff' }} />
          </a>
      </div>
    </div>
  );
};
