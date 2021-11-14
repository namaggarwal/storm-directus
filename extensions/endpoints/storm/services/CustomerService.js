

module.exports = function CustomerService(customerModel) {

  const CUSTOMER_TYPES = ['Suspect', 'Prospect', 'Client'];

  const CUSTOMER_STATUS = {
    'ACTIVE': 0,
    'DELETED': 1,
    'ARCHIVED': 2,
  };

  this.getCustomersByType = async function(type) {
    return customerModel.getCustomersByType(type);
  }

  this.getCustomerByID = async function(id) {
    return customerModel.getCustomerByID(id);
  }

  this.addNewCustomer = async function(data) {
    return customerModel.createNewCustomer(data);
  }

  this.getCustomerCountByType = async function() {
    const data = await customerModel.getCustomerCountByType();
    const typeCount = CUSTOMER_TYPES.reduce((prev, val) => ({...prev, [val]:0}), {});
    data.forEach(val => {
      typeCount[CUSTOMER_TYPES[val["type"]-1]] = val["count"];
    });
    return typeCount;
  }

  this.changeCustomerStatus = async function(id, status) {
    const data = await customerModel.changeStatus(id, status);
    return data;
  }

  this.updateCustomerById = async function(id, data, newProjects, deleteProjects) {
    delete data.projects;
    return await customerModel.updateCustomerById(id, data, newProjects, deleteProjects);
  }

  this.deleteCustomerById = async function(id) {
    return await this.changeCustomerStatus(id, CUSTOMER_STATUS.DELETED);
  }

  this.getAllCustomerSources = async function() {
    const sources = await customerModel.getAllCustomerSource();
    return sources.map((source) => ([source.title, source.value]));
  }
}