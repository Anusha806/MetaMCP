// import { useState } from "react";

// export default function Home() {
//   const [prompt, setPrompt] = useState("");
//   const [response, setResponse] = useState<string | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [testOutput, setTestOutput] = useState<{ stdout?: string; stderr?: string; error?: string } | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleGenerate = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("http://localhost:8000/generate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prompt }),
//       });
//       const data = await res.json();

//       if (data.error) {
//         setResponse(`❌ Error: ${data.error}`);
//         setPreview(null);
//         setTestOutput(null);
//       } else {
//         setResponse(data.message);
//         setPreview(data.preview);
//         setTestOutput(data.test_run);
//       }
//     } catch (err) {
//       console.error(err);
//       setResponse("❌ Error: could not reach backend");
//       setPreview(null);
//       setTestOutput(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
//       <h1>MetaMCP 🚀</h1>

//       <textarea
//         value={prompt}
//         onChange={(e) => setPrompt(e.target.value)}
//         placeholder="Describe the MCP you want..."
//         style={{ width: "100%", height: "100px", marginBottom: "1rem" }}
//       />

//       <br />

//       <button onClick={handleGenerate} disabled={loading}>
//         {loading ? "Generating..." : "Generate MCP"}
//       </button>

//       {response && (
//         <div style={{ marginTop: "1rem" }}>
//           <h3>Status:</h3>
//           <pre>{response}</pre>
//         </div>
//       )}

//       {preview && (
//         <div style={{ marginTop: "1rem" }}>
//           <h3>Code Preview:</h3>
//           <pre style={{ background: "#f14141ff", padding: "1rem", borderRadius: "8px" }}>
//             {preview}
//           </pre>
//         </div>
//       )}

//       {testOutput && (
//         <div style={{ marginTop: "1rem" }}>
//           <h3>Test Run Output:</h3>
//           {testOutput.stdout && (
//             <div>
//               <strong>Stdout:</strong>
//               <pre style={{ background: "#c1c2bbff", padding: "1rem", borderRadius: "8px" }}>
//                 {testOutput.stdout}
//               </pre>
//             </div>
//           )}
//           {testOutput.stderr && (
//             <div>
//               <strong>Stderr:</strong>
//               <pre style={{ background: "#c2bdbdff", padding: "1rem", borderRadius: "8px" }}>
//                 {testOutput.stderr}
//               </pre>
//             </div>
//           )}
//           {testOutput.error && (
//             <div>
//               <strong>Error:</strong>
//               <pre style={{ background: "#b1ababff", padding: "1rem", borderRadius: "8px" }}>
//                 {testOutput.error}
//               </pre>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }



