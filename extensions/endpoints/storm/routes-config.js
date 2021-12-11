const { getDashboard } = require("./routes/dashboard");
const {
  getCustomers,
  createCustomer,
  editCustomer,
  getCustomerByID,
  deleteCustomerById,
} = require("./routes/customer");
const {
  createProject,
  getProjectByID,
  editProject,
  deleteProjectByID,
  getAllProjects,
} = require("./routes/project");
const { getCurrentUser } = require("./routes/user");
const { getTypes, getCustomLinks } = require("./routes/misc");
const { addAction } = require("./routes/actions");

module.exports = [
  {
    path: "/me",
    method: "GET",
    component: getCurrentUser,
  },

  /// Dashboard ////
  {
    path: "/dashboard",
    method: "GET",
    component: getDashboard,
  },
  /// Customer ////
  {
    path: "/customers",
    method: "POST",
    component: createCustomer,
  },
  {
    path: "/customers",
    method: "GET",
    component: getCustomers,
  },
  {
    path: "/customers/:id",
    method: "GET",
    component: getCustomerByID,
  },
  {
    path: "/customers/:id",
    method: "PATCH",
    component: editCustomer,
  },
  {
    path: "/customers/:id",
    method: "DELETE",
    component: deleteCustomerById,
  },
  /// Projects ////
  {
    path: "/projects",
    method: "POST",
    component: createProject,
  },
  {
    path: "/projects",
    method: "GET",
    component: getAllProjects,
  },
  {
    path: "/projects/:id",
    method: "GET",
    component: getProjectByID,
  },
  {
    path: "/projects/:id",
    method: "PATCH",
    component: editProject,
  },
  {
    path: "/projects/:id",
    method: "DELETE",
    component: deleteProjectByID,
  },
  /// Actions ////
  {
    path: "/customers/:id/actions",
    method: "POST",
    component: addAction,
  },
  /// Types ////
  {
    path: "/types",
    method: "GET",
    component: getTypes,
  },
  /// Custom Links ///
  {
    path: "/links",
    method: "GET",
    component: getCustomLinks,
  }
];
