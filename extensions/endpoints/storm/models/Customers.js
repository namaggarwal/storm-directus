function Customers(database) {
  const TABLE_NAME = "customers";
  const CUSTOMER_SOURCE_TABLE_NAME = "customer_source";
  const CUSTOMER_PROJECTS_TABLE_NAME = "customer_projects";

  const USERS_COL = ["first_name", "last_name", "avatar"];

  const CUSTOMER_COLUMNS = [
    `${TABLE_NAME}.id`,
    `${TABLE_NAME}.type`,
    `${TABLE_NAME}.name`,
    `${TABLE_NAME}.name_additional`,
    `${TABLE_NAME}.phone`,
    `${TABLE_NAME}.phone_additional`,
    `${TABLE_NAME}.email`,
    `${TABLE_NAME}.email_additional`,
    `${TABLE_NAME}.profession`,
    `${TABLE_NAME}.profession_additional`,
    `${TABLE_NAME}.date_of_birth`,
    `${TABLE_NAME}.date_of_birth_additional`,
    `${TABLE_NAME}.place_of_birth`,
    `${TABLE_NAME}.place_of_birth_additional`,
    `${TABLE_NAME}.nationality`,
    `${TABLE_NAME}.nationality_additional`,
    `${TABLE_NAME}.postal_code`,
    `${TABLE_NAME}.customer_source`,
    `${TABLE_NAME}.address_of_buyers`,
    `${TABLE_NAME}.last_updated`,
    `${TABLE_NAME}.created_on`,

    // Additional client columns
    `${TABLE_NAME}.vendor_name`,
    `${TABLE_NAME}.vendor_phone`,
    `${TABLE_NAME}.vendor_email`,
    `${TABLE_NAME}.vendor_date_of_birth`,
    `${TABLE_NAME}.vendor_place_of_birth`,
    `${TABLE_NAME}.vendor_nationality`,
    `${TABLE_NAME}.vendor_name_additional`,
    `${TABLE_NAME}.vendor_phone_additional`,
    `${TABLE_NAME}.vendor_email_additional`,
    `${TABLE_NAME}.vendor_date_of_birth_additional`,
    `${TABLE_NAME}.vendor_place_of_birth_additional`,
    `${TABLE_NAME}.vendor_nationality_additional`,
    `${TABLE_NAME}.vendor_profession`,
    `${TABLE_NAME}.vendor_profession_additional`,
    `${TABLE_NAME}.vendor_address`,
    `${TABLE_NAME}.vendor_property_address`,
    `${TABLE_NAME}.notary_seller_name`,
    `${TABLE_NAME}.notary_seller_phone`,
    `${TABLE_NAME}.notary_seller_email`,
    `${TABLE_NAME}.notary_buyer_name`,
    `${TABLE_NAME}.notary_buyer_phone`,
    `${TABLE_NAME}.notary_buyer_email`,
    `${TABLE_NAME}.marital_status`,
    `${TABLE_NAME}.marital_status_additional`,
    `${TABLE_NAME}.date_of_compromise`,
    `${TABLE_NAME}.dia_end_date`,
    `${TABLE_NAME}.date_of_act`,
    `${TABLE_NAME}.trustee_contact`,
    `${TABLE_NAME}.joint_property`,
    `${TABLE_NAME}.net_selling_price`,
    `${TABLE_NAME}.hai_sale_price`,
    `${TABLE_NAME}.security_deposit`,
    `${TABLE_NAME}.lots_sold`,
    `${TABLE_NAME}.coownership_lots`,
    `${TABLE_NAME}.condominium_fees`,
    `${TABLE_NAME}.total_funding_amount`,
    `${TABLE_NAME}.funds_source`,
    `${TABLE_NAME}.suspensive_conditions`,
    `${TABLE_NAME}.project_contribution`,
    `${TABLE_NAME}.mandate`,
    `${TABLE_NAME}.agency_fees`,
    `${TABLE_NAME}.procedure_progress`,
    `${TABLE_NAME}.property_use`,
    `${TABLE_NAME}.purchase_type`,
    `${TABLE_NAME}.name_of_bank`,
    `${TABLE_NAME}.loan_term`,
    `${TABLE_NAME}.loan_rate`,
    `${TABLE_NAME}.loan_amount`,
    `${TABLE_NAME}.bank_email`,
    `${TABLE_NAME}.bank_phone`,
    `${TABLE_NAME}.bank_deposit_date`,
    `${TABLE_NAME}.loan_agreement_date`,
    `${TABLE_NAME}.loan_acceptance_date`,
  ];

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

  function getCustomersQuery() {
    let query = database(TABLE_NAME).select([...CUSTOMER_COLUMNS]);

    query = addUserColumns(query);
    query = addManyColumns(query);
    query = addLastActionColumn(query);

    return query;
  }

  this.getCustomersByType = async function (type) {
    let query = getCustomersQuery();
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

  this.getCustomerCountByType = async function () {
    return database(TABLE_NAME)
      .select(database.raw("count(*) as count, type"))
      .where({ status: 0 })
      .groupBy("type");
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
