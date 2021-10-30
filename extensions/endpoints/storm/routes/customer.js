const CustomerService = require("../services/CustomerService");
const Customers = require("../models/Customers");
const { CUSTOMER_TYPE } = require("../utils/constants");

module.exports = {
  getCustomers: async (database, customerType) => {
    const customers = new Customers(database);
    const customerService = new CustomerService(customers);
    const data = await customerService.getCustomersByType(
      CUSTOMER_TYPE[customerType.toUpperCase()]
    );
    return data;
  },
};
