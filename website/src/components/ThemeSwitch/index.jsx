import { Switch, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../redux/actions/theme";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";

const ThemeSwitch = () => {
    const dispatch = useDispatch();
    const themeMode = useSelector((state) => state.theme?.mode || "light");

    const isDark = themeMode === "dark";

    return (
        <Tooltip title={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}>
            <Switch
                checked={isDark}
                onChange={() => dispatch(toggleTheme())}
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
                style={{ backgroundColor: isDark ? "#FF6E1A" : "#bfbfbf" }}
            />
        </Tooltip>
    );
};

export default ThemeSwitch;