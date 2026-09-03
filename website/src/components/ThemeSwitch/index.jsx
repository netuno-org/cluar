import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';

import Cluar from '../../common/Cluar';
import { toggleTheme } from '../../redux/actions/theme';

import './index.less';

function ThemeSwitch() {
    const dispatch = useDispatch();
    const themeMode = useSelector((state) => state.theme?.mode || 'light');

    const label =
        themeMode === 'dark'
            ? Cluar.plainDictionary('theme-switch-activate-light')
            : Cluar.plainDictionary('theme-switch-activate-dark');

    return (
        <button
            type="button"
            className="theme-switch"
            aria-label={label}
            title={label}
            onClick={() => dispatch(toggleTheme())}
        >
            {themeMode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
        </button>
    );
}

export default ThemeSwitch;