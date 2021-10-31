const CUSTOMER_TYPE = {
  SUSPECT: 1,
  PROSPECT: 2,
  CLIENT: 3,
};

const PROJECT_RETURNING_COLUMNS = [
  "id",
  "name",
  "min_area",
  "min_budget",
  "max_budget",
  "address_1",
  "address_2",
  "address_3",
  "within",
  "goal",
  "bank_seen",
  "accession",
  "comments",
  "last_updated",
  "created_on",
];


module.exports = {
  CUSTOMER_TYPE,
  PROJECT_RETURNING_COLUMNS,
};