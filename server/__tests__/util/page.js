import asyncService from "../asyncService.js";

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

export { deletePage };
