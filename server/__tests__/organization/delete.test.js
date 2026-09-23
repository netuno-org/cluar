import request from "supertest";
import { beforeEach, afterEach, it, expect } from "@jest/globals";

import login from "../util/login.js";
import { NETUNO_URL } from "../config.js";
import { createUser, deleteUser } from "../util/user.js";
import { createOrganization, deleteOrganization } from "../util/organization.js";

let aUid;
let bUid;
let cUid;
let c1Uid;
let c11Uid;

let aliceUid;

beforeEach(async () => {
  aUid = await createOrganization("a", "base");
  bUid = await createOrganization("b", "base");
  cUid = await createOrganization("c", "base");
  c1Uid = await createOrganization("c1", "c");
  c11Uid = await createOrganization("c11", "c1");

  aliceUid = await createUser("alice", "c11", "administrator");
});

afterEach(async () => {
  await deleteUser(aliceUid);

  await deleteOrganization(aUid);
  await deleteOrganization(bUid);
  await deleteOrganization(cUid);
  await deleteOrganization(c1Uid);
  await deleteOrganization(c11Uid);
});

it("shouldn't delete an organization if one of it's children has a member", async () => {
  const accessToken = await login.asAdmin();

  await request(NETUNO_URL)
    .delete(`/reserved-area/organization?uid=${cUid}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .expect(409);
});

it("shouldn't delete an organization if logged user is not a member", async () => {
  const accessToken = await login.asAlice();

  await request(NETUNO_URL)
    .delete(`/reserved-area/organization?uid=${bUid}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .expect(403);
});
