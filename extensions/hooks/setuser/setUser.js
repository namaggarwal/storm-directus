const CUSTOM_COLLECTIONS = ["projects", "custom.customers", "custom.actions", "custom.projects"];
const CUSTOM_UPDATE_COLLECTIONS = ["custom.customers"];

const CREATE_FIELDS_MAP = {
  "projects": ["user_created", "user_updated"],
  "custom.projects": ["user_created", "user_updated"],
  "custom.customers": ["user_created", "user_updated","user_incharge"],
  "custom.actions": ["user_created"],
}

module.exports = {
  setCreateUserValues: async (input, { collection, accountability }) => {
    if (!CUSTOM_COLLECTIONS.includes(collection)) {
      return input;
    }
    if (accountability.user) {
      const userFields = CREATE_FIELDS_MAP[collection] || [];
      const userFilledFields = userFields.reduce((prev, curr)=> ({...prev, [curr]: accountability.user}), {});

      input = {
        ...input,
        ...userFilledFields,
      };
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
