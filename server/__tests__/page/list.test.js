import { beforeEach, afterEach, it, expect } from "@jest/globals";

import { createUser, deleteUser } from "../util/user.js";
import { createOrganization, deleteOrganization } from "../util/organization.js";
import { createPageAs, deletePage } from "../util/page.js";
import { asyncServiceAs } from "../asyncService.js";

let laOrgUid;
let la1OrgUid;
let lbOrgUid;

let aliceUid;
let erinUid;
let fredUid;
let bobUid;

let laPageUid;
let la1PageUid;

const listPagesAs = async (username) => {
  const { json } = await asyncServiceAs({
    url: "reserved-area/page/list",
    method: "POST",
    data: {}
  }, username);

  const uids = [];
  const data = json.data || {};

  for (const language of Object.keys(data)) {
    for (const page of data[language]) {
      uids.push(page.uid);
    }
  }

  return uids;
};

beforeEach(async () => {
  laOrgUid = await createOrganization("la", "base");
  la1OrgUid = await createOrganization("la1", "la");
  lbOrgUid = await createOrganization("lb", "base");

  aliceUid = await createUser("alice", "la", "administrator");
  erinUid = await createUser("erin", "la1", "administrator");
  fredUid = await createUser("fred", "la", "editor");
  bobUid = await createUser("bob", "lb", "editor");

  laPageUid = await createPageAs("alice", "la-page", null);
  la1PageUid = await createPageAs("erin", "la1-page", null);
});

afterEach(async () => {
  await deletePage(laPageUid);
  await deletePage(la1PageUid);

  await deleteUser(aliceUid);
  await deleteUser(erinUid);
  await deleteUser(fredUid);
  await deleteUser(bobUid);

  await deleteOrganization(la1OrgUid);
  await deleteOrganization(laOrgUid);
  await deleteOrganization(lbOrgUid);
});

it("should list the pages of an administrator", async () => {
  const uids = await listPagesAs("alice");

  expect(uids).toContain(laPageUid);
  expect(uids).toContain(la1PageUid);
});

it("should list the pages of the organization an editor belongs to", async () => {
  const uids = await listPagesAs("fred");

  expect(uids).toContain(laPageUid);
});

it("should list the pages of the descendant organizations of an editor", async () => {
  const uids = await listPagesAs("fred");

  expect(uids).toContain(la1PageUid);
});

it("should not list the pages of an unrelated editor", async () => {
  const uids = await listPagesAs("bob");

  expect(uids).not.toContain(laPageUid);
  expect(uids).not.toContain(la1PageUid);
});
