import request from "supertest";

import { NETUNO_URL } from "../config.js";

const loginAsAdmin = async () => {
  const loginResponse = await request(NETUNO_URL)
    .put("/_auth")
    .set("Content-Type", "application/json")
    .set("Accept", "*/*")
    .send({
      username: "admin",
      password: "admin",
      jwt: true
    })

  return loginResponse.body.access_token;
}

const loginAs = async (name) => {
  const loginResponse = await request(NETUNO_URL)
    .put("/_auth")
    .set("Content-Type", "application/json")
    .set("Accept", "*/*")
    .send({
      username: name,
      password: "12345678",
      jwt: true
    })

  return loginResponse.body.access_token;
}

export default {
  asAdmin: () => loginAsAdmin(),
  asAlice: () => loginAs("alice"),
  asBob: () => loginAs("bob"),
}
