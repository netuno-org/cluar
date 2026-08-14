import { connect } from 'react-redux';
import { useState, useEffect } from "react";
import _service from "@netuno/service-client";
import _auth from "@netuno/auth-client";

import Builder from "../../../common/Builder";
import BaseHeader from "../../../base/Header";
import BaseFooter from "../../../base/Footer";

import "./index.less";

const Default = ({ page, loggedUserInfo }) => {
  const canEdit = ["administrator", "editor"].some(
    (g) => loggedUserInfo?.groups?.some((group) => group?.code === g)
  );
  
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
