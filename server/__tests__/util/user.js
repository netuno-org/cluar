import request from "supertest";

import login from "../util/login.js";
import { NETUNO_URL } from "../config.js";

const createUser = async (name, org, group) => {
  const accessToken = await login.asAdmin();
  const response = await request(NETUNO_URL)
    .post("/reserved-area/user")
    .set("Authorization", `Bearer ${accessToken}`)
    .set("Accept", "*/*")
    .set("Content-Type", "application/json")
    .send({
      active: true,
      email: `${name}@mail.com`,
      group_code: group,
      name: name,
      organization_code: org,
      password: "12345678",
      username: name,
    });
  return response.body.user.uid;
}

const deleteUser = async (uid) => {
  const accessToken = await login.asAdmin();
  await request(NETUNO_URL)
    .delete(`/reserved-area/user?uid=${uid}`)
    .set("Authorization", `Bearer ${accessToken}`)
}

export { createUser, deleteUser };
