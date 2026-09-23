import request from "supertest";
import { beforeEach, afterEach, it, expect } from "@jest/globals";

import login from "../../util/login.js";
import { NETUNO_URL } from "../../config.js";
import { createUser, deleteUser, removeUserFromOrganization } from "../../util/user.js";
import { createOrganization, deleteOrganization } from "../../util/organization.js";

let aOrgUid;
let bOrgUid;
let cOrgUid;
let c1OrgUid;
let c11OrgUid;

let aliceUid;
let bobUid;
let charlieUid;

let membershipAddedToC = false;

beforeEach(async () => {
  aOrgUid = await createOrganization("a", "base");
  bOrgUid = await createOrganization("b", "base");
  cOrgUid = await createOrganization("c", "base");
  c1OrgUid = await createOrganization("c1", "c");
  c11OrgUid = await createOrganization("c11", "c1");

  aliceUid = await createUser("alice", "c", "administrator");
  bobUid = await createUser("bob", "b", "editor");
  charlieUid = await createUser("charlie", "c11", "administrator");

  membershipAddedToC = false;
});

afterEach(async () => {
  if (membershipAddedToC) {
    await removeUserFromOrganization(charlieUid, cOrgUid);
  }

  await deleteUser(aliceUid);
  await deleteUser(bobUid);
  await deleteUser(charlieUid);

  await deleteOrganization(aOrgUid);
  await deleteOrganization(bOrgUid);
  await deleteOrganization(c11OrgUid);
  await deleteOrganization(c1OrgUid);
  await deleteOrganization(cOrgUid);
});

it("should add a member to an organization the logged user administers", async () => {
  const accessToken = await login.asAlice();

  const response = await request(NETUNO_URL)
    .post("/reserved-area/organization/member")
    .set("Authorization", `Bearer ${accessToken}`)
    .set("Accept", "*/*")
    .set("Content-Type", "application/json")
    .send({
      active: true,
      group_code: "editor",
      organization_code: "c",
      profile_uid: charlieUid,
    })
    .expect(201);

  expect(response.body.member.uid).toBeDefined();
  membershipAddedToC = true;
});

it("shouldn't add a member to an organization the logged user doesn't administer", async () => {
  const accessToken = await login.asBob();

  const response = await request(NETUNO_URL)
    .post("/reserved-area/organization/member")
    .set("Authorization", `Bearer ${accessToken}`)
    .set("Accept", "*/*")
    .set("Content-Type", "application/json")
    .send({
      active: true,
      group_code: "editor",
      organization_code: "b",
      profile_uid: charlieUid,
    })
    .expect(403);

  expect(response.body.error_code).toBe("user-unauthorized");
});