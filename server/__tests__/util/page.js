import asyncService, { asyncServiceAsAlice } from "../asyncService.js";

const createPageAsAlice = async (name, parent) => {
  const response = await asyncServiceAsAlice({
    url: "/reserved-area/page",
    method: "POST",
    data: {
      language_code: "EN",
      link: name,
      menu: false,
      navigable: true,
      parent_uid: parent,
      template: "Default",
      title: name,
    }
  });
  return response.json.data.uid;
}

const deletePage = async (uid) => {
  if (!uid) {
    return;
  }
  try {
    await asyncService({
      url: "/reserved-area/page",
      method: "DELETE",
      data: { uid }
    });
  } catch (error) {
    if (error.status !== 404) {
      throw error;
    }
  }
}

export { createPageAsAlice, deletePage };
