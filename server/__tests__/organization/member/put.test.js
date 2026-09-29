import { beforeEach, afterEach, it, expect } from "@jest/globals";

import { createUser, deleteUser } from "../../util/user.js";
import { createOrganization, deleteOrganization } from "../../util/organization.js";
import { asyncServiceAsAlice, asyncServiceAsBob } from "../../asyncService.js";

let aOrgUid;
let bOrgUid;
let cOrgUid;

let aliceUid;
let bobUid;
let charlieUid;

let memberUid;

beforeEach(async () => {
  aOrgUid = await createOrganization("a", "base");
  bOrgUid = await createOrganization("b", "base");
  cOrgUid = await createOrganization("c", "base");

  aliceUid = await createUser("alice", "c", "administrator");
  bobUid = await createUser("bob", "b", "editor");
  charlieUid = await createUser("charlie", "c", "editor");

  const listResponse = await asyncServiceAsAlice({
    url: "reserved-area/organization/member/list",
    method: "POST",
    data: {
      filters: { profile_uid: charlieUid },
    }
  });
  memberUid = listResponse.json.data.members[0].uid;
});

afterEach(async () => {
  await deleteUser(aliceUid);
  await deleteUser(bobUid);
  await deleteUser(charlieUid);

  await deleteOrganization(aOrgUid);
  await deleteOrganization(bOrgUid);
  await deleteOrganization(cOrgUid);
  await deleteOrganization(c1OrgUid);
  await deleteOrganization(cOrgUid);
});

it("should update a member in an organization the logged user administers", async () => {
  const { json, status } = await asyncServiceAsAlice({
    url: "reserved-area/organization/member",
    method: "PUT",
    data: {
      active: false,
      group_code: "editor",
      organization_code: "c",
      profile_uid: charlieUid,
      uid: memberUid,
    }
  });

  expect(status).toBe(200);
  expect(json.result).toBe(true);
});

it("shouldn't update a member in an organization the logged user doesn't administer", async () => {
  const promise = asyncServiceAsBob({
    url: "reserved-area/organization/member",
    method: "POST",
    data: {
      active: false,
      group_code: "editor",
      organization_code: "c",
      profile_uid: charlieUid,
      uid: memberUid,
    }
  });

  await expect(promise).rejects.toMatchObject({
    status: 403,
    json: {
      error_code: "user-unauthorized"
    }
  });
});
