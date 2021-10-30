const setUserHook = require("../../../hooks/setuser");
const sanitizeInputHook = require("../../../hooks/sanitizeValues");

const beforeCreateHooks = [
  sanitizeInputHook()["items.create.before"],
  setUserHook()["items.create.before"],
];

const beforeUpdateHooks = [
  sanitizeInputHook()["items.update.before"],
  setUserHook()["items.update.before"],
];

async function applyCreateBeforeRules(input, accountability, collection) {
  for (i in beforeCreateHooks) {
    input = await beforeCreateHooks[i](input, { accountability, collection });
  }
  return input;
}

async function applyUpdateBeforeRules(input, accountability, collection, currData) {
  for (i in beforeUpdateHooks) {
    input = await beforeUpdateHooks[i](input, { accountability, collection, currData });
  }
  return input;
}

module.exports = {
  applyCreateBeforeRules,
  applyUpdateBeforeRules,
}