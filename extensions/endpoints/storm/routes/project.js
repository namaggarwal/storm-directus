const { PROJECT_RETURNING_COLUMNS } = require("../utils/constants");

const ProjectService = require("../services/ProjectService");
const Projects = require("../models/Projects");

const {
  applyCreateBeforeRules,
  applyUpdateBeforeRules,
} = require("../utils/hooks");

async function createProject({ database, accountability }, req) {
  const reqData = req.body;
  const projects = new Projects(database);
  const projectService = new ProjectService(projects);

  const sanitizedData = await applyCreateBeforeRules(
    reqData,
    accountability,
    "custom.projects"
  );
  const inseredIDs = await projectService.addNewProject(sanitizedData);
  const projectData = await projectService.getProjectByID(
    inseredIDs[0],
    PROJECT_RETURNING_COLUMNS
  );
  return { data: projectData, success: true };
}

async function getProjectByID({ database }, req) {
  const projectID = parseInt(req.params.id, 10);
  const projects = new Projects(database);
  const projectService = new ProjectService(projects);
  const projectData = await projectService.getProjectByID(projectID);
  return { success: true, data: projectData };
}

async function editProject({ database, accountability }, req) {
  const projectID = parseInt(req.params.id, 10);
  const reqData = req.body;
  const projects = new Projects(database);
  const projectService = new ProjectService(projects);
  const sanitizedData = await applyUpdateBeforeRules(
    reqData,
    accountability,
    "custom.projects",
    null
  );
  const currData = await projectService.getProjectByID(projectID);
  await projectService.updateProject(projectID, sanitizedData, currData);
  const projectData = await projectService.getProjectByID(projectID);
  return { success: true, data: projectData };
}

async function deleteProjectByID({ database }, req) {
  const projectID = parseInt(req.params.id, 10);
  const projects = new Projects(database);
  const projectService = new ProjectService(projects);

  const data = await projectService.deleteProjectByID(projectID);
  if (data === 1) {
    return { success: true };
  }
  return { success: false };
}

async function getAllProjects({ database }, req) {
  const projects = new Projects(database);
  const projectService = new ProjectService(projects);
  const columns = req.query.cols;
  const columnList =
    (columns && columns.split(",")) || PROJECT_RETURNING_COLUMNS;
  const data = await projectService.getAllProjects(columnList);
  return { data, success: true };
}

module.exports = {
  createProject,
  getProjectByID,
  editProject,
  deleteProjectByID,
  getAllProjects,
};
