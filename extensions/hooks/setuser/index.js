const setUserValues = require('./setUser');

module.exports = function registerHook() {
	return {
		'items.create.before': setUserValues,
	};
};