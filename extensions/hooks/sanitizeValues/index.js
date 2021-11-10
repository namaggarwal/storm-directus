const optionalProjectNums = [
  "min_area",
  "min_budget",
  "max_budget",
  "loan_amount",
  "project_contribution",
  "tax_income",
];

module.exports = function registerHook() {
  const sanitizeProjectInput = (input) => {
    optionalProjectNums.forEach((opt) => {
      input[opt] = input[opt] || input[opt] === 0 ? input[opt] : null;
    });
    return input;
  };

  const sanitizeCustomersInput = (input) => {
    return {
      ...input,
      date_of_birth: input.date_of_birth ? input.date_of_birth : null,
      date_of_birth_additional: input.date_of_birth_additional
        ? date_of_birth_additional
        : null,
      customer_source: input.customer_source ? input.customer_source : null,
    };
  };

  const sanitizeUpdateCustomerInput = (input, currData) => {
    return sanitizeCustomersInput(input);
  };

  const sanitizeUpdateProjectInput = (input, currData) => {
    optionalProjectNums.forEach((opt) => {
      if (opt in input) {
        input[opt] = input[opt] || input[opt] === 0 ? input[opt] : null;
      }
    });
    return input;
  };

  return {
    "items.create.before": async function (input, { collection }) {
      switch (collection) {
        case "projects":
        case "custom.projects":
          return sanitizeProjectInput(input);
        case "custom.customers":
          return sanitizeCustomersInput(input);
        default:
          return input;
      }
    },
    "items.update.before": async function (input, { collection, currData }) {
      switch (collection) {
        case "custom.customers":
          return sanitizeUpdateCustomerInput(input, currData);
        case "custom.projects":
          return sanitizeUpdateProjectInput(input, currData);
        default:
          return input;
      }
    },
  };
};
