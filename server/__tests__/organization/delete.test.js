import request from "supertest";
import { beforeEach, afterEach, test, it, expect } from "@jest/globals";

import login from '../util/login.js';
import { NETUNO_URL } from '../config.js';

let aUid;
let bUid;
let cUid;
let c1Uid;
let c11Uid;

let aliceUid;

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

beforeEach(async () => {
  aUid = await createOrganization("a", "base");
  bUid = await createOrganization("b", "base");
  cUid = await createOrganization("c", "base");
  c1Uid = await createOrganization("c1", "c");
  c11Uid = await createOrganization("c11", "c1");

  const accessToken = await login.asAdmin();

  const newUserResponse = await request(NETUNO_URL)
    .post("/reserved-area/user")
    .set("Authorization", `Bearer ${accessToken}`)
    .set("Accept", "*/*")
    .set("Content-Type", "application/json")
    .send({
      active: true,
      email: "alice@mail.com",
      group_code: "administrator",
      name: "Alice",
      organization_code: "c11",
      password: "12345678",
      username: "alice",
    });

  aliceUid = newUserResponse.body.user.uid;
});

afterEach(async () => {
  const accessToken = await login.asAdmin();

  await request(NETUNO_URL)
    .delete(`/reserved-area/user?uid=${aliceUid}`)
    .set("Authorization", `Bearer ${accessToken}`)

  await deleteOrganization(aUid);
  await deleteOrganization(bUid);
  await deleteOrganization(cUid);
  await deleteOrganization(c1Uid);
  await deleteOrganization(c11Uid);
});

it("shouldn't delete an organization if one of it's children has a member", async () => {
  const accessToken = await login.asAdmin();

  await request(NETUNO_URL)
    .delete(`/reserved-area/organization?uid=${cUid}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .expect(409);
});

it("shouldn't delete an organization if logged user is not a member", async () => {
  const accessToken = await login.asAlice();

  await request(NETUNO_URL)
    .delete(`/reserved-area/organization?uid=${bUid}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .expect(403);
});
