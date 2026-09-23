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

it("should create a user if logged user org is above new user org", async () => {
  const accessToken = await login.asAlice();

  const name = "david";
  const group = "administrator";
  const org = "c11";

  const response = await request(NETUNO_URL)
    .post("/reserved-area/user")
    .set("Authorization", `Bearer ${accessToken}`)
    .set("Accept", "*/*")
    .set("Content-Type", "application/json")
    .send({
      active: true,
      email: `${name}@mail.com`,
      group_code: group,
      name: name,
      organization_code: org,
      password: "12345678",
      username: name,
    })
    .expect(201);

  const newUserUid = response.body.user.uid;
  deleteUser(newUserUid);
});
