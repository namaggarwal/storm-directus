module.exports = function ProjectService(projectModel) {
  this.getAllProjects = async function() {
    return projectModel.getAllProjects();
  }

  this.getProjectsCount = async function() {
    const data = await projectModel.getProjectsCount();
    return data[0];
  }
}