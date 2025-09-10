# MetaMCP

**AI-Powered Model Context Protocol (MCP) Code Generator**

MetaMCP is a full-stack application that automatically generates MCP (Model Context Protocol) code based on natural language descriptions. Simply describe what you want your MCP to do, and MetaMCP will generate a complete, ready-to-use package with all necessary files.

![MetaMCP Logo](https://via.placeholder.com/600x200/4A90E2/FFFFFF?text=MetaMCP)

## ✨ Features

- **🤖 AI-Powered Generation** – Generate high-quality MCP code using GPT-4o-mini via OpenRouter
- **📦 Complete Package Creation** – Automatically creates Python code, requirements.txt, README.md, and .env template
- **⬇️ One-Click Download** – Download complete MCP packages as ZIP files
- **👁️ Live Preview** – View generated code before downloading
- **🔍 Smart Dependencies** – Detects and includes required Python packages
- **💾 Local Storage** – Generated files saved in `mcp/generated/` for easy access
- **🎨 Modern UI** – Clean and responsive React frontend with real-time feedback
- - **💾 Github Integration** – Automatically commits in github


## 🏗️ Architecture

### Backend (FastAPI)
- **Framework:** FastAPI (Python)
- **AI Integration:** OpenAI client connected via OpenRouter
- **File Management:** Automatic file creation and ZIP packaging
- **API Endpoints:** RESTful API for code generation and downloads

### Frontend (React/Next.js)
- **Framework:** React with TypeScript
- **Styling:** Modern inline styles
- **State Management:** React Hooks
- **UX:** Real-time feedback and download management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **OpenRouter API Key** (for AI-powered code generation)

## 📂 Project Structure

```
metamcp/
├── backend/
│   ├── main.py              # FastAPI backend application
│   ├── .env                 # Environment variables
│   └── mcp/generated/       # Generated files storage
├── frontend/
│   ├── src/
│   │   └── pages/
│   │       └── index.tsx    # Main React component
│   ├── package.json
│   └── next.config.js
└── README.md
```

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Anusha806/MetaMCP.git
cd metamcp
```
### 2. Create a .env file and add the followinf API keys
```
OPENROUTER_API_KEY=sk-xxxx...
GITHUB_TOKEN=github.....
GITHUB_REPO=githubusername/repositoryname
```

### 3. Backend Setup

```bash

# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate   # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install requirements.txt

# Start backend server
uvicorn app.main:app --reload --port 8000

# Verify if your backend is running
navigate to https://localhost:8000

```

### 4. Frontend Setup

```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run build 
npm start


```

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 📖 Usage

1. **Enter Description** – Describe the MCP functionality you want in natural language
2. **Generate Code** – Click the "Generate MCP" button
3. **Preview Output** – Review the generated code in the preview panel
4. **Download Package** – Click "Download ZIP" to get the complete package

### Example Prompts

```
Build me a tool that fetches and displays the 7-day weather forecast for Vijayawada, India. 
The tool should return:
- The daily high and low temperature
- A short description of the conditions (e.g., sunny, cloudy, thunderstorms)
- Any severe weather alerts if available
- Format the output in a clean, readable table or list
```

```
Create a file manager MCP that can:
- List files in a directory
- Read file contents
- Create new files
- Delete files with confirmation
```

## 📦 Generated Package Structure

When you download a generated MCP package, it will contain:

```
your_mcp_package.zip
├── your_mcp_code.py      # Main MCP implementation
├── requirements.txt      # Python dependencies
├── README.md             # Documentation and usage instructions
└── .env                  # Environment variables template
```

## 🔄 How It Works

1. **User Input** → Describe the desired MCP functionality
2. **AI Processing** → Backend sends request to GPT-4o-mini (via OpenRouter)
3. **Code Generation** → AI generates Python MCP code with proper structure
4. **Package Creation** → Backend creates requirements.txt, README.md, and .env files
5. **ZIP Bundling** → All files are packaged into a downloadable ZIP
6. **Download** → User downloads the ready-to-use MCP package
7. **GitHub Integration** → Automatically commits the zip folder in your github repository 


## 🆘 Support

If you encounter any issues or have questions:
1. Provide detailed information about your environment and the issue

## 🙏 Acknowledgments

- **OpenRouter** for providing AI model access
- **FastAPI** for the excellent Python web framework
- **React** for the powerful frontend library
- **Model Context Protocol** community for the protocol specifications

## 📊 Roadmap

- [ ] Support for multiple AI models
- [ ] Custom templates and boilerplates
- [ ] Built-in MCP testing tools
- [ ] Integration with popular IDEs
- [ ] Community-shared MCP templates

---

**Built with ❤️ by the MetaMCP Team**

[GitHub](https://github.com/Anusha806/MetaMCP) • [Report Bug](https://github.com/Anusha806/MetaMCP/issues) 



