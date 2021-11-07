const CUSTOMER_TYPE = {
  SUSPECT: 1,
  PROSPECT: 2,
  CLIENT: 3,
};

const PROJECTS_TABLE_NAME = "projects";

const PROJECT_RETURNING_COLUMNS = [
  `${PROJECTS_TABLE_NAME}.id`,
  `${PROJECTS_TABLE_NAME}.name`,
  `${PROJECTS_TABLE_NAME}.min_area`,
  `${PROJECTS_TABLE_NAME}.min_budget`,
  `${PROJECTS_TABLE_NAME}.max_budget`,
  `${PROJECTS_TABLE_NAME}.address_1`,
  `${PROJECTS_TABLE_NAME}.address_2`,
  `${PROJECTS_TABLE_NAME}.address_3`,
  `${PROJECTS_TABLE_NAME}.within`,
  `${PROJECTS_TABLE_NAME}.goal`,
  `${PROJECTS_TABLE_NAME}.bank_seen`,
  `${PROJECTS_TABLE_NAME}.accession`,
  `${PROJECTS_TABLE_NAME}.comments`,
  `${PROJECTS_TABLE_NAME}.last_updated`,
  `${PROJECTS_TABLE_NAME}.created_on`,
];


module.exports = {
  CUSTOMER_TYPE,
  PROJECT_RETURNING_COLUMNS,
};