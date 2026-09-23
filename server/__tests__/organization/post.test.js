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

let createdOrgUid;

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
  if (createdOrgUid) {
    await deleteOrganization(createdOrgUid);
  }

  await deleteUser(aliceUid);
  await deleteUser(bobUid);

  await deleteOrganization(aOrgUid);
  await deleteOrganization(bOrgUid);
  await deleteOrganization(c11OrgUid);
  await deleteOrganization(c1OrgUid);
  await deleteOrganization(cOrgUid);
});

it("should create an organization under an organization the logged user administers", async () => {
  const accessToken = await login.asAlice();

  const response = await request(NETUNO_URL)
    .post("/reserved-area/organization")
    .set("Authorization", `Bearer ${accessToken}`)
    .set("Accept", "*/*")
    .set("Content-Type", "application/json")
    .send({
      active: true,
      code: "x",
      name: "x",
      parent_code: "c1",
    })
    .expect(201);

  createdOrgUid = response.body.organization.uid;
});

it("shouldn't create an organization under an organization the logged user doesn't administer", async () => {
  const accessToken = await login.asAlice();

  const response = await request(NETUNO_URL)
    .post("/reserved-area/organization")
    .set("Authorization", `Bearer ${accessToken}`)
    .set("Accept", "*/*")
    .set("Content-Type", "application/json")
    .send({
      active: true,
      code: "x",
      name: "x",
      parent_code: "b",
    })
    .expect(403);

  expect(response.body.error_code).toBe("user-unauthorized");
});