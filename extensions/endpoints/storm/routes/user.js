async function getCurrentUser({ database, accountability, schema, services }) {
  const service = new services.UsersService({
    accountability: accountability,
    schema: schema,
    knex: database,
  });

  const item = await service.readOne(accountability.user);
  return { data: { ...item, is_admin: accountability.admin } || null };
}

module.exports = {
  getCurrentUser,
};
