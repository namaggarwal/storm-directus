module.exports = function registerHook() {

  const sanitizeProjectInput = (input) => {
    return {
      ...input,
      max_budget: input.max_budget || input.max_budget === 0 ? input.max_budget : null,
      min_budget: input.min_budget || input.min_budget === 0 ? input.min_budget : null,
      min_area: input.min_area || input.min_area === 0 ? input.min_area : null,
    }
  }

  const sanitizeCustomersInput = (input) => {
    return {
      ...input,
      date_of_birth: input.date_of_birth ? input.date_of_birth: null,
      date_of_birth_additional: input.date_of_birth_additional ?date_of_birth_additional: null,
    }
  }

	return {
		'items.create.before': async function (input, { collection }) {
      switch(collection) {
        case 'projects':
          return sanitizeProjectInput(input);
        case 'custom.customers':
          return sanitizeCustomersInput(input);
         default:
           return input;
      }
		},
	};
};