const { PROJECT_RETURNING_COLUMNS } = require("../utils/constants");

const ProjectService = require("../services/ProjectService");
const Projects = require("../models/Projects");

const { applyCreateBeforeRules, applyUpdateBeforeRules } = require("../utils/hooks");

async function createProject({ database, accountability }, reqData) {
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
  return projectData[0];
}

async function getProjectByID({ database }, projectID) {
  const projects = new Projects(database);
  const projectService = new ProjectService(projects);
  const projectData = await projectService.getProjectByID(projectID);
  return { success: true, data: projectData };
}

async function editProject({database, accountability}, projectID, reqData) {
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

module.exports = {
  createProject,
  getProjectByID,
  editProject,
};