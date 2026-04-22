import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import dummyData from "../../data/dummyData.js";

const {
 backendRoutes,
 projectSummary,
 sprintStatus
} = dummyData;

const server = new Server(
  {
    name: "mern-mcp-demo-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "getProjectSummary",
        description: "Return a summary of the demo project",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
      },
      {
        name: "listBackendRoutes",
        description: "Return the backend API routes",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
      },
      {
        name: "getSprintStatus",
        description: "Return the current sprint status",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;

  if (toolName === "getProjectSummary") {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(projectSummary, null, 2),
        },
      ],
    };
  }

  if (toolName === "listBackendRoutes") {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(backendRoutes, null, 2),
        },
      ],
    };
  }

  if (toolName === "getSprintStatus") {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(sprintStatus, null, 2),
        },
      ],
    };
  }

  return {
    content: [
      {
        type: "text",
        text: `Unknown tool: ${toolName}`,
      },
    ],
    isError: true,
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal MCP server error:", error);
  process.exit(1);
});
