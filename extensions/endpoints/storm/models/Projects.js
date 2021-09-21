module.exports =  function Projects(database) {
  const TABLE_NAME = 'projects';

  this.getAllProjects = async function() {
    return database(TABLE_NAME)
    .select();
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

}