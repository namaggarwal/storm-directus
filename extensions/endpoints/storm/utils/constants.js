const CUSTOMER_TYPE = {
  SUSPECT: 1,
  PROSPECT: 2,
  CLIENT: 3,
};

const PROJECTS_TABLE_NAME = "projects";
const CUSTOMER_TABLE_NAME = "customers";

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

const CUSTOMER_LIST_COLUMNS = [
  `${CUSTOMER_TABLE_NAME}.id`,
  `${CUSTOMER_TABLE_NAME}.name`,
  `${CUSTOMER_TABLE_NAME}.customer_source`,
  `${CUSTOMER_TABLE_NAME}.last_updated`,
  `${CUSTOMER_TABLE_NAME}.created_on`,
];

const CUSTOMER_CLIENT_LIST_COLUMNS = [
  `${CUSTOMER_TABLE_NAME}.id`,
  `${CUSTOMER_TABLE_NAME}.name`,
  `${CUSTOMER_TABLE_NAME}.customer_source`,
  `${CUSTOMER_TABLE_NAME}.last_updated`,
  `${CUSTOMER_TABLE_NAME}.created_on`,
];


const CUSTOMER_RETURNING_COLUMNS = [
  `${CUSTOMER_TABLE_NAME}.id`,
  `${CUSTOMER_TABLE_NAME}.type`,
  `${CUSTOMER_TABLE_NAME}.name`,
  `${CUSTOMER_TABLE_NAME}.name_additional`,
  `${CUSTOMER_TABLE_NAME}.phone`,
  `${CUSTOMER_TABLE_NAME}.phone_additional`,
  `${CUSTOMER_TABLE_NAME}.email`,
  `${CUSTOMER_TABLE_NAME}.email_additional`,
  `${CUSTOMER_TABLE_NAME}.profession`,
  `${CUSTOMER_TABLE_NAME}.profession_additional`,
  `${CUSTOMER_TABLE_NAME}.date_of_birth`,
  `${CUSTOMER_TABLE_NAME}.date_of_birth_additional`,
  `${CUSTOMER_TABLE_NAME}.place_of_birth`,
  `${CUSTOMER_TABLE_NAME}.place_of_birth_additional`,
  `${CUSTOMER_TABLE_NAME}.nationality`,
  `${CUSTOMER_TABLE_NAME}.nationality_additional`,
  `${CUSTOMER_TABLE_NAME}.postal_code`,
  `${CUSTOMER_TABLE_NAME}.customer_source`,
  `${CUSTOMER_TABLE_NAME}.address_of_buyers`,
  `${CUSTOMER_TABLE_NAME}.last_updated`,
  `${CUSTOMER_TABLE_NAME}.created_on`,
];

