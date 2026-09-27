import Default from "./Default";
import Builder from "../../common/Builder";
import ScreenViewer from "../../components/ScreenViewer";

import "./index.less";

const Template = ({ page }) => {
  const template =
    page.template === "Default" ? (
      <Default page={page} />
    ) : (
      <Builder page={page} />
    );

  return <ScreenViewer>{template}</ScreenViewer>;
};

export default Template;
