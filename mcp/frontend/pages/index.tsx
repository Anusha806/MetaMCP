
// import { useState } from "react";

// interface GenerateResponse {
//   message: string;
//   error?: string;
//   preview?: string;
//   download_available?: boolean;
//   download_filename?: string;
//   detected_env_vars?: number;
//   dependencies_count?: number;
//   env_vars?: string[];
//   test_run?: {
//     stdout?: string;
//     stderr?: string;
//     error?: string;
//   };
// }

// export default function Home() {
//   const [prompt, setPrompt] = useState("");
//   const [response, setResponse] = useState<GenerateResponse | null>(null);
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

//       console.log("Backend response:", data); // Debug log
//       setResponse(data);
      
//     } catch (err) {
//       console.error(err);
//       setResponse({
//         message: "❌ Error: could not reach backend",
//         error: "Network error"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = async () => {
//     try {
//       console.log("Initiating download..."); // Debug log
      
//       // Create a link and trigger download
//       const link = document.createElement('a');
//       link.href = "http://localhost:8000/download_zip";
//       link.download = response?.download_filename || "mcp_package.zip";
      
//       // Append to body, click, and remove
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
      
//       console.log("Download initiated"); // Debug log
      
//     } catch (err) {
//       console.error("Download failed:", err);
//       alert("Download failed. Please try again.");
//     }
//   };

//   return (
//     <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
//       <h1>MetaMCP 🚀</h1>
//       <p style={{ color: "#666", marginBottom: "2rem" }}>
//         Generate production-ready MCP (Model Context Protocol) packages with proper environment variable handling
//       </p>

//       <div style={{ marginBottom: "1rem" }}>
//         <textarea
//           value={prompt}
//           onChange={(e) => setPrompt(e.target.value)}
//           placeholder="Describe the MCP you want to generate... 

// Examples:
// - Create a weather API MCP that fetches current weather from OpenWeatherMap
// - Build a file manager MCP for reading/writing files with authentication
// - Make a database MCP for SQLite operations with user management
// - Create a Slack bot MCP that sends messages and responds to commands
// - Build a GitHub integration MCP that manages repositories and issues"
//           style={{ 
//             width: "100%", 
//             height: "140px", 
//             marginBottom: "1rem",
//             padding: "1rem",
//             borderRadius: "8px",
//             border: "2px solid #e2e8f0",
//             fontSize: "14px",
//             fontFamily: "inherit",
//             resize: "vertical"
//           }}
//         />
//       </div>

//       <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "2rem" }}>
//         <button 
//           onClick={handleGenerate} 
//           disabled={loading || !prompt.trim()}
//           style={{
//             backgroundColor: loading || !prompt.trim() ? "#9ca3af" : "#3b82f6",
//             color: "white",
//             border: "none",
//             padding: "0.75rem 1.5rem",
//             borderRadius: "8px",
//             fontSize: "16px",
//             fontWeight: "600",
//             cursor: loading || !prompt.trim() ? "not-allowed" : "pointer",
//             transition: "background-color 0.2s"
//           }}
//         >
//           {loading ? "🔄 Generating..." : "🚀 Generate MCP"}
//         </button>

//         {response?.download_available && (
//           <button
//             onClick={handleDownload}
//             style={{
//               backgroundColor: "#10b981",
//               color: "white",
//               border: "none",
//               padding: "0.75rem 1.5rem",
//               borderRadius: "8px",
//               fontSize: "16px",
//               fontWeight: "600",
//               cursor: "pointer",
//               transition: "background-color 0.2s",
//               display: "flex",
//               alignItems: "center",
//               gap: "0.5rem"
//             }}
//           >
//             📦 Download Package
//           </button>
//         )}
//       </div>

//       {response && (
//         <div style={{ 
//           marginTop: "1rem", 
//           padding: "1.5rem", 
//           backgroundColor: response.error ? "#fee2e2" : "#f0fdf4",
//           borderRadius: "8px",
//           border: `2px solid ${response.error ? "#fecaca" : "#bbf7d0"}`
//         }}>
//           <h3 style={{ 
//             margin: "0 0 1rem 0", 
//             color: response.error ? "#dc2626" : "#16a34a",
//             display: "flex",
//             alignItems: "center",
//             gap: "0.5rem"
//           }}>
//             {response.error ? "❌" : "✅"} Status:
//           </h3>
//           <pre style={{ 
//             margin: 0, 
//             whiteSpace: "pre-wrap", 
//             fontFamily: "inherit",
//             fontSize: "16px"
//           }}>
//             {response.message}
//           </pre>
//         </div>
//       )}

