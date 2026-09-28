import { asyncServiceAsAlice } from "../asyncService.js";
import { beforeEach, afterEach, it, expect } from "@jest/globals";

import { createUser, deleteUser } from "../util/user.js";
import { createOrganization, deleteOrganization } from "../util/organization.js";

let aOrgUid;
let cOrgUid;
let c1OrgUid;
let c11OrgUid;

let aliceUid;

beforeEach(async () => {
  aOrgUid = await createOrganization("a", "base");
  cOrgUid = await createOrganization("c", "base");
  c1OrgUid = await createOrganization("c1", "c");
  c11OrgUid = await createOrganization("c11", "c1");

  aliceUid = await createUser("alice", "c", "administrator");
});

afterEach(async () => {
  await deleteUser(aliceUid);

  await deleteOrganization(aOrgUid);
  await deleteOrganization(cOrgUid);
});

it("should create a user if logged user org is above new user org", async () => {
  const name = "david";
  const group = "administrator";
  const org = "c11";

  const { json, status } = await asyncServiceAsAlice({
    url: "reserved-area/user",
    method: "POST",
    data: {
      active: true,
      email: `${name}@mail.com`,
      group_code: group,
      name: name,
      organization_code: org,
      password: "12345678",
      username: name,
    }
  });
  expect(status).toBe(201);

  const newUserUid = json.data.uid;
  await deleteUser(newUserUid);
});
