const CustomerService = require("./services/CustomerService");
const Customers = require("./models/Customers");

const ProjectService = require("./services/ProjectService");
const Projects = require("./models/Projects");

const { getDashboard } = require("./routes/dashboard");
const {
  getCustomers,
  createCustomer,
  editCustomer,
  getCustomerByID,
} = require("./routes/customer");
const {
  createProject,
  getProjectByID,
  editProject,
} = require("./routes/project");
const { getCurrentUser } = require("./routes/user");
const { getTypes } = require("./routes/misc");
const { addAction } = require("./routes/actions");
const { CUSTOMER_TYPE } = require("./utils/constants");


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
  router.get("/me", (req, res, next) => {
    const { accountability, schema } = req;
    const { InvalidCredentialsException } = exceptions;
    if (!accountability?.user) {
      throw new InvalidCredentialsException();
    }
    getCurrentUser({ database, accountability, schema, services })
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        console.error(error);
        return next(new ServiceUnavailableException(error.message));
      });
  });

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

    getCustomers({ database, accountability }, req)
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
    getCustomerByID({ database }, req)
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        console.error(error);
        return next(new ServiceUnavailableException(error.message));
      });
  });

  router.post("/customers", (req, res, next) => {
    const { accountability } = req;
    const { ServiceUnavailableException } = exceptions;

    createCustomer({ database, accountability }, req)
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
    const { ServiceUnavailableException } = exceptions;
    editCustomer({ database, accountability }, req)
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
    const { ServiceUnavailableException } = exceptions;
    const customerID = req.params.id;
    addAction({ database, accountability }, customerID, req.body)
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
