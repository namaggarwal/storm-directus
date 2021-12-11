const CustomerService = require("../services/CustomerService");
const Customers = require("../models/Customers");
const ProjectService = require("../services/ProjectService");
const Projects = require("../models/Projects");
const Actions = require("../models/Actions");
const ActionService = require("../services/ActionService");
const Misc = require("../models/Misc");
const MiscService = require("../services/MiscService");

async function getTypes({ database }) {
  const actions = new Actions(database);
  const actionService = new ActionService(actions);

  const customers = new Customers(database);
  const customerService = new CustomerService(customers);

  const projects = new Projects(database);
  const projectService = new ProjectService(projects);

  const [actionList, customer_sources, goal, within, kind, typology] =
    await Promise.all([
      actionService.getAllActions(),
      customerService.getAllCustomerSources(),
      projectService.getAllGoal(),
      projectService.getAllWithin(),
      projectService.getAllKind(),
      projectService.getAllTypology(),
    ]);
  return {
    success: true,
    data: {
      actions: actionList,
      customer_sources,
      goal,
      within,
      kind,
      typology,
    },
  };
}

async function getCustomLinks({ database }) {
  const misc = new Misc(database);
  const miscService = new MiscService(misc);
  const data = await miscService.getCustomLinks();
  return {
    success: true,
    data,
  };
}

module.exports = {
  getTypes,
  getCustomLinks,
};
