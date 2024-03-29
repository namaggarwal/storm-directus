const {
  CUSTOMER_ALL_COLUMNS
} = require("../utils/constants");

function Customers(database) {
  const TABLE_NAME = "customers";
  const CUSTOMER_SOURCE_TABLE_NAME = "customer_source";
  const CUSTOMER_PROJECTS_TABLE_NAME = "customer_projects";

  const USERS_COL = ["first_name", "last_name", "avatar"];

  const CUSTOMER_MANY_CONF = [
    {
      key: "projects",
      junction_table_name: CUSTOMER_PROJECTS_TABLE_NAME,
      junction_table_alias: "cp",
      customer_column_name: "customer_id",
      field_column_name: "project_id",
    },
  ];

  function getColumnAlias(colList, tableAlias, prefix) {
    return colList.map((val) => `${tableAlias}.${val} as ${prefix}_${val}`);
  }

  function addUserColumns(query) {
    return query
      .innerJoin("directus_users as cu", `${TABLE_NAME}.user_created`, "cu.id")
      .innerJoin("directus_users as uu", `${TABLE_NAME}.user_updated`, "uu.id")
      .innerJoin("directus_users as ui", `${TABLE_NAME}.user_incharge`, "ui.id")
      .select([
        ...getColumnAlias(USERS_COL, "cu", "created"),
        ...getColumnAlias(USERS_COL, "uu", "updated"),
        ...getColumnAlias(USERS_COL, "ui", "incharge"),
      ]);
  }

  function addManyColumns(query) {
    CUSTOMER_MANY_CONF.forEach((colData) => {
      query = query
        .leftJoin(
          `${colData.junction_table_name} as ${colData.junction_table_alias}`,
          `${TABLE_NAME}.id`,
          `${colData.junction_table_alias}.${colData.customer_column_name}`
        )
        .select([
          database.raw(
            `GROUP_CONCAT(distinct ${colData.junction_table_alias}.${colData.field_column_name}) as ${colData.key}`
          ),
        ]);
    });

    return query;
  }

  function addLastActionColumn(query) {
    return query
      .leftJoin("customer_actions as ca", `${TABLE_NAME}.id`, "ca.customer_id")
      .select([
        database.raw(
          'SUBSTRING_INDEX(GROUP_CONCAT(distinct ca.action_type order by ca.created_on desc),",",1) as last_action'
        ),
        database.raw("MAX(ca.created_on) as last_action_date"),
      ])
      .groupBy(`${TABLE_NAME}.id`);
  }

  function getCustomersQuery(cols) {
    let query = database(TABLE_NAME).select(cols ? cols : [...CUSTOMER_ALL_COLUMNS]);

    query = addUserColumns(query);
    query = addManyColumns(query);
    query = addLastActionColumn(query);

    return query;
  }

  function addCustomerUserCondition(query, user) {
    if(!user) {
      return query;
    }
    return query.where({
      user_incharge: user,
    });
  }

  this.getCustomersByType = async function (type, user, cols) {
    let query = getCustomersQuery(cols);
    query = addCustomerUserCondition(query, user);
    return query.where({
      [`${TABLE_NAME}.type`]: type,
      [`${TABLE_NAME}.status`]: 0,
    });
  };

  this.createNewCustomer = async function (data) {
    const { projects } = data;
    delete data["projects"];
    return database.transaction(async (trx) => {
      const ids = await trx(TABLE_NAME).insert(data, "id");
      if (Array.isArray(projects) && projects.length > 0) {
        const customerProjectData = projects.map((project) => ({
          customer_id: ids[0],
          project_id: project,
        }));
        await trx(CUSTOMER_PROJECTS_TABLE_NAME).insert(customerProjectData);
      }
      return ids;
    });
  };

  this.getCustomerByID = async function (id) {
    let query = getCustomersQuery();
    return query.where(`${TABLE_NAME}.id`, id);
  };

  this.getCustomerCountByType = async function (user) {
    let query = database(TABLE_NAME)
      .select(database.raw("count(*) as count, type"))
      .where({ status: 0 })
      .groupBy("type");

      return addCustomerUserCondition(query, user);
  };

  this.changeStatus = async function (id, status) {
    return database(TABLE_NAME).where("id", "=", id).update({
      status,
    });
  };

  this.updateCustomerById = async function (
    id,
    data,
    newProjects,
    deleteProjects
  ) {
    return database.transaction(async (trx) => {
      await trx(TABLE_NAME)
        .where("id", "=", id)
        .update({
          ...data,
        });
      if (newProjects.length > 0) {
        const customerProjectData = newProjects.map((project) => ({
          customer_id: id,
          project_id: project,
        }));
        await trx(CUSTOMER_PROJECTS_TABLE_NAME).insert(customerProjectData);
      }
      if (deleteProjects.length > 0) {
        await trx(CUSTOMER_PROJECTS_TABLE_NAME)
          .delete()
          .where("customer_id", id)
          .whereIn("project_id", deleteProjects);
      }
    });
  };

  this.getAllCustomerSource = async function () {
    return database(CUSTOMER_SOURCE_TABLE_NAME)
      .select([`title`, `value`])
      .orderBy("value");
  };
}

module.exports = Customers;
