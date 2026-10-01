import { beforeEach, afterEach, it, expect } from "@jest/globals";

import { createUser, deleteUser } from "../util/user.js";
import { createOrganization, deleteOrganization } from "../util/organization.js";
import { asyncServiceAsAlice, asyncServiceAsBob } from "../asyncService.js";

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
  const { status } = await asyncServiceAsAlice({
    url: "/reserved-area/organization",
    method: "PUT",
    data: {
      active: true,
      code: "c1",
      name: "c1-updated",
      parent_code: "c",
      uid: c1OrgUid,
    }
  });
  expect(status).toBe(200);
});

it("should not update an organization the logged user doesn't administer", async () => {
  await expect(asyncServiceAsBob({
    url: "/reserved-area/organization",
    method: "PUT",
    data: {
      active: true,
      code: "b",
      name: "b-updated",
      parent_code: "base",
      uid: bOrgUid,
    }
  }))
    .rejects.toMatchObject({
      status: 403,
      json: {
        error_code: "user-unauthorized"
      }
    });
});

it("should not allow an organization to have a descendant as parent", async () => {

  await expect(asyncServiceAsAlice({
    url: "/reserved-area/organization",
    method: "PUT",
    data: {
      active: true,
      code: "c",
      name: "c",
      parent_code: "c1",
      uid: cOrgUid,
    }
  }))
    .rejects.toMatchObject({
      status: 409,
      json: {
        error_code: "hierarchy-breakdown"
      }
    });
});
