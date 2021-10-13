const CUSTOM_COLLECTIONS = ["projects", "custom.customers", "custom.actions"];
const CUSTOM_UPDATE_COLLECTIONS = ["custom.customers"];

module.exports = {
  setCreateUserValues: async (input, { collection, accountability }) => {
    if (!CUSTOM_COLLECTIONS.includes(collection)) {
      return input;
    }
    if (accountability.user) {
      input = {
        ...input,
        user_created: accountability.user,
      };

      if (collection != "custom.actions") {
        input = {
          ...input,
          user_updated: accountability.user,
          user_incharge: accountability.user,
        };
      }
    }
    return input;
  },
  setUpdateUserValues: async (input, { collection, accountability }) => {
    if (!CUSTOM_UPDATE_COLLECTIONS.includes(collection)) {
      return input;
    }
    if (accountability.user) {
      input = {
        ...input,
        user_updated: accountability.user,
      };
    }
    return input;
  }
};
