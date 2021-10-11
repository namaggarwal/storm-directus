module.exports =  function Customers(database) {
  const TABLE_NAME = 'customers';
  const CUSTOMER_SOURCE_TABLE_NAME = 'customer_source';
  const CUSTOMER_PROJECTS_TABLE_NAME = 'customer_projects';

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
    `${TABLE_NAME}.customer_source`,
    `${TABLE_NAME}.last_updated`,
    `${TABLE_NAME}.created_on`
  ];

  function getColumnAlias(colList, tableAlias, prefix) {
    return colList.map((val) => `${tableAlias}.${val} as ${prefix}_${val}`);
  }

  this.getCustomersByType = async function(type) {
    return database(TABLE_NAME)
    .innerJoin('directus_users as cu', `${TABLE_NAME}.user_created`, 'cu.id' )
    .innerJoin('directus_users as uu', `${TABLE_NAME}.user_updated`, 'uu.id' )
    .innerJoin('directus_users as ui', `${TABLE_NAME}.user_incharge`, 'ui.id' )
    .leftJoin('customer_projects as cp', `${TABLE_NAME}.id`, 'cp.customer_id' )
    .select([
      ...CUSTOMER_COLUMNS,
      ...getColumnAlias(USERS_COL, 'cu','created'),
      ...getColumnAlias(USERS_COL, 'uu', 'updated'),
      ...getColumnAlias(USERS_COL, 'ui', 'incharge'),
      database.raw('GROUP_CONCAT(cp.project_id order by cp.created_on desc) as project_ids'),
    ])
    .where({
      [`${TABLE_NAME}.type`]: type,
      [`${TABLE_NAME}.status`]: 0,
    })
    .groupBy(`${TABLE_NAME}.id`);
  }

  this.createNewCustomer = async function(data) {
    const { projects } = data;
    delete data['projects'];
    return database.transaction(async trx => {
      const ids = await trx(TABLE_NAME).insert(data, 'id');
      const customerProjectData = projects.map((project) => ({customer_id: ids[0], project_id: project}));
      await trx(CUSTOMER_PROJECTS_TABLE_NAME).insert(customerProjectData);
      return ids;
    });
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

  this.getAllCustomerSource = async function() {
    return database(CUSTOMER_SOURCE_TABLE_NAME).select([`title`, `value`]).orderBy('value');
  }
}