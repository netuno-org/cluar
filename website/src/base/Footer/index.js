import React, { useContext } from 'react';
import { Layout, Row, Col } from 'antd';
import {
  House,
  Phone,
  EnvelopeSimpleOpen,
  GithubLogo,
  YoutubeLogo,
  TwitchLogo,
  LinkedinLogo,
  DiscordLogo,
  FacebookLogo,
  InstagramLogo,
} from 'phosphor-react';
import { PhoneOutlined, HomeOutlined, MailOutlined } from '@ant-design/icons';
import { RiOpenSourceFill } from 'react-icons/ri';
import Configuration from '../../components/Configuration';
import ThemeContext from '../../context';

import './index.less';
import styles from '../../utils/styles';

const { Footer } = Layout;

function BaseFooter() {
  const { colorMode, setColorMode } = useContext(ThemeContext);

  const socialLinks = [
    { title: "GitHub", url: "https://github.com/netuno-org", icon: <GithubLogo size={24} /> },
    { title: "Youtube", url: "https://www.youtube.com/channel/UCYY1Nz6T2NJtP29vba2fqkg", icon: <YoutubeLogo size={24} />, },
    { title: "Twitter", url: "https://twitter.com/netuno_org", icon: <TwitchLogo size={24} /> },
    { title: "Linkedin", url: "https://www.linkedin.com/company/netuno-org/", icon: <LinkedinLogo size={24} /> },
    { title: "Discord", url: "https://discord.gg/4sfXG6YWFu", icon: <DiscordLogo size={24} /> },
    { title: "Facebook", url: "https://www.facebook.com/netuno.org/", icon: <FacebookLogo size={24} /> },
    { title: "Instagram", url: "https://www.instagram.com/netuno_org/", icon: <InstagramLogo size={24} /> }
  ];

  const AdressContact = [
    { title: 'Endereço', paramater: "footer-address", icon: <House size={24} /> },
    { title: 'Telephone', paramater: "footer-phone", icon: <Phone size={24} /> },
    { title: 'Email', paramater: "footer-email", icon: <EnvelopeSimpleOpen size={24} /> },
  ]


  return (
    <Footer style={styles(colorMode).body}>
      <Row className="ant-layout-footer__wrapper container" align="middle" gutter={[0, 10]}>
        <Col xs={24} lg={8}>
          <div className="logo" data-sal="slide-up" data-sal-duration="2000" data-sal-easing="ease-out-cubic">
            <img alt="logo" src="/images/logo.png" />
          </div>
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 8, offset: 8 }}>
          <Row gutter={[12, 12]} className='ant-layout-footer__wrapper_contacts'>
            {AdressContact.map((link, index) => {
              return (
                <Col title={link.title} key={index}>
                  {link.icon}
                  <address><Configuration parameter={link.paramater} /></address>
                </Col>
              );
            })}
          </Row>
        </Col>
        <Row align="center" justify="center" className='ant-layout-footer__wrapper_sociais'>
          <Col>
            <div className="social-links">
              {socialLinks.map((link, index) => (
                <a key={index} href={link.url} title={link.title} className={`${colorMode == 'dark' ? 'social-link-light' : 'social-link-dark'}`}>
                  {link.icon}
                </a>
              ))}
            </div>
          </Col>
        </Row>
      </Row >
    </Footer >
  );
}

export default BaseFooter;