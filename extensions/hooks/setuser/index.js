const { setCreateUserValues, setUpdateUserValues } = require('./setUser');

module.exports = function registerHook() {
	return {
		'items.create.before': setCreateUserValues,
		'items.update.before': setUpdateUserValues,
	};
};