const CustomerService = require("./services/CustomerService");
const Customers = require("./models/Customers");

const ProjectService = require("./services/ProjectService");
const Projects = require("./models/Projects");
const setUserHook = require("../../hooks/setuser");
const sanitizeInputHook = require("../../hooks/sanitizeValues");
const Actions = require("./models/Actions");
const ActionService = require("./services/ActionService");

const { getDashboard } = require("./routes/dashboard");
const {
  getCustomers,
  createCustomer,
  editCustomer,
  getCustomerByID,
} = require("./routes/customer");

const {
  createProject, getProjectByID, editProject,
} = require("./routes/project");

const { getTypes } = require("./routes/misc");

const beforeCreateHooks = [
  sanitizeInputHook()["items.create.before"],
  setUserHook()["items.create.before"],
];

const beforeUpdateHooks = [
  sanitizeInputHook()["items.update.before"],
  setUserHook()["items.update.before"],
];

async function applyCreateBeforeRules(input, accountability, collection) {
  for (i in beforeCreateHooks) {
    input = await beforeCreateHooks[i](input, { accountability, collection });
  }
  return input;
}

async function applyUpdateBeforeRules(input, accountability, collection) {
  for (i in beforeUpdateHooks) {
    input = await beforeUpdateHooks[i](input, { accountability, collection });
  }
  return input;
}

const CUSTOMER_RETURNING_COLUMNS = [
  "id",
  "name",
  "phone",
  "email",
  "nationality",
  "date_of_birth",
  "place_of_birth",
  "nationality",
  "type",
  "created_on",
  "last_updated",
  "user_created",
  "user_updated",
  "user_incharge",
  "status",
];

const CUSTOMER_DETAIL_RETURNING_COLUMNS = [
  ...CUSTOMER_RETURNING_COLUMNS,
  "name_additional",
  "phone_additional",
  "email_additional",
  "nationality_additional",
  "date_of_birth_additional",
  "place_of_birth_additional",
  "postal_code",
  "customer_source",
  "address_of_buyers",
];

const PROJECT_RETURNING_COLUMNS = [
  "id",
  "name",
  "min_area",
  "min_budget",
  "max_budget",
  "address_1",
  "address_2",
  "address_3",
  "within",
  "goal",
  "bank_seen",
  "accession",
  "comments",
  "last_updated",
  "created_on",
];

module.exports = function registerEndpoint(
  router,
  { services, exceptions, database }
) {
  router.get("/dashboard", (req, res, next) => {
    const { accountability } = req;
    const { ServiceUnavailableException } = exceptions;

    getDashboard({ database, accountability }).then((data) => {
      res.send(data);
    });
  });

  router.get("/customers", (req, res, next) => {
    const { accountability } = req;
    const { ServiceUnavailableException } = exceptions;

    const customerType = req.query.type ?? "SUSPECT";
    getCustomers({ database, accountability }, customerType)
      .then((data) => {
        res.send({ data, success: true });
      })
      .catch((error) => {
        console.error(error);
        return next(new ServiceUnavailableException(error.message));
      });
  });

  router.get("/customers/:id", (req, res, next) => {
    const { accountability } = req;
    const { ServiceUnavailableException } = exceptions;
    const customerID = req.params.id;
    getCustomerByID({database}, customerID)
      .then((data) => {
        res.send(data);
      }).catch((error) => {
        console.error(error);
        return next(new ServiceUnavailableException(error.message));
      });
  });

  router.post("/customers", (req, res, next) => {
    const { accountability } = req;
    const { ServiceUnavailableException } = exceptions;

    createCustomer({ database, accountability }, req.body)
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        console.error(error);
        return next(new ServiceUnavailableException(error.message));
      });
  });

  router.patch("/customers/:id", (req, res, next) => {
    const { accountability } = req;
    const customerID = req.params.id;
    const { ServiceUnavailableException } = exceptions;
    editCustomer({ database, accountability }, customerID, req.body)
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        console.error(error);
        return next(new ServiceUnavailableException(error.message));
      });
  });

  router.delete("/customers/:id", (req, res, next) => {
    const { accountability } = req;
    const { ServiceUnavailableException } = exceptions;
    const customerID = req.params.id;

    const customers = new Customers(database);
    const customerService = new CustomerService(customers);

    customerService.deleteCustomerById(customerID).then((data) => {
      if (data === 1) {
        res.send({ success: true });
        return;
      }
      res.send({ success: false });
    });
  });

  router.post("/customers/:id/actions", (req, res, next) => {
    const { accountability } = req;
    const customerID = req.params.id;
    const customers = new Customers(database);
    const customerService = new CustomerService(customers);

    const actions = new Actions(database);
    const actionService = new ActionService(actions);

    applyCreateBeforeRules(req.body, accountability, "custom.actions").then(
      (data) => {
        customerService.getCustomerByID(customerID, [`id`]).then((customer) => {
          if (customer.length === 0) {
            res.send({ success: false });
            return;
          }
          data = {
            ...data,
            customer_id: customerID,
          };
          actionService.addAction(data).then((action) => {
            res.send({ success: true });
          });
        });
      }
    );
  });

  router.post("/projects", (req, res, next) => {
    const { accountability } = req;
    const { ServiceUnavailableException } = exceptions;
    createProject({ database, accountability }, req.body)
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        console.error(error.message);
        return next(
          new ServiceUnavailableException("Unexpected error happened")
        );
      });
  });

  router.patch("/projects/:id", (req, res, next) => {
    const { accountability } = req;
    const projectID = parseInt(req.params.id, 10);
    const { ServiceUnavailableException } = exceptions;
    editProject({ database, accountability }, projectID, req.body)
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        console.error(error);
        return next(new ServiceUnavailableException(error.message));
      });
  });

  router.get("/projects/:id", (req, res, next) => {
    const { accountability } = req;
    const { ServiceUnavailableException } = exceptions;
    const projectID = req.params.id;
    getProjectByID({ database, accountability }, projectID)
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        console.error(error.message);
        return next(
          new ServiceUnavailableException("Unexpected error happened")
        );
      });
  });

  router.get("/projects", (req, res, next) => {
    const projects = new Projects(database);
    const projectService = new ProjectService(projects);
    const columns = req.query.cols;
    const columnList =
      (columns && columns.split(",")) || PROJECT_RETURNING_COLUMNS;
    projectService.getAllProjects(columnList).then((data) => {
      res.send({ data, success: true });
    });
  });

  router.delete("/projects/:id", (req, res, next) => {
    const { accountability } = req;
    const { ServiceUnavailableException } = exceptions;
    const projectID = req.params.id;

    const projects = new Projects(database);
    const projectService = new ProjectService(projects);

    projectService.deleteProjectByID(projectID).then((data) => {
      if (data === 1) {
        res.send({ success: true });
        return;
      }
      res.send({ success: false });
    });
  });

  router.get("/types", (req, res) => {
    getTypes({ database })
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        console.error(error);
        return next(new ServiceUnavailableException(error.message));
      });
  });
};
