import { beforeEach, afterEach, it, expect } from "@jest/globals";
import { asyncServiceAsAlice } from "../asyncService.js";

import { createUser, deleteUser, addUserToOrganization, removeUserFromOrganization } from "../util/user.js";
import { createOrganization, deleteOrganization } from "../util/organization.js";

let aOrgUid;
let bOrgUid;
let cOrgUid;
let c1OrgUid;
let c11OrgUid;

let aliceUid;
let bobUid;
let charlieUid;

beforeEach(async () => {
  aOrgUid = await createOrganization("a", "base");
  bOrgUid = await createOrganization("b", "base");
  cOrgUid = await createOrganization("c", "base");
  c1OrgUid = await createOrganization("c1", "c");
  c11OrgUid = await createOrganization("c11", "c1");

  aliceUid = await createUser("alice", "c", "administrator");
  bobUid = await createUser("bob", "b", "editor");
  charlieUid = await createUser("charlie", "c11", "administrator");
});

afterEach(async () => {
  await deleteUser(aliceUid);
  await deleteUser(bobUid);
  await deleteUser(charlieUid);

  await deleteOrganization(aOrgUid);
  await deleteOrganization(bOrgUid);
  await deleteOrganization(cOrgUid);
  await deleteOrganization(c1OrgUid);
  await deleteOrganization(c11OrgUid);
});

it("should delete a user if logged user org is above user org", async () => {
  const { status } = await asyncServiceAsAlice({
    url: "reserved-area/user",
    method: "DELETE",
    data: {
      uid: charlieUid
    }
  });
  expect(status).toBe(200);
});

it("should not delete a user if logged user org is not above user org", async () => {
  await expect(asyncServiceAsAlice({
    url: "reserved-area/user",
    method: "DELETE",
    data: {
      uid: bobUid
    }
  })).rejects.toHaveProperty("status", 403);
});

it("should not delete a user if they are in more than one organization", async () => {
  await addUserToOrganization(charlieUid, "b", "editor");

  await expect(asyncServiceAsAlice({
    url: "reserved-area/user",
    method: "DELETE",
    data: {
      uid: charlieUid
    }
  })).rejects.toHaveProperty("status", 409);

  await removeUserFromOrganization(charlieUid, bOrgUid);
});

it("should not delete a user if logged user is not in the admin group of the user's organization", async () => {
  await addUserToOrganization(aliceUid, "b", "editor");

  await expect(asyncServiceAsAlice({
    url: "reserved-area/user",
    method: "DELETE",
    data: {
      uid: bobUid
    }
  })).rejects.toHaveProperty("status", 403);

  await removeUserFromOrganization(aliceUid, bOrgUid);
});
