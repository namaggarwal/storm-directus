const CustomerService = require("../services/CustomerService");
const Customers = require("../models/Customers");
const ProjectService = require("../services/ProjectService");
const Projects = require("../models/Projects");
const Actions = require("../models/Actions");
const ActionService = require("../services/ActionService");

async function getTypes({ database }) {
  const actions = new Actions(database);
  const actionService = new ActionService(actions);

  const customers = new Customers(database);
  const customerService = new CustomerService(customers);

  const projects = new Projects(database);
  const projectService = new ProjectService(projects);

  const [actionList, customer_sources, goal, within, kind] = await Promise.all([
    actionService.getAllActions(),
    customerService.getAllCustomerSources(),
    projectService.getAllGoal(),
    projectService.getAllWithin(),
    projectService.getAllKind(),
  ]);
  return {
    success: true,
    data: {
      actions: actionList,
      customer_sources,
      goal,
      within,
      kind,
    },
  };
}

module.exports = {
  getTypes,
};
