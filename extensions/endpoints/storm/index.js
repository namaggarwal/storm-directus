const CustomerService = require('./services/CustomerService');
const Customers =  require('./models/Customers');

const ProjectService = require('./services/ProjectService');
const Projects =  require('./models/Projects');
const setUserHook = require('../../hooks/setuser');
const sanitizeInputHook = require('../../hooks/sanitizeValues');
const Actions =  require('./models/Actions');
const ActionService = require('./services/ActionService');

const beforeCreateHooks = [
  sanitizeInputHook()['items.create.before'],
  setUserHook()['items.create.before'],
];

async function applyCreateBeforeRules(input, accountability, collection) {
  for(i in beforeCreateHooks){
    input = await beforeCreateHooks[i](input, {accountability, collection});
  };
  return input;
}

const CUSTOMER_RETURNING_COLUMNS = [
  'id',
  'name',
	'phone',
	'email',
	'nationality',
	'date_of_birth',
	'place_of_birth',
	'nationality',
	'type',
  'created_on',
  'last_updated',
  'user_created',
  'user_updated',
  'user_incharge'
]

const CUSTOMER_TYPE = {
  'SUSPECT': 1,
  'PROSPECT': 2,
  'CLIENT': 3,
}

module.exports = function registerEndpoint(router, {services, exceptions, database}) {
  router.get('/dashboard', (req, res, next) => {
    const { accountability } = req;
    const {ServiceUnavailableException} = exceptions;
    const customers = new Customers(database);
    const customerService = new CustomerService(customers);

    const projects = new Projects(database);
    const projectService = new ProjectService(projects);

    Promise.all([customerService.getCustomerCountByType(), projectService.getProjectsCount()]).then((data => {
      data = data.reduce((prev, val) => ({...prev, ...val}), {});
      res.send({ data, success: true});
    })).catch(e => {
      console.log(e);
      res.send({success: false});
    })
  });
	router.get('/customers', (req, res, next) => {
    const { accountability } = req;
    const {ServiceUnavailableException} = exceptions;
    const customers = new Customers(database);
    const customerService = new CustomerService(customers);
    const customerType = req.query.type ?? 'SUSPECT';
    customerService.getCustomersByType(CUSTOMER_TYPE[customerType.toUpperCase()]).then((data => {
      res.send({data, success: true});
    }));
  });
  router.post('/customers', (req, res, next) => {
    const { accountability } = req;
    const {ServiceUnavailableException} = exceptions;
    const customers = new Customers(database);
    const customerService = new CustomerService(customers);
    applyCreateBeforeRules(req.body, accountability, 'custom.customers')
    .then((data) => {
      customerService.addNewCustomer(data).then((data => {
        customerService.getCustomerByID(data[0], CUSTOMER_RETURNING_COLUMNS).then((data) => {
          res.send(data[0]);
        });
      }))
      .catch((error) => {
        console.error(error.message);
        return next(new ServiceUnavailableException("Unexpected error happened"));
      })
    });
  });
  router.post('/customers/:id/actions', (req, res, next) => {
    const { accountability } = req;
    const customerID = req.params.id;
    const customers = new Customers(database);
    const customerService = new CustomerService(customers);

    const actions = new Actions(database);
    const actionService = new ActionService(actions);

    applyCreateBeforeRules(req.body, accountability, 'custom.actions')
    .then(data => {
      customerService.getCustomerByID(customerID, [`id`]).then((customer) => {
        if(customer.length === 0) {
          res.send({success: false});
          return;
        }
        data = {
          ...data,
          customer_id: customerID,
        };
        actionService.addAction(data).then((action) => {
          res.send({success: true});
        });
      });
    });

  });
  router.post('/projects', (req, res, next) => {
    console.log(req.json());
    res.send({success: true});
  });
};