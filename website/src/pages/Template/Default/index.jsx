import Builder from "../../../common/Builder";
import BaseHeader from "../../../base/Header";
import BaseFooter from "../../../base/Footer";

import "./index.less";

const Default = ({ page }) => {
  return (
    <div className="default-template">
      <BaseHeader />
      <Builder page={page} />
      <BaseFooter />
    </div>
  );
};

export default Default;
