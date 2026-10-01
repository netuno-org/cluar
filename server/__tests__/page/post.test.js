import asyncService, { asyncServiceAsAlice, asyncServiceAsBob } from "../asyncService.js";
import { beforeEach, afterEach, it, expect, beforeAll, afterAll } from "@jest/globals";

import { createUser, deleteUser } from "../util/user.js";
import { createOrganization, deleteOrganization } from "../util/organization.js";
import { createPageAsAlice, deletePage } from "../util/page.js";

let aOrgUid;
let bOrgUid;

let aliceUid;
let bobUid;

let newPageUid;
let subpageUid;

beforeAll(async () => {
  aOrgUid = await createOrganization("a", "base");
  bOrgUid = await createOrganization("b", "base");

  aliceUid = await createUser("alice", "a", "administrator");
  bobUid = await createUser("bob", "b", "administrator");
});

afterEach(async () => {
  await deletePage(subpageUid);
  await deletePage(newPageUid);

  newPageUid = null;
  subpageUid = null;
});

afterAll(async () => {
  await deleteUser(aliceUid);
  await deleteUser(bobUid);

  await deleteOrganization(aOrgUid);
  await deleteOrganization(bOrgUid);
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
  expect(json.data.organizationCode).toBe("a");
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
  expect(subpageResponse.json.data.organizationCode).toBe("a");
});

it("should not create a subpage if the user doesn't have permission on parent page's organization", async () => {
  const pageAUid = await createPageAsAlice("a", null);

  await expect(asyncServiceAsBob({
    url: "reserved-area/page",
    method: "POST",
    data: {
      language_code: "EN",
      link: "b",
      menu: false,
      navigable: true,
      parent_uid: pageAUid,
      template: "Default",
      title: "b",
    }
  }))
    .rejects.toHaveProperty("status", 403);
});
