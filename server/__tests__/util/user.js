import asyncService from "../asyncService";

const createUser = async (name, org, group) => {
  const response = await asyncService({
    url: "/reserved-area/user",
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
  return response.json.data.uid;
}

const deleteUser = async (uid) => {
  try {
    await asyncService({
      url: "/reserved-area/user",
      method: "DELETE",
      data: { uid }
    });
  } catch (error) {
    if (error.status !== 404) {
      throw error;
    }
  }
}

const addUserToOrganization = async (userUid, org, group) => {
  await asyncService({
    url: "/reserved-area/organization/member",
    method: "POST",
    data: {
      active: true,
      group_code: group,
      organization_code: org,
      profile_uid: userUid,
    }
  });
}

const removeUserFromOrganization = async (userUid, orgUid) => {
  await asyncService({
    url: "/reserved-area/organization/member",
    method: "DELETE",
    data: {
      organization_uid: orgUid,
      profile_uid: userUid,
    }
  });
}

export { createUser, deleteUser, addUserToOrganization, removeUserFromOrganization };
