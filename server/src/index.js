const express = require("express");
const cors = require("cors");
const { spawn } = require("node:child_process");
const path = require("node:path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

function mapQueryToTool(message) {
  const text = message.toLowerCase();

  if (text.includes("summary")) return "getProjectSummary";
  if (text.includes("routes")) return "listBackendRoutes";
  if (text.includes("sprint")) return "getSprintStatus";

  return null;
}

function callMcpTool(toolName) {
  return new Promise((resolve, reject) => {
    const mcpServerPath = path.join(__dirname, "../../mcp-server/src/index.js");

    const child = spawn("node", [mcpServerPath], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let outputBuffer = "";
    let errorBuffer = "";

    child.stdout.on("data", (chunk) => {
      outputBuffer += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      errorBuffer += chunk.toString();
    });

    child.on("error", (err) => {
      reject(err);
    });

    let requestId = 1;

    const initRequest = {
      jsonrpc: "2.0",
      id: requestId++,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: {
          name: "mern-demo-client",
          version: "1.0.0",
        },
      },
    };

    const toolCallRequest = {
      jsonrpc: "2.0",
      id: requestId++,
      method: "tools/call",
      params: {
        name: toolName,
        arguments: {},
      },
    };

    child.stdin.write(JSON.stringify(initRequest) + "\n");
    child.stdin.write(JSON.stringify(toolCallRequest) + "\n");

    setTimeout(() => {
      child.kill();

      const lines = outputBuffer
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      try {
        const parsed = lines
          .map((line) => {
            try {
              return JSON.parse(line);
            } catch {
              return null;
            }
          })
          .filter(Boolean);

        const toolResponse = parsed.find(
          (item) =>
            item.result &&
            item.result.content &&
            Array.isArray(item.result.content),
        );

        if (!toolResponse) {
          return reject(
            new Error("No valid tool response received from MCP server"),
          );
        }

        const textContent = toolResponse.result.content[0]?.text || "";
        resolve(textContent);
      } catch (err) {
        reject(err);
      }
    }, 1000);
  });
}

app.post("/api/ask", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const toolName = mapQueryToTool(message);

    if (!toolName) {
      return res.status(200).json({
        tool: null,
        result:
          "No matching tool found. Try project summary, backend routes, or sprint status.",
      });
    }

    const result = await callMcpTool(toolName);

    res.json({
      tool: toolName,
      result,
    });
  } catch (error) {
    console.error("Backend error:", error);
    res.status(500).json({
      error: "Failed to process request",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
