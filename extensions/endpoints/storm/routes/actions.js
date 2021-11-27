const {
  applyCreateBeforeRules,
} = require("../utils/hooks");

const CustomerService = require("../services/CustomerService");
const Customers = require("../models/Customers");

const Actions = require("../models/Actions");
const ActionService = require("../services/ActionService");

async function addAction({ database, accountability }, customerID, reqData) {
  const customers = new Customers(database);
  const customerService = new CustomerService(customers);

  const actions = new Actions(database);
  const actionService = new ActionService(actions);

  const sanitizedData = await applyCreateBeforeRules(
    reqData,
    accountability,
    "custom.actions"
  );
  const customer = customerService.getCustomerByID(customerID, [`id`]);
  if (customer.length === 0) {
    return { success: false };
  }
  const data = {
    ...sanitizedData,
    customer_id: customerID,
  };
  await actionService.addAction(data);
  return { success: true };
}

module.exports = {
  addAction,
};
