const CustomerService = require("../services/CustomerService");
const Customers = require("../models/Customers");
const { CUSTOMER_TYPE } = require("../utils/constants");
const { applyCreateBeforeRules } = require("../utils/hooks");

async function getCustomers({ database }, customerType) {
  const customers = new Customers(database);
  const customerService = new CustomerService(customers);
  const data = await customerService.getCustomersByType(
    CUSTOMER_TYPE[customerType.toUpperCase()]
  );
  return data;
}

async function createCustomer({ database, accountability }, reqData) {
  const customers = new Customers(database);
  const customerService = new CustomerService(customers);
  const sanitizedData = await applyCreateBeforeRules(reqData, accountability, "custom.customers");
  const insertedIDs = await customerService.addNewCustomer(sanitizedData);
  const customerData = await customerService.getCustomerByIDWithUserInfo(insertedIDs[0]);
  return customerData[0];
}

module.exports = {
  getCustomers,
  createCustomer,
};
