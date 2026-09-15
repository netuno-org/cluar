import { Typography } from "antd";
import "./index.less"

const HeadTitle = ({ text, level, type }) => {
  return (
    <Typography.Title
      className="header-title"
      type={type}
      level={level}
    >
      {text}
    </Typography.Title>
  )
}

export default HeadTitle;