//       {response?.download_available && (
//         <div style={{ 
//           marginTop: "1rem", 
//           padding: "1.5rem", 
//           backgroundColor: "#eff6ff",
//           borderRadius: "8px",
//           border: "2px solid #dbeafe"
//         }}>
//           <h3 style={{ margin: "0 0 1rem 0", color: "#1d4ed8", display: "flex", alignItems: "center", gap: "0.5rem" }}>
//             📁 Production-Ready Package
//           </h3>
          
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
//             <div style={{ 
//               backgroundColor: "#f8fafc", 
//               padding: "1rem", 
//               borderRadius: "6px",
//               border: "1px solid #e2e8f0"
//             }}>
//               <div style={{ fontSize: "24px", fontWeight: "bold", color: "#1e40af" }}>
//                 {response.dependencies_count || 0}
//               </div>
//               <div style={{ fontSize: "14px", color: "#64748b" }}>Dependencies</div>
//             </div>
            
//             <div style={{ 
//               backgroundColor: "#f8fafc", 
//               padding: "1rem", 
//               borderRadius: "6px",
//               border: "1px solid #e2e8f0"
//             }}>
//               <div style={{ fontSize: "24px", fontWeight: "bold", color: "#059669" }}>
//                 {response.detected_env_vars || 0}
//               </div>
//               <div style={{ fontSize: "14px", color: "#64748b" }}>Environment Variables</div>
//             </div>
//           </div>

//           {response.env_vars && response.env_vars.length > 0 && (
//             <div style={{ marginBottom: "1rem" }}>
//               <h4 style={{ margin: "0 0 0.5rem 0", color: "#1e40af", fontSize: "16px" }}>
//                 🔐 Detected Environment Variables:
//               </h4>
//               <div style={{ 
//                 display: "flex", 
//                 flexWrap: "wrap", 
//                 gap: "0.5rem",
//                 marginBottom: "0.5rem"
//               }}>
//                 {response.env_vars.map((envVar, index) => (
//                   <span 
//                     key={index}
//                     style={{
//                       backgroundColor: "#fef3c7",
//                       color: "#92400e",
//                       padding: "0.25rem 0.5rem",
//                       borderRadius: "4px",
//                       fontSize: "12px",
//                       fontFamily: "monospace",
//                       border: "1px solid #fde68a"
//                     }}
//                   >
//                     {envVar}
//                   </span>
//                 ))}
//               </div>
//               <p style={{ margin: "0", color: "#6b7280", fontSize: "14px" }}>
//                 ⚠️ You'll need to provide values for these in your .env file
//               </p>
//             </div>
//           )}
          
//           <div style={{ marginBottom: "1rem" }}>
//             <p style={{ margin: "0.5rem 0", color: "#374151" }}>
//               <strong>📦 Package:</strong> {response.download_filename}
//             </p>
//             <p style={{ margin: "0.5rem 0", color: "#6b7280", fontSize: "14px" }}>
//               <strong>📄 Includes:</strong> main.py, requirements.txt, README.md, .env template
//             </p>
//             <p style={{ margin: "0.5rem 0", color: "#6b7280", fontSize: "14px" }}>
//               <strong>💾 Local path:</strong> <code>mcp/generated/</code>
//             </p>
//           </div>

//           <div style={{
//             backgroundColor: "#f0f9ff",
//             padding: "1rem",
//             borderRadius: "6px",
//             border: "1px solid #bae6fd"
//           }}>
//             <h4 style={{ margin: "0 0 0.5rem 0", color: "#0369a1", fontSize: "14px" }}>
//               🚀 Quick Setup Instructions:
//             </h4>
//             <ol style={{ margin: 0, paddingLeft: "1.5rem", fontSize: "14px", color: "#374151" }}>
//               <li>Download and extract the package</li>
//               <li>Install dependencies: <code style={{ backgroundColor: "#e5e7eb", padding: "2px 4px", borderRadius: "3px" }}>pip install -r requirements.txt</code></li>
//               <li>Fill in your API keys in the .env file</li>
//               <li>Run: <code style={{ backgroundColor: "#e5e7eb", padding: "2px 4px", borderRadius: "3px" }}>python main.py</code></li>
//             </ol>
//           </div>
//         </div>
//       )}

