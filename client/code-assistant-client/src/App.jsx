import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [tool, setTool] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setTool("");
    setResult("");

    try {
      const response = await fetch("http://localhost:5000/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      setTool(data.tool || "No tool selected");
      setResult(data.result || data.error || "No result");
    } catch (error) {
      console.error("Error:", error);
      setResult("Something went wrong while calling the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>MCP MERN Demo</h1>
      <p className="subtitle">Developer Project Assistant</p>

      <div className="card">
        <textarea
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type: project summary, backend routes, or sprint status"
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? "Loading..." : "Ask"}
        </button>
      </div>

      <div className="card">
        <h3>Detected Tool</h3>
        <p>{tool || "-"}</p>

        <h3>Result</h3>
        <pre>{result || "-"}</pre>
      </div>
    </div>
  );
}

export default App;
