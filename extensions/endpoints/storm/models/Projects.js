module.exports =  function Projects(database) {
  const TABLE_NAME = 'projects';
  const GOAL_TABLE_NAME = 'goal';
  const WITHIN_TABLE_NAME = 'within';

  this.getAllProjectsByColAndStatus = async function(cols, status) {
    return database(TABLE_NAME)
    .where({status: status})
    .select(cols);
  }

  this.getProjectsCount = async function() {
    return database(TABLE_NAME)
    .select(database.raw('count(*) as Projects' ));
  }

  this.changeProjectStatus = async function(id, status)  {
    return database(TABLE_NAME).where('id', '=', id).update({
      status,
    });
  }

  this.getAllGoal = async function() {
    return database(GOAL_TABLE_NAME).select([`title`, `value`]).orderBy('value');
  }

  this.getAllWithin = async function() {
    return database(WITHIN_TABLE_NAME).select([`title`, `value`]).orderBy('value');
  }

}