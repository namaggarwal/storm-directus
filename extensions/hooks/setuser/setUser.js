const CUSTOM_COLLECTIONS = ['projects', 'custom.customers'];

module.exports = async function setUserValues(input, {accountability, collection}) {
  if(!CUSTOM_COLLECTIONS.includes(collection)) {
    return input;
  }

  if(accountability.user) {
    input = {
      ...input,
      user_created: accountability.user,
      user_updated: accountability.user,
      user_incharge: accountability.user,
    }
  }
  return input;
}
