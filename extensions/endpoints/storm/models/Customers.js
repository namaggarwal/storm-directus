module.exports =  function Customers(database) {
  const TABLE_NAME = 'customers';
  const USERS_COL = [
    'first_name',
    'last_name',
    'avatar',
  ];

  const CUSTOMER_COLUMNS = [
    `${TABLE_NAME}.id`,
    `${TABLE_NAME}.type`,
    `${TABLE_NAME}.name`,
    `${TABLE_NAME}.phone`,
    `${TABLE_NAME}.email`,
    `${TABLE_NAME}.last_updated`,
    `${TABLE_NAME}.created_on`
  ];

  function getUserColumnAlias(tableAlias, prefix) {
    return USERS_COL.map((val) => `${tableAlias}.${val} as ${prefix}_${val}`);
  }

  this.getCustomersByType = async function(type) {
    return database(TABLE_NAME)
    .innerJoin('directus_users as cu', `${TABLE_NAME}.user_created`, 'cu.id' )
    .innerJoin('directus_users as uu', `${TABLE_NAME}.user_updated`, 'uu.id' )
    .innerJoin('directus_users as ui', `${TABLE_NAME}.user_incharge`, 'ui.id' )
    .select([...CUSTOMER_COLUMNS, ...getUserColumnAlias('cu','created'), ...getUserColumnAlias('uu', 'updated'), ...getUserColumnAlias('ui', 'incharge')])
    .where({
      [`${TABLE_NAME}.type`]: type,
      [`${TABLE_NAME}.status`]: 0,
    });
  }

  this.createNewCustomer = async function(data) {
    return database(TABLE_NAME).insert(data);
  }

  this.getCustomerByID = async function(id, returningColumns) {
    return database(TABLE_NAME).where('id', id).select(returningColumns);
  }

  this.getCustomerByIDWithUserInfo = async function(id) {
    return database(TABLE_NAME)
    .innerJoin('directus_users as cu', `${TABLE_NAME}.user_created`, 'cu.id' )
    .innerJoin('directus_users as uu', `${TABLE_NAME}.user_updated`, 'uu.id' )
    .innerJoin('directus_users as ui', `${TABLE_NAME}.user_incharge`, 'ui.id' )
    .select([...CUSTOMER_COLUMNS, ...getUserColumnAlias('cu','created'), ...getUserColumnAlias('uu', 'updated'), ...getUserColumnAlias('ui', 'incharge')])
    .where(`${TABLE_NAME}.id`, id);
  }

  this.getCustomerCountByType = async function() {
    return database(TABLE_NAME).select(database.raw('count(*) as count, type')).where({status: 0}).groupBy('type');
  }

  this.changeStatus = async function(id, status) {
    return database(TABLE_NAME).where('id', '=', id).update({
      status,
    });
  }
}