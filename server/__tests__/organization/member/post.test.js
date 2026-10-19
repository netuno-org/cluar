import request from "supertest";
import { beforeEach, afterEach, it, expect } from "@jest/globals";

import { createUser, deleteUser, removeUserFromOrganization } from "../../util/user.js";
import { createOrganization, deleteOrganization } from "../../util/organization.js";
import { asyncServiceAsAlice, asyncServiceAsBob } from "../../asyncService.js";
import { EDITOR, ADMIN } from "../../util/group.js";

let aOrgUid;
let bOrgUid;
let cOrgUid;
let c1OrgUid;
let c11OrgUid;

let aliceUid;
let bobUid;
let charlieUid;

let membershipAddedToC = false;

beforeEach(async () => {
  aOrgUid = await createOrganization("a", "base");
  bOrgUid = await createOrganization("b", "base");
  cOrgUid = await createOrganization("c", "base");
  c1OrgUid = await createOrganization("c1", "c");
  c11OrgUid = await createOrganization("c11", "c1");

  aliceUid = await createUser("alice", "c", ADMIN);
  bobUid = await createUser("bob", "b", EDITOR);
  charlieUid = await createUser("charlie", "c11", ADMIN);
});

afterEach(async () => {
  if (membershipAddedToC) {
    await removeUserFromOrganization(charlieUid, cOrgUid);
    membershipAddedToC = false;
  }

  await deleteUser(aliceUid);
  await deleteUser(bobUid);
  await deleteUser(charlieUid);

  await deleteOrganization(aOrgUid);
  await deleteOrganization(bOrgUid);
  await deleteOrganization(c11OrgUid);
  await deleteOrganization(c1OrgUid);
  await deleteOrganization(cOrgUid);
});

it("should add a member to an organization the logged user administers", async () => {
  const { json, status } = await asyncServiceAsAlice({
    url: "reserved-area/organization/member",
    method: "POST",
    data: {
      active: true,
      group_code: EDITOR,
      organization_code: "c",
      profile_uid: charlieUid,
    }
  });
  expect(status).toBe(201);

  expect(json.data.uid).toBeDefined();
  membershipAddedToC = true;
});

it("should not add a member to an organization the logged user isn't a member of", async () => {
  const promise = asyncServiceAsAlice({
    url: "reserved-area/organization/member",
    method: "POST",
    data: {
      active: true,
      group_code: EDITOR,
      organization_code: "b",
      profile_uid: charlieUid,
    }
  });

  await expect(promise).rejects.toMatchObject({
    status: 403,
    json: {
      error_code: "user-unauthorized"
    }
  });
});

it("should not add a member to an organization the logged user is just an editor of", async () => {
  const promise = asyncServiceAsBob({
    url: "reserved-area/organization/member",
    method: "POST",
    data: {
      active: true,
      group_code: EDITOR,
      organization_code: "b",
      profile_uid: charlieUid,
    }
  });

  await expect(promise).rejects.toMatchObject({
    status: 403,
    json: {
      error_code: "user-unauthorized"
    }
  });
});
