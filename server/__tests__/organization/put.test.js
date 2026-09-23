import request from "supertest";
import { beforeEach, afterEach, it, expect } from "@jest/globals";

import login from "../util/login.js";
import { NETUNO_URL } from "../config.js";
import { createUser, deleteUser } from "../util/user.js";
import { createOrganization, deleteOrganization } from "../util/organization.js";

let aOrgUid;
let bOrgUid;
let cOrgUid;
let c1OrgUid;
let c11OrgUid;

let aliceUid;
let bobUid;

beforeEach(async () => {
  aOrgUid = await createOrganization("a", "base");
  bOrgUid = await createOrganization("b", "base");
  cOrgUid = await createOrganization("c", "base");
  c1OrgUid = await createOrganization("c1", "c");
  c11OrgUid = await createOrganization("c11", "c1");

  aliceUid = await createUser("alice", "c", "administrator");
  bobUid = await createUser("bob", "b", "editor");
});

afterEach(async () => {
  await deleteUser(aliceUid);
  await deleteUser(bobUid);

  await deleteOrganization(aOrgUid);
  await deleteOrganization(bOrgUid);
  await deleteOrganization(c11OrgUid);
  await deleteOrganization(c1OrgUid);
  await deleteOrganization(cOrgUid);
});

it("should update an organization the logged user administers", async () => {
  const accessToken = await login.asAlice();

  await request(NETUNO_URL)
    .put("/reserved-area/organization")
    .set("Authorization", `Bearer ${accessToken}`)
    .set("Accept", "*/*")
    .set("Content-Type", "application/json")
    .send({
      active: true,
      code: "c1",
      name: "c1-updated",
      parent_code: "c",
      uid: c1OrgUid,
    })
    .expect(200);
});

it("shouldn't update an organization the logged user doesn't administer", async () => {
  const accessToken = await login.asBob();

  const response = await request(NETUNO_URL)
    .put("/reserved-area/organization")
    .set("Authorization", `Bearer ${accessToken}`)
    .set("Accept", "*/*")
    .set("Content-Type", "application/json")
    .send({
      active: true,
      code: "b",
      name: "b-updated",
      parent_code: "base",
      uid: bOrgUid,
    })
    .expect(403);

  expect(response.body.error_code).toBe("user-unauthorized");
});

it("shouldn't allow an organization to have a descendant as parent", async () => {
  const accessToken = await login.asAlice();

  const response = await request(NETUNO_URL)
    .put("/reserved-area/organization")
    .set("Authorization", `Bearer ${accessToken}`)
    .set("Accept", "*/*")
    .set("Content-Type", "application/json")
    .send({
      active: true,
      code: "c",
      name: "c",
      parent_code: "c1",
      uid: cOrgUid,
    })
    .expect(409);

  expect(response.body.error_code).toBe("hierarchy-breakdown");
});