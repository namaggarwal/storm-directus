const CustomerService = require("../services/CustomerService");
const Customers = require("../models/Customers");
const { CUSTOMER_TYPE } = require("../utils/constants");
const {
  applyCreateBeforeRules,
  applyUpdateBeforeRules,
} = require("../utils/hooks");

async function getCustomers({ database, accountability }, customerType) {
  const userIncharge = accountability.admin ? null : accountability.user;
  const customers = new Customers(database);
  const customerService = new CustomerService(customers);
  const data = await customerService.getCustomersByType(
    customerType,
    userIncharge
  );
  return data;
}

async function createCustomer({ database, accountability }, reqData) {
  const customers = new Customers(database);
  const customerService = new CustomerService(customers);
  const sanitizedData = await applyCreateBeforeRules(
    reqData,
    accountability,
    "custom.customers"
  );
  const insertedIDs = await customerService.addNewCustomer(sanitizedData);
  const customerData = await customerService.getCustomerByID(
    insertedIDs[0]
  );
  return customerData[0];
}

async function getCustomerByID({database}, customerID) {
  const customers = new Customers(database);
  const customerService = new CustomerService(customers);
  const data = await customerService
    .getCustomerByID(customerID);
  return { data: data[0], success: true };
}

async function editCustomer({ database, accountability }, customerID, reqData) {
  const customers = new Customers(database);
  const customerService = new CustomerService(customers);
  const customerInfo = await customerService.getCustomerByID(
    customerID
  );
  if (customerInfo == null || customerInfo.length != 1) {
    throw new Error("Customer not found");
  }
  const existingData = customerInfo[0];
  const sanitizedData = await applyUpdateBeforeRules(
    reqData,
    accountability,
    "custom.customers",
    existingData
  );
  let newProjects = [];
  let deleteProjects = [];
  if(sanitizedData.hasOwnProperty('projects')){
    const existingProjects = existingData.project_ids ? existingData.project_ids.split(',').map(i=>parseInt(i,10)) : [];
    const updatedProjects = sanitizedData.projects ? sanitizedData.projects : [];
    newProjects = updatedProjects.filter((i) => !existingProjects.includes(i));
    deleteProjects = existingProjects.filter((i) => !updatedProjects.includes(i));
  }
  await customerService.updateCustomerById(customerID, sanitizedData, newProjects, deleteProjects);
  const updatedData = await customerService.getCustomerByID(
    customerID
  );
  return updatedData[0];
}

module.exports = {
  getCustomerByID,
  getCustomers,
  createCustomer,
  editCustomer,
};
