import request from "supertest";
import { beforeEach, afterEach, test, it, expect } from "@jest/globals";

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
let bobUid;
let charlieUid;

beforeEach(async () => {
  aUid = await createOrganization("a", "base");
  bUid = await createOrganization("b", "base");
  cUid = await createOrganization("c", "base");
  c1Uid = await createOrganization("c1", "c");
  c11Uid = await createOrganization("c11", "c1");

  aliceUid = await createUser("alice", "c", "administrator");
  bobUid = await createUser("bob", "b", "administrator");
  charlieUid = await createUser("charlie", "c11", "administrator");
});

afterEach(async () => {
  await deleteUser(aliceUid);
  await deleteUser(bobUid);
  await deleteUser(charlieUid);

  await deleteOrganization(aUid);
  await deleteOrganization(bUid);
  await deleteOrganization(cUid);
  await deleteOrganization(c1Uid);
  await deleteOrganization(c11Uid);
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
  let accessToken = await login.asAdmin();
  await request(NETUNO_URL)
    .post(`/reserved-area/organization/member`)
    .set("Authorization", `Bearer ${accessToken}`)
    .set("Accept", "*/*")
    .set("Content-Type", "application/json")
    .send({
      active: true,
      group_code: "editor",
      organization_code: "b",
      profile_uid: charlieUid,
    });

  accessToken = await login.asAlice();
  await request(NETUNO_URL)
    .delete(`/reserved-area/user?uid=${charlieUid}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .expect(409);

  await request(NETUNO_URL)
    .delete(`/reserved-area/organization/member`)
    .set("Authorization", `Bearer ${accessToken}`)
    .set("Accept", "*/*")
    .set("Content-Type", "application/json")
    .send({
      organization_uid: bUid,
      profile_uid: charlieUid,
    });
});
