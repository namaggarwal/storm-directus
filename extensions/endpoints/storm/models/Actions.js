module.exports =  function Actions(database) {
  const TABLE_NAME = 'customer_actions';
  const ACTIONS_TABLE_NAME = 'actions';

  this.addAction = async function(data) {
    return database(TABLE_NAME).insert(data);
  }

  this.getAllActions = async function() {
    return database(ACTIONS_TABLE_NAME).select([`title`, `value`]).orderBy('value');
  }

}