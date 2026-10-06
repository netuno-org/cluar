import asyncService, { asyncServiceAs } from "../asyncService.js";

const createPageAs = async (username, name, parent) => {
  const response = await asyncServiceAs({
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
  }, username);
  return response.json.data.uid;
};

const createPageAsAlice = async (name, parent) => createPageAs("alice", name, parent);

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

export { createPageAs, createPageAsAlice, deletePage };
