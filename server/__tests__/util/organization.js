import request from "supertest";

import login from "../util/login.js";
import { NETUNO_URL } from "../config.js";

const createOrganization = async (name, parent) => {
  const accessToken = await login.asAdmin();
  const response = await request(NETUNO_URL)
    .post("/reserved-area/organization")
    .set("Authorization", `Bearer ${accessToken}`)
    .set("Accept", "*/*")
    .set("Content-Type", "application/json")
    .send({
      active: true,
      code: name,
      name: name,
      parent_code: parent
    });
  return response.body.organization.uid;
}

const deleteOrganization = async (uid) => {
  const accessToken = await login.asAdmin();
  await request(NETUNO_URL)
    .delete(`/reserved-area/organization?uid=${uid}`)
    .set("Authorization", `Bearer ${accessToken}`)
}

export { createOrganization, deleteOrganization };
