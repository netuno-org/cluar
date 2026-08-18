import { Dropdown } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import Cluar from "../../common/Cluar";

import "./index.less";

const LanguageSwitch = () => {
    const currentLanguage = Cluar.currentLanguage();

    const items = Cluar.languages()
        .filter((language) => language.code !== currentLanguage.code)
        .map((language) => ({
            key: language.code,
            label: language.description,
            onClick: () => {
                Cluar.changeLanguage(language.locale);
                window.location.reload();
            },
        }));

    return (
        <Dropdown menu={{ items }} trigger={["click"]} placement="top">
            <span className="language-switch-trigger">
                <GlobalOutlined />
                <span className="language-switch-trigger__code">
                    {currentLanguage.code}
                </span>
            </span>
        </Dropdown>
    );
};

export default LanguageSwitch;