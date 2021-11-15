const optionalProjectNums = [
  "min_area",
  "min_budget",
  "max_budget",
  "loan_amount",
  "project_contribution",
  "tax_income",
];

const optionalCustomerNums = [
  "date_of_birth",
  "date_of_birth_additional",
  "customer_source",
  "profession",
  "profession_additional",
]

module.exports = function registerHook() {
  const sanitizeProjectInput = (input) => {
    optionalProjectNums.forEach((opt) => {
      input[opt] = input[opt] || input[opt] === 0 ? input[opt] : null;
    });
    return input;
  };

  const sanitizeCustomersInput = (input) => {
    optionalCustomerNums.forEach((opt) => {
      input[opt] = input[opt] ? input[opt] : null;
    });
    return input;
  };

  const sanitizeUpdateCustomerInput = (input, currData) => {
    optionalCustomerNums.forEach((opt) => {
      if (opt in input) {
        input[opt] = input[opt] ? input[opt] : null;
      }
    });
    return input;
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
