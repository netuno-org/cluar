import { beforeEach, afterEach, it, expect } from "@jest/globals";

import { createUser, deleteUser, addUserToOrganization, removeUserFromOrganization } from "../../util/user.js";
import { createOrganization, deleteOrganization } from "../../util/organization.js";
import { asyncServiceAsAlice } from "../../asyncService.js";

let aOrgUid;
let bOrgUid;

let aliceUid;
let bobUid;

let bobAddedToA = false;

beforeEach(async () => {
  aOrgUid = await createOrganization("a", "base");
  bOrgUid = await createOrganization("b", "base");

  aliceUid = await createUser("alice", "a", "administrator");
  bobUid = await createUser("bob", "b", "editor");
});

afterEach(async () => {
  if (bobAddedToA) {
    await removeUserFromOrganization(bobUid, aOrgUid);
    bobAddedToA = false;
  }

  await deleteUser(aliceUid);
  await deleteUser(bobUid);

  await deleteOrganization(aOrgUid);
  await deleteOrganization(bOrgUid);
});

it("should not deactivate a user if the logged user is not an admin of the same org", async () => {
  await expect(
    asyncServiceAsAlice({
      url: "reserved-area/user/active",
      method: "PUT",
      data: { uid: bobUid, active: false }
    })
  )
    .rejects.toMatchObject({
      status: 403,
      json: {
        error_code: "user-unauthorized"
      }
    });
});

it("should not deactivate a user if they belong to more than one organization",
  async () => {
    await addUserToOrganization(bobUid, "a", "editor");
    bobAddedToA = true;

    await expect(
      asyncServiceAsAlice({
        url: "reserved-area/user/active",
        method: "PUT",
        data: { uid: bobUid, active: false }
      })
    )
      .rejects.toMatchObject({
        status: 403,
        json: {
          error_code: "user-unauthorized"
        }
      });
  });