//       {response?.preview && (
//         <div style={{ marginTop: "1rem" }}>
//           <h3 style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
//             👀 Code Preview:
//           </h3>
//           <pre style={{ 
//             background: "#1f2937", 
//             color: "#f9fafb",
//             padding: "1.5rem", 
//             borderRadius: "8px",
//             overflow: "auto",
//             fontSize: "14px",
//             lineHeight: "1.6",
//             border: "1px solid #374151"
//           }}>
//             {response.preview}
//           </pre>
//         </div>
//       )}

//       {response?.test_run && (
//         <div style={{ marginTop: "1rem" }}>
//           <h3 style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
//             🧪 Test Run Output:
//           </h3>
//           {response.test_run.stdout && (
//             <div style={{ marginBottom: "1rem" }}>
//               <strong style={{ color: "#16a34a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
//                 ✓ Stdout:
//               </strong>
//               <pre style={{ 
//                 background: "#f0fdf4", 
//                 color: "#166534",
//                 padding: "1rem", 
//                 borderRadius: "8px",
//                 marginTop: "0.5rem",
//                 border: "1px solid #bbf7d0",
//                 fontSize: "14px"
//               }}>
//                 {response.test_run.stdout}
//               </pre>
//             </div>
//           )}
//           {response.test_run.stderr && (
//             <div style={{ marginBottom: "1rem" }}>
//               <strong style={{ color: "#ea580c", display: "flex", alignItems: "center", gap: "0.5rem" }}>
//                 ⚠ Stderr:
//               </strong>
//               <pre style={{ 
//                 background: "#fff7ed", 
//                 color: "#9a3412",
//                 padding: "1rem", 
//                 borderRadius: "8px",
//                 marginTop: "0.5rem",
//                 border: "1px solid #fed7aa",
//                 fontSize: "14px"
//               }}>
//                 {response.test_run.stderr}
//               </pre>
//             </div>
//           )}
//           {response.test_run.error && (
//             <div style={{ marginBottom: "1rem" }}>
//               <strong style={{ color: "#dc2626", display: "flex", alignItems: "center", gap: "0.5rem" }}>
//                 ❌ Error:
//               </strong>
//               <pre style={{ 
//                 background: "#fee2e2", 
//                 color: "#991b1b",
//                 padding: "1rem", 
//                 borderRadius: "8px",
//                 marginTop: "0.5rem",
//                 border: "1px solid #fecaca",
//                 fontSize: "14px"
//               }}>
//                 {response.test_run.error}
//               </pre>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Enhanced Footer info */}
//       <div style={{ 
//         marginTop: "3rem", 
//         padding: "2rem", 
//         backgroundColor: "#f8fafc",
//         borderRadius: "12px",
//         fontSize: "14px",
//         color: "#64748b",
//         border: "1px solid #e2e8f0"
//       }}>
//         <h4 style={{ margin: "0 0 1rem 0", color: "#475569", fontSize: "18px" }}>
//           🛠️ How MetaMCP Works:
//         </h4>
        
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
//           <div>
//             <h5 style={{ margin: "0 0 0.5rem 0", color: "#1e40af", display: "flex", alignItems: "center", gap: "0.5rem" }}>
//               🎯 Smart Generation
//             </h5>
//             <ul style={{ margin: 0, paddingLeft: "1rem", lineHeight: "1.6" }}>
//               <li>Analyzes your prompt for API requirements</li>
//               <li>Detects needed environment variables</li>
//               <li>Generates production-ready code structure</li>
//               <li>Includes proper error handling</li>
//             </ul>
//           </div>
          
//           <div>
//             <h5 style={{ margin: "0 0 0.5rem 0", color: "#059669", display: "flex", alignItems: "center", gap: "0.5rem" }}>
//               📦 Complete Package
//             </h5>
//             <ul style={{ margin: 0, paddingLeft: "1rem", lineHeight: "1.6" }}>
//               <li>main.py with your generated code</li>
//               <li>requirements.txt with all dependencies</li>
//               <li>Comprehensive README.md with setup instructions</li>
//               <li>Pre-configured .env template</li>
//             </ul>
//           </div>
          
