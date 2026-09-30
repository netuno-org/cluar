import asyncService, { asyncServiceAsAlice } from "../asyncService.js";
import { beforeEach, afterEach, it, expect } from "@jest/globals";

import { createUser, deleteUser } from "../util/user.js";
import { createOrganization, deleteOrganization } from "../util/organization.js";
import { deletePage } from "../util/page.js";

let aOrgUid;
let cOrgUid;
let c1OrgUid;
let c11OrgUid;

let aliceUid;

let newPageUid;
let subpageUid;

beforeEach(async () => {
  aOrgUid = await createOrganization("a", "base");
  cOrgUid = await createOrganization("c", "base");
  c1OrgUid = await createOrganization("c1", "c");
  c11OrgUid = await createOrganization("c11", "c1");

  aliceUid = await createUser("alice", "c", "administrator");
});

afterEach(async () => {
  await deletePage(subpageUid);
  await deletePage(newPageUid);

  await deleteUser(aliceUid);

  await deleteOrganization(aOrgUid);
  await deleteOrganization(cOrgUid);
  await deleteOrganization(c1OrgUid);
  await deleteOrganization(c11OrgUid);

  newPageUid = null;
  subpageUid = null;
});

it("should create a page belonging to the user's organization", async () => {
  const { json, status } = await asyncServiceAsAlice({
    url: "reserved-area/page",
    method: "POST",
    data: {
      language_code: "EN",
      link: "a",
      menu: false,
      navigable: true,
      parent_uid: null,
      template: "Default",
      title: "a",
    }
  });

  newPageUid = json?.data?.uid;

  expect(status).toBe(200);
  expect(json.data.organizationCode).toBe("c");
});

it("should create a subpage belonging to the parent page's organization", async () => {
  const parentReponse = await asyncServiceAsAlice({
    url: "reserved-area/page",
    method: "POST",
    data: {
      language_code: "EN",
      link: "a",
      menu: false,
      navigable: true,
      parent_uid: null,
      template: "Default",
      title: "a",
    }
  });
  newPageUid = parentReponse?.json?.data?.uid;

  const subpageResponse = await asyncService({
    url: "reserved-area/page",
    method: "POST",
    data: {
      language_code: "EN",
      link: "b",
      menu: false,
      navigable: true,
      parent_uid: newPageUid,
      template: "Default",
      title: "b",
    }
  });
  subpageUid = subpageResponse?.json?.data?.uid;

  expect(subpageResponse.status).toBe(200);
  expect(subpageResponse.json.data.organizationCode).toBe("c");
});
