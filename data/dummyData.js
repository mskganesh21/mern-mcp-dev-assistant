const projectSummary = {
  projectName: "MCP MERN Demo",
  owner: "Engineering Team",
  status: "On Track",
  modulesCompleted: 4,
  blockers: 1,
  nextRelease: "2026-04-25",
};

const backendRoutes = [
  { method: "GET", path: "/api/projects", description: "Fetch all projects" },
  {
    method: "GET",
    path: "/api/projects/:id",
    description: "Fetch project by ID",
  },
  { method: "POST", path: "/api/sprint", description: "Create sprint update" },
  { method: "GET", path: "/api/modules", description: "Fetch module list" },
];

const sprintStatus = {
  sprintName: "Sprint 12",
  completedTasks: 8,
  pendingTasks: 3,
  team: "Platform Team",
  sprintGoal: "Finish MCP prototype and demo flow",
};

module.exports = {
  projectSummary,
  backendRoutes,
  sprintStatus,
};
