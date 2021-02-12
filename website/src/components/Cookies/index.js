
import React, { Component } from 'react';
import { Layout, Button } from 'antd';
import styles from './index.less';
import Cluar from './../../Cluar.js';
import {
  Link
} from "react-router-dom";

class Cookies extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accepted: sessionStorage.getItem('cookies-accepted')
        }
        this.onClick = this.onClick.bind(this);
    }

    componentDidUpdate() {
    }

    onClick() {
        sessionStorage.setItem('cookies-accepted', '1');
        this.setState({ accepted: '1' });
    }

    render() {
        if (this.state.accepted === '1') {
            return null;
        }
        return (
            <div className="cookies">
              <div className="cookies--popup">
                <div className="cookies--popup__content">
                  <p>Utilizamos cookies no nosso website para lhe proporcionar a experiência mais relevante, para mais informações consulte a nossa <a href={`/${Cluar.currentLanguage().locale}/politica-privacidade`}>política de cookies e privacidade</a>.</p>
                  <Button type="primary" shape="round" onClick={ this.onClick }>
                    Aceitar
                  </Button>
                </div>
              </div>
            </div>
        )
    }
}

export default Cookies;
