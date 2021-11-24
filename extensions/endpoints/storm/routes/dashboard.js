const CustomerService = require("../services/CustomerService");
const Customers = require("../models/Customers");

const ProjectService = require("../services/ProjectService");
const Projects = require("../models/Projects");

async function getDashboard ({database, accountability}) {
  const customers = new Customers(database);
  const customerService = new CustomerService(customers);

  const projects = new Projects(database);
  const projectService = new ProjectService(projects);

  const user = accountability.admin ? null : accountability.user;

  try {
    let data = await Promise.all([
      customerService.getCustomerCountByType(user),
      projectService.getProjectsCount(),
    ]);

    data = data.reduce((prev, val) => ({ ...prev, ...val }), {});
    return { data, success: true };
  } catch (e) {
    console.log(e);
    return { success: false };
  }
}

module.exports = {
  getDashboard,
};