import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [downloadAvailable, setDownloadAvailable] = useState(false);
  const [downloadFilename, setDownloadFilename] = useState<string>("");
  const [testOutput, setTestOutput] = useState<{ stdout?: string; stderr?: string; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setDownloadAvailable(false); // Clear previous download state
    
    try {
      const res = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      console.log("Backend response:", data); // Debug log

      if (data.error) {
        setResponse(`❌ Error: ${data.error}`);
        setPreview(null);
        setTestOutput(null);
        setDownloadAvailable(false);
      } else {
        setResponse(data.message);
        setPreview(data.preview);
        setTestOutput(data.test_run);
        
        // Check if download is available
        if (data.download_available) {
          setDownloadAvailable(true);
          setDownloadFilename(data.download_filename || "mcp_package.zip");
        }
      }
    } catch (err) {
      console.error(err);
      setResponse("❌ Error: could not reach backend");
      setPreview(null);
      setTestOutput(null);
      setDownloadAvailable(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      console.log("Initiating download..."); // Debug log
      
      // Create a link and trigger download
      const link = document.createElement('a');
      link.href = "http://localhost:8000/download_zip";
      link.download = downloadFilename;
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log("Download initiated"); // Debug log
      
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed. Please try again.");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>MetaMCP 🚀</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        Generate MCP (Model Context Protocol) code and download it as a complete package
      </p>

      <div style={{ marginBottom: "1rem" }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the MCP you want to generate... 
          
Examples:
- Create a weather API MCP that fetches current weather
- Build a file manager MCP for reading/writing files
- Make a database MCP for SQLite operations"
          style={{ 
            width: "100%", 
            height: "120px", 
            marginBottom: "1rem",
            padding: "1rem",
            borderRadius: "8px",
            border: "2px solid #e2e8f0",
            fontSize: "14px",
            fontFamily: "inherit",
            resize: "vertical"
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "2rem" }}>
        <button 
          onClick={handleGenerate} 
          disabled={loading || !prompt.trim()}
          style={{
            backgroundColor: loading || !prompt.trim() ? "#9ca3af" : "#3b82f6",
            color: "white",
            border: "none",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: loading || !prompt.trim() ? "not-allowed" : "pointer",
            transition: "background-color 0.2s"
          }}
        >
          {loading ? "Generating..." : "Generate MCP"}
        </button>

        {downloadAvailable && (
          <button
            onClick={handleDownload}
            style={{
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            📦 Download ZIP
          </button>
        )}
      </div>

      {response && (
        <div style={{ 
          marginTop: "1rem", 
          padding: "1rem", 
          backgroundColor: response.includes("❌") ? "#fee2e2" : "#f0fdf4",
          borderRadius: "8px",
          border: `1px solid ${response.includes("❌") ? "#fecaca" : "#bbf7d0"}`
        }}>
          <h3 style={{ margin: "0 0 0.5rem 0", color: response.includes("❌") ? "#dc2626" : "#16a34a" }}>
            Status:
          </h3>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{response}</pre>
        </div>
      )}

      {downloadAvailable && (
        <div style={{ 
          marginTop: "1rem", 
          padding: "1rem", 
          backgroundColor: "#eff6ff",
          borderRadius: "8px",
          border: "1px solid #dbeafe"
        }}>
          <h3 style={{ margin: "0 0 0.5rem 0", color: "#1d4ed8" }}>
            📁 Package Ready for Download
          </h3>
          <p style={{ margin: "0.5rem 0", color: "#374151" }}>
            <strong>Filename:</strong> {downloadFilename}
          </p>
          <p style={{ margin: "0.5rem 0", color: "#6b7280", fontSize: "14px" }}>
            The package includes: Python code, requirements.txt, README.md, and .env template
          </p>
          <p style={{ margin: "0.5rem 0", color: "#6b7280", fontSize: "14px" }}>
            Files are also saved locally in: <code>mcp/generated/</code>
          </p>
        </div>
      )}

      {preview && (
        <div style={{ marginTop: "1rem" }}>
          <h3 style={{ marginBottom: "0.5rem" }}>Code Preview:</h3>
          <pre style={{ 
            background: "#1f2937", 
            color: "#f9fafb",
            padding: "1rem", 
            borderRadius: "8px",
            overflow: "auto",
            fontSize: "14px",
            lineHeight: "1.5"
          }}>
            {preview}
          </pre>
        </div>
      )}

      {testOutput && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Test Run Output:</h3>
          {testOutput.stdout && (
            <div style={{ marginBottom: "1rem" }}>
              <strong style={{ color: "#16a34a" }}>✓ Stdout:</strong>
              <pre style={{ 
                background: "#f0fdf4", 
                color: "#166534",
                padding: "1rem", 
                borderRadius: "8px",
                marginTop: "0.5rem",
                border: "1px solid #bbf7d0"
              }}>
                {testOutput.stdout}
              </pre>
            </div>
          )}
          {testOutput.stderr && (
            <div style={{ marginBottom: "1rem" }}>
              <strong style={{ color: "#ea580c" }}>⚠ Stderr:</strong>
              <pre style={{ 
                background: "#fff7ed", 
                color: "#9a3412",
                padding: "1rem", 
                borderRadius: "8px",
                marginTop: "0.5rem",
                border: "1px solid #fed7aa"
              }}>
                {testOutput.stderr}
              </pre>
            </div>
          )}
          {testOutput.error && (
            <div style={{ marginBottom: "1rem" }}>
              <strong style={{ color: "#dc2626" }}>❌ Error:</strong>
              <pre style={{ 
                background: "#fee2e2", 
                color: "#991b1b",
                padding: "1rem", 
                borderRadius: "8px",
                marginTop: "0.5rem",
                border: "1px solid #fecaca"
              }}>
                {testOutput.error}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Footer info */}
      <div style={{ 
        marginTop: "3rem", 
        padding: "1rem", 
        backgroundColor: "#f8fafc",
        borderRadius: "8px",
        fontSize: "14px",
        color: "#64748b"
      }}>
        <h4 style={{ margin: "0 0 0.5rem 0", color: "#475569" }}>How it works:</h4>
        <ol style={{ margin: 0, paddingLeft: "1.5rem" }}>
          <li>Describe the MCP functionality you want</li>
          <li>Click "Generate MCP" to create the code</li>
          <li>Preview the generated code</li>
          <li>Click "Download ZIP" to get the complete package</li>
          <li>Files are saved locally in <code>mcp/generated/</code> and available for download</li>
        </ol>
      </div>
    </div>
  );
}