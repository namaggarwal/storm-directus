const { PROJECT_RETURNING_COLUMNS } = require("../utils/constants");

module.exports = function Projects(database) {
  const TABLE_NAME = "projects";
  const GOAL_TABLE_NAME = "goal";
  const WITHIN_TABLE_NAME = "within";
  const KIND_TABLE_NAME = "kind";
  const TYPOLOGY_TABLE_NAME = "typology";
  const PROJECT_KIND_TABLE_NAME = "project_kind";
  const PROJECT_TYPOLOGY_TABLE_NAME = "project_typology";

  const PROJECT_MANY_CONF = [
    {
      key: "kinds",
      junction_table_name: PROJECT_KIND_TABLE_NAME,
      junction_table_alias: "pk",
      project_column_name: "project_id",
      field_column_name: "kind_id",
    },
    {
      key: "typologies",
      junction_table_name: PROJECT_TYPOLOGY_TABLE_NAME,
      junction_table_alias: "pt",
      project_column_name: "project_id",
      field_column_name: "typology_id",
    },
  ];

  function addManyColumns(
    query,
    columnKey,
    tableName,
    tableAlias,
    tableProjectColumnName,
    fieldColumnName
  ) {
    return query
      .leftJoin(
        `${tableName} as ${tableAlias}`,
        `${TABLE_NAME}.id`,
        `${tableAlias}.${tableProjectColumnName}`
      )
      .select([
        database.raw(
          `GROUP_CONCAT(distinct ${tableAlias}.${fieldColumnName}) as ${columnKey}`
        ),
      ]);
  }

  this.getAllProjectsByColAndStatus = async function (cols, status) {
    return database(TABLE_NAME).where({ status: status }).select(cols);
  };

  this.getProjectsCount = async function () {
    return database(TABLE_NAME).select(database.raw("count(*) as Projects"));
  };

  this.changeProjectStatus = async function (id, status) {
    return database(TABLE_NAME).where("id", "=", id).update({
      status,
    });
  };

  this.getAllGoal = async function () {
    return database(GOAL_TABLE_NAME)
      .select([`title`, `value`])
      .orderBy("value");
  };

  this.getAllWithin = async function () {
    return database(WITHIN_TABLE_NAME)
      .select([`title`, `value`])
      .orderBy("value");
  };

  this.addNewProject = async function (data) {
    const junctionFieldsData = PROJECT_MANY_CONF.map((field) => {
      field["data"] = data[field["key"]] || [];
      delete data[field["key"]];
      return field;
    });
    return database.transaction(async (trx) => {
      const ids = await trx(TABLE_NAME).insert(data);
      for (juncField of junctionFieldsData) {
        if (juncField.data.length > 0) {
          const fieldInsertData = juncField.data.map((d) => ({
            [juncField["project_column_name"]]: ids[0],
            [juncField["field_column_name"]]: d,
          }));
          await trx(juncField.junction_table_name).insert(fieldInsertData);
        }
      }
      return ids;
    });
  };

  this.updateProjectByID = async function (id, data, currData) {
    const junctionFieldsData = PROJECT_MANY_CONF.map((colData) => {
      const key = colData["key"];
      const existingCol = currData[key]
        ? currData[key].split(",").map((i) => parseInt(i, 10))
        : [];
      const updatedCol = data[key] ? data[key] : [];
      const newData = updatedCol.filter((i) => !existingCol.includes(i));
      const deleteData = existingCol.filter((i) => !updatedCol.includes(i));
      delete data[key];
      return {
        ...colData,
        newData,
        deleteData,
      };
    });
    return database.transaction(async (trx) => {
      for (juncField of junctionFieldsData) {
        if (juncField.newData.length > 0) {
          const fieldInsertData = juncField.newData.map((d) => ({
            [juncField["project_column_name"]]: id,
            [juncField["field_column_name"]]: d,
          }));
          await trx(juncField.junction_table_name).insert(fieldInsertData);
        }
        if (juncField.deleteData.length > 0) {
          await juncField.deleteData.forEach(async (d) => {
            const delOptions = {
              [juncField["project_column_name"]]: id,
              [juncField["field_column_name"]]: d,
            };
            await trx(juncField.junction_table_name)
              .where(delOptions)
              .del();
          });
        }
      }
      await trx(TABLE_NAME)
        .where("id", "=", id)
        .update({
          ...data,
        });
    });
  };

  this.getProjectByID = async function (id) {
    let query = database(TABLE_NAME)
      .where(`${TABLE_NAME}.id`, id)
      .select(PROJECT_RETURNING_COLUMNS);
    PROJECT_MANY_CONF.forEach((colData) => {
      query = addManyColumns(
        query,
        colData.key,
        colData.junction_table_name,
        colData.junction_table_alias,
        colData.project_column_name,
        colData.field_column_name
      );
    });
    return await query;
  };

  this.getAllKind = async function () {
    return database(KIND_TABLE_NAME)
      .select([`title`, `value`])
      .orderBy("value");
  };

  this.getAllTypology = async function () {
    return database(TYPOLOGY_TABLE_NAME)
      .select([`title`, `value`])
      .orderBy("value");
  };
};
