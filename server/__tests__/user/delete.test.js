import request from "supertest";
import { beforeEach, afterEach, it, expect } from "@jest/globals";

import login from "../util/login.js";
import { NETUNO_URL } from "../config.js";
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
  const accessToken = await login.asAlice();

  await request(NETUNO_URL)
    .delete(`/reserved-area/user?uid=${charlieUid}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .expect(200);
});

it("shouldn't delete a user if logged user org is not above user org", async () => {
  const accessToken = await login.asAlice();

  await request(NETUNO_URL)
    .delete(`/reserved-area/user?uid=${bobUid}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .expect(403);
});

it("shouldn't delete a user if they are in more than one organization", async () => {
  await addUserToOrganization(charlieUid, "b", "editor");

  const accessToken = await login.asAlice();
  await request(NETUNO_URL)
    .delete(`/reserved-area/user?uid=${charlieUid}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .expect(409);

  await removeUserFromOrganization(charlieUid, bOrgUid);
});

it("shouldn't delete a user if logged user is not in the admin group of the user's organization", async () => {
  await addUserToOrganization(aliceUid, "b", "editor");

  const accessToken = await login.asAlice();
  await request(NETUNO_URL)
    .delete(`/reserved-area/user?uid=${bobUid}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .expect(403);

  await removeUserFromOrganization(aliceUid, bOrgUid);
});
