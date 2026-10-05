import { beforeEach, afterEach, it, expect } from "@jest/globals";

import { createUser, deleteUser, addUserToOrganization, removeUserFromOrganization } from "../../../util/user.js";
import { createOrganization, deleteOrganization } from "../../../util/organization.js";
import asyncService, { asyncServiceAsCharlie } from "../../../asyncService.js";

let aOrgUid;
let bOrgUid;

let aliceUid;
let bobUid;
let charlieUid;

let charlieAddedToB = false;

beforeEach(async () => {
  aOrgUid = await createOrganization("a", "base");
  bOrgUid = await createOrganization("b", "base");

  aliceUid = await createUser("alice", "a", "administrator");
  bobUid = await createUser("bob", "b", "editor");
  charlieUid = await createUser("charlie", "a", "administrator");
});

afterEach(async () => {
  if (charlieAddedToB) {
    await removeUserFromOrganization(charlieUid, bOrgUid);
    charlieAddedToB = false;
  }

  await deleteUser(aliceUid);
  await deleteUser(bobUid);
  await deleteUser(charlieUid);

  await deleteOrganization(aOrgUid);
  await deleteOrganization(bOrgUid);
});

it("should not deactivate a member in an organization the logged user doesn't administer", async () => {
  await addUserToOrganization(charlieUid, "b", "editor");
  charlieAddedToB = true;

  const membershipListResponse = await asyncService({
    url: "reserved-area/organization/member/list",
    method: "POST",
    data: {
      pagination: { page: 1, size: 10 },
      filters: {
        profile_uid: bobUid
      }
    }
  });

  const membershipUid = membershipListResponse.json.data.members[0].uid;

  await expect(
    asyncServiceAsCharlie({
      url: "reserved-area/organization/member/active",
      method: "PUT",
      data: { uid: membershipUid, active: false }
    })
  )
    .rejects.toMatchObject({
      status: 403,
      json: {
        error_code: "user-unauthorized"
      }
    });
});
