const CustomerService = require("../services/CustomerService");
const Customers = require("../models/Customers");

const ProjectService = require("../services/ProjectService");
const Projects = require("../models/Projects");

module.exports = {
  getDashboard: async (database) => {
    const customers = new Customers(database);
    const customerService = new CustomerService(customers);

    const projects = new Projects(database);
    const projectService = new ProjectService(projects);

    try {
      let data = await Promise.all([
        customerService.getCustomerCountByType(),
        projectService.getProjectsCount(),
      ]);

      data = data.reduce((prev, val) => ({ ...prev, ...val }), {});
      return { data, success: true };
    } catch (e) {
      console.log(e);
      return { success: false };
    }
  },
};