//           <div>
//             <h5 style={{ margin: "0 0 0.5rem 0", color: "#dc2626", display: "flex", alignItems: "center", gap: "0.5rem" }}>
//               🔐 Security First
//             </h5>
//             <ul style={{ margin: 0, paddingLeft: "1rem", lineHeight: "1.6" }}>
//               <li>All sensitive data in environment variables</li>
//               <li>No hardcoded API keys or secrets</li>
//               <li>Proper dotenv integration</li>
//               <li>Security best practices included</li>
//             </ul>
//           </div>
//         </div>

//         <div style={{ 
//           marginTop: "2rem", 
//           padding: "1rem", 
//           backgroundColor: "#fefce8", 
//           borderRadius: "8px",
//           border: "1px solid #fde047"
//         }}>
//           <h5 style={{ margin: "0 0 0.5rem 0", color: "#a16207", display: "flex", alignItems: "center", gap: "0.5rem" }}>
//             💡 Pro Tips:
//           </h5>
//           <ul style={{ margin: 0, paddingLeft: "1rem", color: "#713f12", lineHeight: "1.6" }}>
//             <li>Be specific about which APIs or services you want to integrate</li>
//             <li>Mention authentication requirements in your prompt</li>
//             <li>Include any specific functionality or endpoints you need</li>
//             <li>The more details you provide, the better the generated code will be</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";

