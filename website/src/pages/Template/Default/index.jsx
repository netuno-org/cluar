import { connect } from "react-redux";
import { useState, useEffect } from "react";
import _service from "@netuno/service-client";
import _auth from "@netuno/auth-client";

import Builder from "../../../common/Builder";
import BaseHeader from "../../../base/Header";
import BaseFooter from "../../../base/Footer";

import "./index.less";

const Default = ({ page, loggedUserInfo }) => {
  const [organizations, setOrganizations] = useState([]);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    _service({
      method: "POST",
      url: "reserved-area/organization/list",
      data: {
        filters: {
          groupCodes: ["administrator", "editor"]
        }
      },
      success: (response) => {
        if (response.json.result) {
          setOrganizations(response.json.data.organizations.map(org => org.uid));
        }
      },
      fail: (e) => {
        console.error("Organizações", e);
      },
    });
  }, [page]);

  useEffect(() => {
    setCanEdit(organizations.some(org => page.organizations.includes(org)));
  }, [organizations]);

  return (
    <div className="default-template">
      <BaseHeader canEdit={canEdit} />
      <Builder page={page} canEdit={canEdit} />
      <BaseFooter />
    </div>
  );
};

const mapStateToProps = (store) => ({
  loggedUserInfo: store.loggedUserInfoState.loggedUserInfo,
});

export default connect(mapStateToProps)(Default);
