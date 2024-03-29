module.exports = function ProjectService(projectModel) {

  const PROJECT_STATUS = {
    'ACTIVE': 0,
    'DELETED': 1,
    'ARCHIVED': 2,
  };

  this.getAllProjects = async function(cols) {
    return projectModel.getAllProjectsByColAndStatus(cols, PROJECT_STATUS.ACTIVE);
  }

  this.addNewProject = async function(data) {
    return projectModel.addNewProject(data);
  }

  this.getProjectByID = async function(id) {
    const data = await projectModel.getProjectByID(id);
    return data[0];
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

  this.getAllGoal = async function() {
    const sources = await projectModel.getAllGoal();
    return sources.map((source) => ([source.title, source.value]));
  }

  this.getAllWithin = async function() {
    const sources = await projectModel.getAllWithin();
    return sources.map((source) => ([source.title, source.value]));
  }

  this.getAllKind = async function() {
    const sources = await projectModel.getAllKind();
    return sources.map((source) => ([source.title, source.value]));
  }

  this.getAllTypology = async function() {
    const sources = await projectModel.getAllTypology();
    return sources.map((source) => ([source.title, source.value]));
  }

  this.updateProject = async function(projectID, data, currData) {
    return projectModel.updateProjectByID(projectID, data, currData);
  }
}