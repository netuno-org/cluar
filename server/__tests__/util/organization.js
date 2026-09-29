import asyncService from "../asyncService.js";

const createOrganization = async (name, parent) => {
  const response = await asyncService({
    url: "/reserved-area/organization",
    method: "POST",
    data: {
      active: true,
      code: name,
      name: name,
      parent_code: parent
    }
  });
  return response.json.data.uid;
}

const deleteOrganization = async (uid) => {
  const response = await asyncService({
    url: "/reserved-area/organization",
    method: "DELETE",
    data: { uid }
  });
}

export { createOrganization, deleteOrganization };
