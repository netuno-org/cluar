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

beforeEach(async () => {
  aOrgUid = await createOrganization("a", "base");
  bOrgUid = await createOrganization("b", "base");
  cOrgUid = await createOrganization("c", "base");
  c1OrgUid = await createOrganization("c1", "c");
  c11OrgUid = await createOrganization("c11", "c1");

  aliceUid = await createUser("alice", "c11", "administrator");
});

afterEach(async () => {
  await deleteUser(aliceUid);

  await deleteOrganization(aOrgUid);
  await deleteOrganization(bOrgUid);
  await deleteOrganization(cOrgUid);
  await deleteOrganization(c1OrgUid);
  await deleteOrganization(c11OrgUid);
});

it("shouldn't delete an organization if one of it's children has a member", async () => {
  const accessToken = await login.asAdmin();

  await request(NETUNO_URL)
    .delete(`/reserved-area/organization?uid=${cOrgUid}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .expect(409);
});

it("shouldn't delete an organization if logged user is not a member", async () => {
  const accessToken = await login.asAlice();

  await request(NETUNO_URL)
    .delete(`/reserved-area/organization?uid=${bOrgUid}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .expect(403);
});
