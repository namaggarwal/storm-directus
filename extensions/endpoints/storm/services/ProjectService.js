module.exports = function ProjectService(projectModel) {

  const PROJECT_STATUS = {
    'ACTIVE': 0,
    'DELETED': 1,
    'ARCHIVED': 2,
  };

  this.getAllProjects = async function() {
    return projectModel.getAllProjectsByStatus(PROJECT_STATUS.ACTIVE);
  }

  this.getProjectsCount = async function() {
    const data = await projectModel.getProjectsCount();
    return data[0];
  }

  this.changeProjectStatus = async function(id, status) {
    return projectModel.changeProjectStatus(id, status);
  }

  this.deleteProjectByID = async function(id) {
    return this.changeProjectStatus(id, PROJECT_STATUS.DELETED);
  }
}