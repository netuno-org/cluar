import { beforeEach, afterEach, it, expect } from "@jest/globals";

import { createUser, deleteUser } from "../util/user.js";
import { createOrganization, deleteOrganization } from "../util/organization.js";
import asyncService, { asyncServiceAsAlice } from "../asyncService.js";

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
  await deleteOrganization(c11OrgUid);
  await deleteOrganization(c1OrgUid);
  await deleteOrganization(cOrgUid);
});

it("shouldn't delete an organization if one of it's children has a member", async () => {
  await expect(asyncService({
    url: "/reserved-area/organization",
    method: "DELETE",
    data: { uid: cOrgUid }
  })).rejects.toHaveProperty("status", 409);
});

it("shouldn't delete an organization if logged user is not a member", async () => {
  await expect(asyncServiceAsAlice({
    url: "/reserved-area/organization",
    method: "DELETE",
    data: { uid: bOrgUid }
  }))
    .rejects.toMatchObject({
      status: 403,
      json: {
        error_code: "user-unauthorized"
      }
    });
});
