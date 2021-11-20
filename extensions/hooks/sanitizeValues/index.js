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
  "profession",
  "profession_additional",
  "vendor_date_of_birth",
  "vendor_date_of_birth_additional",
  "vendor_profession",
  "vendor_profession_additional",
  "customer_source",
  "date_of_compromise",
  "dia_end_date",
  "date_of_act",
  "net_selling_price",
  "hai_sale_price",
  "security_deposit",
  "lots_sold",
  "coownership_lots",
  "total_funding_amount",
  "suspensive_conditions",
  "project_contribution",
  "mandate",
  "agency_fees",
  "procedure_progress",
  "property_use",
  "purchase_type",
  "loan_term",
  "loan_rate",
  "bank_deposit_date",
  "loan_agreement_date",
  "loan_acceptance_date",
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