interface GenerateResponse {
  message: string;
  error?: string;
  preview?: string;
  download_available?: boolean;
  download_filename?: string;
  detected_env_vars?: number;
  dependencies_count?: number;
  env_vars?: string[];
  test_run?: {
    stdout?: string;
    stderr?: string;
    error?: string;
  };
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<GenerateResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    
    try {
      const res = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      console.log("Backend response:", data);
      setResponse(data);
      
    } catch (err) {
      console.error(err);
      setResponse({
        message: "❌ Error: could not reach backend",
        error: "Network error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      console.log("Initiating download...");
      
      const link = document.createElement('a');
      link.href = "http://localhost:8000/download_zip";
      link.download = response?.download_filename || "mcp_package.zip";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log("Download initiated");
      
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">MetaMCP</h1>
            </div>
            <div className="text-sm text-gray-500">Generate MCP Packages</div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            <span>AI-Powered MCP Generator</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Generate Production-Ready<br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MCP Packages
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create complete Model Context Protocol packages with proper environment variable handling, 
            dependencies, and production-ready code structure.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 mb-8">
          <div className="p-6">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the MCP you want to generate...

Examples:
• Create a weather API MCP that fetches current weather from OpenWeatherMap
• Build a file manager MCP for reading/writing files with authentication  
• Make a database MCP for SQLite operations with user management
• Create a Slack bot MCP that sends messages and responds to commands
• Build a GitHub integration MCP that manages repositories and issues"
                className="w-full h-40 p-4 text-gray-900 placeholder-gray-500 border-0 resize-none focus:outline-none focus:ring-0 bg-transparent text-base leading-relaxed"
              />
              
              {/* Bottom bar with generate button */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Backend Connected</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {response?.download_available && (
                    <button
                      onClick={handleDownload}
                      className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Download</span>
                    </button>
                  )}
                  
                  <button 
                    onClick={handleGenerate} 
                    disabled={loading || !prompt.trim()}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:hover:scale-100"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Generate MCP</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Response Section */}
        {response && (
          <div className="space-y-6">
            {/* Status Message */}
            <div className={`rounded-2xl shadow-lg border p-6 ${
              response.error 
                ? 'bg-red-50 border-red-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  response.error ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  {response.error ? (
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold mb-2 ${
                    response.error ? 'text-red-800' : 'text-green-800'
                  }`}>
                    {response.error ? 'Generation Failed' : 'Generation Successful'}
                  </h3>
                  <pre className={`text-sm leading-relaxed font-mono ${
                    response.error ? 'text-red-700' : 'text-green-700'
                  }`}>
                    {response.message}
                  </pre>
                </div>
              </div>
            </div>

            {/* Package Info */}
            {response.download_available && (
              <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Production-Ready Package</h3>
                    <p className="text-gray-600">Your MCP package is ready for download and deployment</p>
                  </div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {response.dependencies_count || 0}
                    </div>
                    <div className="text-sm font-medium text-blue-800">Dependencies</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
                    <div className="text-3xl font-bold text-emerald-600 mb-1">
                      {response.detected_env_vars || 0}
                    </div>
                    <div className="text-sm font-medium text-emerald-800">Environment Variables</div>
                  </div>
                </div>

                {/* Environment Variables */}
                {response.env_vars && response.env_vars.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Environment Variables Detected</span>
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {response.env_vars.map((envVar, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-amber-100 text-amber-800 rounded-lg text-sm font-mono border border-amber-200"
                        >
                          {envVar}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-start space-x-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <p className="text-amber-800 text-sm">
                        You'll need to provide values for these in your .env file before running the MCP
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Package Details */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Package:</span>
                      <span className="ml-2 text-gray-900">{response.download_filename}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Local path:</span>
                      <span className="ml-2 text-gray-900 font-mono">mcp/generated/</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="font-medium text-gray-700">Includes:</span>
                    <span className="ml-2 text-gray-900">main.py, requirements.txt, README.md, .env template</span>
                  </div>
                </div>

                {/* Quick Setup */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Quick Setup Instructions</span>
                  </h4>
                  <ol className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start space-x-2">
                      <span className="bg-blue-200 text-blue-800 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                      <span>Download and extract the package</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="bg-blue-200 text-blue-800 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                      <div>
                        <span>Install dependencies: </span>
                        <code className="bg-blue-200 text-blue-900 px-2 py-1 rounded text-xs font-mono">pip install -r requirements.txt</code>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="bg-blue-200 text-blue-800 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                      <span>Fill in your API keys in the .env file</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="bg-blue-200 text-blue-800 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                      <div>
                        <span>Run: </span>
                        <code className="bg-blue-200 text-blue-900 px-2 py-1 rounded text-xs font-mono">python main.py</code>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {/* Code Preview */}
            {response.preview && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      <span>Code Preview</span>
                    </h3>
                  </div>
                </div>
                <pre className="p-6 bg-gray-900 text-green-400 overflow-auto text-sm leading-relaxed font-mono">
                  {response.preview}
                </pre>
              </div>
            )}

            {/* Test Run Output */}
            {response.test_run && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Test Run Output</span>
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  {response.test_run.stdout && (
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium text-green-800">Stdout</span>
                      </div>
                      <pre className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm font-mono text-green-900 overflow-auto">
                        {response.test_run.stdout}
                      </pre>
                    </div>
                  )}
                  {response.test_run.stderr && (
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="font-medium text-amber-800">Stderr</span>
                      </div>
                      <pre className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm font-mono text-amber-900 overflow-auto">
                        {response.test_run.stderr}
                      </pre>
                    </div>
                  )}
                  {response.test_run.error && (
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="font-medium text-red-800">Error</span>
                      </div>
                      <pre className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm font-mono text-red-900 overflow-auto">
                        {response.test_run.error}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* How MetaMCP Works Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>How MetaMCP Works</span>
            </h2>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Smart Generation</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Analyzes your prompt for API requirements</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Detects needed environment variables</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Generates production-ready code structure</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Includes proper error handling</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Complete Package</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>main.py with your generated code</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>requirements.txt with all dependencies</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Comprehensive README.md with setup instructions</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Pre-configured .env template</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Security First</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>All sensitive data in environment variables</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>No hardcoded API keys or secrets</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Proper dotenv integration</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Security best practices included</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Pro Tips Section */}
            <div className="mt-12 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-amber-900 mb-3">Pro Tips for Better Results</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-amber-800 text-sm">Be specific about which APIs or services you want to integrate</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-amber-800 text-sm">Mention authentication requirements in your prompt</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-amber-800 text-sm">Include any specific functionality or endpoints you need</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-amber-800 text-sm">The more details you provide, the better the generated code will be</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <div className="border-t border-gray-200 pt-8">
            <p>MetaMCP - Generate production-ready MCP packages with AI assistance</p>
            <p className="mt-2">Built with modern web technologies and secure coding practices</p>
          </div>
        </footer>
      </div>
    </div>
  );
}