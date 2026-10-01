import { beforeEach, afterEach, it, expect } from "@jest/globals";

import { createUser, deleteUser } from "../util/user.js";
import { createOrganization, deleteOrganization } from "../util/organization.js";
import { asyncServiceAsAlice } from "../asyncService.js";

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
  await deleteOrganization(createdOrgUid);

  await deleteUser(aliceUid);
  await deleteUser(bobUid);

  await deleteOrganization(aOrgUid);
  await deleteOrganization(bOrgUid);
  await deleteOrganization(c11OrgUid);
  await deleteOrganization(c1OrgUid);
  await deleteOrganization(cOrgUid);
});

it("should create an organization under an organization the logged user administers", async () => {
  const { json, status } = await asyncServiceAsAlice({
    url: "reserved-area/organization",
    method: "POST",
    data: {
      active: true,
      code: "x",
      name: "x",
      parent_code: "c1",
    }
  });
  expect(status).toBe(201);
  createdOrgUid = json.data.uid;
});

it("should not create an organization under an organization the logged user doesn't administer", async () => {
  await expect(asyncServiceAsAlice({
    url: "reserved-area/organization",
    method: "POST",
    data: {
      active: true,
      code: "x",
      name: "x",
      parent_code: "b",
    }
  }))
    .rejects.toMatchObject({
      status: 403,
      json: {
        error_code: "user-unauthorized"
      }
    });
});
