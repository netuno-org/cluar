import request from "supertest";
import { beforeEach, afterEach, it, expect } from "@jest/globals";

import login from "../../util/login.js";
import { NETUNO_URL } from "../../config.js";
import { createUser, deleteUser } from "../../util/user.js";
import { createOrganization, deleteOrganization } from "../../util/organization.js";

let aOrgUid;
let bOrgUid;
let cOrgUid;

let aliceUid;
let bobUid;
let charlieUid;

let memberUid;

beforeEach(async () => {
  aOrgUid = await createOrganization("a", "base");
  bOrgUid = await createOrganization("b", "base");
  cOrgUid = await createOrganization("c", "base");

  aliceUid = await createUser("alice", "c", "administrator");
  bobUid = await createUser("bob", "b", "editor");
  charlieUid = await createUser("charlie", "c", "editor");

  const aliceAccessToken = await login.asAlice();
  const listResponse = await request(NETUNO_URL)
    .post("/reserved-area/organization/member/list")
    .set("Authorization", `Bearer ${aliceAccessToken}`)
    .set("Accept", "*/*")
    .set("Content-Type", "application/json")
    .send({
      filters: { profile_uid: charlieUid },
    });
  memberUid = listResponse.body.members[0].uid;
});

afterEach(async () => {
  await deleteUser(aliceUid);
  await deleteUser(bobUid);
  await deleteUser(charlieUid);

  await deleteOrganization(aOrgUid);
  await deleteOrganization(bOrgUid);
  await deleteOrganization(cOrgUid);
});

it("should update a member in an organization the logged user administers", async () => {
  const accessToken = await login.asAlice();

  await request(NETUNO_URL)
    .put("/reserved-area/organization/member")
    .set("Authorization", `Bearer ${accessToken}`)
    .set("Accept", "*/*")
    .set("Content-Type", "application/json")
    .send({
      active: false,
      group_code: "editor",
      organization_code: "c",
      profile_uid: charlieUid,
      uid: memberUid,
    })
    .expect(200);
});

it("shouldn't update a member in an organization the logged user doesn't administer", async () => {
  const accessToken = await login.asBob();

  const response = await request(NETUNO_URL)
    .put("/reserved-area/organization/member")
    .set("Authorization", `Bearer ${accessToken}`)
    .set("Accept", "*/*")
    .set("Content-Type", "application/json")
    .send({
      active: false,
      group_code: "editor",
      organization_code: "c",
      profile_uid: charlieUid,
      uid: memberUid,
    })
    .expect(403);

  expect(response.body.error_code).toBe("user-unauthorized");
});