const CUSTOMER_ALL_COLUMNS = [
  ...CUSTOMER_RETURNING_COLUMNS,
  // Additional client columns
  `${CUSTOMER_TABLE_NAME}.vendor_name`,
  `${CUSTOMER_TABLE_NAME}.vendor_phone`,
  `${CUSTOMER_TABLE_NAME}.vendor_email`,
  `${CUSTOMER_TABLE_NAME}.vendor_date_of_birth`,
  `${CUSTOMER_TABLE_NAME}.vendor_place_of_birth`,
  `${CUSTOMER_TABLE_NAME}.vendor_nationality`,
  `${CUSTOMER_TABLE_NAME}.vendor_name_additional`,
  `${CUSTOMER_TABLE_NAME}.vendor_phone_additional`,
  `${CUSTOMER_TABLE_NAME}.vendor_email_additional`,
  `${CUSTOMER_TABLE_NAME}.vendor_date_of_birth_additional`,
  `${CUSTOMER_TABLE_NAME}.vendor_place_of_birth_additional`,
  `${CUSTOMER_TABLE_NAME}.vendor_nationality_additional`,
  `${CUSTOMER_TABLE_NAME}.vendor_profession`,
  `${CUSTOMER_TABLE_NAME}.vendor_profession_additional`,
  `${CUSTOMER_TABLE_NAME}.vendor_address`,
  `${CUSTOMER_TABLE_NAME}.vendor_property_address`,
  `${CUSTOMER_TABLE_NAME}.notary_seller_name`,
  `${CUSTOMER_TABLE_NAME}.notary_seller_phone`,
  `${CUSTOMER_TABLE_NAME}.notary_seller_email`,
  `${CUSTOMER_TABLE_NAME}.notary_buyer_name`,
  `${CUSTOMER_TABLE_NAME}.notary_buyer_phone`,
  `${CUSTOMER_TABLE_NAME}.notary_buyer_email`,
  `${CUSTOMER_TABLE_NAME}.marital_status`,
  `${CUSTOMER_TABLE_NAME}.marital_status_additional`,
  `${CUSTOMER_TABLE_NAME}.date_of_compromise`,
  `${CUSTOMER_TABLE_NAME}.dia_end_date`,
  `${CUSTOMER_TABLE_NAME}.date_of_act`,
  `${CUSTOMER_TABLE_NAME}.trustee_contact`,
  `${CUSTOMER_TABLE_NAME}.joint_property`,
  `${CUSTOMER_TABLE_NAME}.net_selling_price`,
  `${CUSTOMER_TABLE_NAME}.hai_sale_price`,
  `${CUSTOMER_TABLE_NAME}.security_deposit`,
  `${CUSTOMER_TABLE_NAME}.lots_sold`,
  `${CUSTOMER_TABLE_NAME}.coownership_lots`,
  `${CUSTOMER_TABLE_NAME}.condominium_fees`,
  `${CUSTOMER_TABLE_NAME}.total_funding_amount`,
  `${CUSTOMER_TABLE_NAME}.funds_source`,
  `${CUSTOMER_TABLE_NAME}.suspensive_conditions`,
  `${CUSTOMER_TABLE_NAME}.project_contribution`,
  `${CUSTOMER_TABLE_NAME}.mandate`,
  `${CUSTOMER_TABLE_NAME}.agency_fees`,
  `${CUSTOMER_TABLE_NAME}.procedure_progress`,
  `${CUSTOMER_TABLE_NAME}.property_use`,
  `${CUSTOMER_TABLE_NAME}.purchase_type`,
  `${CUSTOMER_TABLE_NAME}.name_of_bank`,
  `${CUSTOMER_TABLE_NAME}.loan_term`,
  `${CUSTOMER_TABLE_NAME}.loan_rate`,
  `${CUSTOMER_TABLE_NAME}.loan_amount`,
  `${CUSTOMER_TABLE_NAME}.bank_email`,
  `${CUSTOMER_TABLE_NAME}.bank_phone`,
  `${CUSTOMER_TABLE_NAME}.bank_deposit_date`,
  `${CUSTOMER_TABLE_NAME}.loan_agreement_date`,
  `${CUSTOMER_TABLE_NAME}.loan_acceptance_date`,
  `${CUSTOMER_TABLE_NAME}.agency_ttc`,
  `${CUSTOMER_TABLE_NAME}.fees_vat`,
  `${CUSTOMER_TABLE_NAME}.fees_rate`,
  `${CUSTOMER_TABLE_NAME}.interagency`,
  `${CUSTOMER_TABLE_NAME}.interagency_name`,
  `${CUSTOMER_TABLE_NAME}.hono_interagency`,
  `${CUSTOMER_TABLE_NAME}.missing_parts_file`,
  `${CUSTOMER_TABLE_NAME}.last_step`,
  `${CUSTOMER_TABLE_NAME}.observations`,
];

module.exports = {
  CUSTOMER_TYPE,
  PROJECT_RETURNING_COLUMNS,
  CUSTOMER_RETURNING_COLUMNS,
  CUSTOMER_ALL_COLUMNS,
  CUSTOMER_LIST_COLUMNS,
  CUSTOMER_CLIENT_LIST_COLUMNS,
};
