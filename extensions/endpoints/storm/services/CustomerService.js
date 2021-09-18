

module.exports = function CustomerService(customerModel) {

  const CUSTOMER_TYPES = ['Suspect', 'Prospect', 'Client'];

  this.getCustomersByType = async function(type) {
    return customerModel.getCustomersByType(type);
  }

  this.getCustomerByID = async function(id, columns) {
    return customerModel.getCustomerByID(id, columns);
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

}