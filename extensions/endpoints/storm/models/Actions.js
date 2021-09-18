module.exports =  function Actions(database) {
  const TABLE_NAME = 'customer_actions';

  this.addAction = async function(data) {
    return database(TABLE_NAME).insert(data);
  }

}