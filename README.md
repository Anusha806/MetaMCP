MetaMCP 🚀

AI-Powered Model Context Protocol (MCP) Code Generator

MetaMCP is a full-stack application that automatically generates MCP (Model Context Protocol) code based on natural language descriptions. Simply describe what you want your MCP to do, and MetaMCP will generate a complete, ready-to-use package with all necessary files.

✨ Features

🤖 AI-Powered Generation – Generate high-quality MCP code using GPT-4o-mini via OpenRouter

📦 Complete Package Creation – Automatically creates Python code, requirements.txt, README.md, and .env template

⬇️ One-Click Download – Download complete MCP packages as ZIP files

👀 Live Preview – View generated code before downloading

🔧 Smart Dependencies – Detects and includes required Python packages

💾 Local Storage – Generated files saved in mcp/generated/ for easy access

🎨 Modern UI – Clean and responsive React frontend with real-time feedback

🏗️ Architecture
Backend (FastAPI)

Framework: FastAPI (Python)

AI Integration: OpenAI client connected via OpenRouter

File Management: Automatic file creation and ZIP packaging

API Endpoints: RESTful API for code generation and downloads

Frontend (React/Next.js)

Framework: React with TypeScript

Styling: Modern inline styles

State Management: React Hooks

UX: Real-time feedback and download management

📋 Prerequisites

Node.js (v16 or higher)

Python (v3.8 or higher)

OpenRouter API Key (for AI-powered code generation)

📁 Project Structure
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

🚀 Quick Start
1. Clone the Repository
git clone https://github.com/Anusha806/MetaMCP.git
cd metamcp

2. Backend Setup
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate   # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install fastapi uvicorn python-dotenv openai

# Add your API key in .env
OPENAI_API_KEY=sk-xxxx...

# Start backend server
uvicorn main:app --reload --host 127.0.0.1 --port 8000

3. Frontend Setup
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Start development server
npm start

4. Access the App

Open your browser at:
👉 http://localhost:3000

📖 Usage

Enter Description – Describe the MCP functionality you want
Example:

Create a weather API MCP that fetches current weather data


Generate Code – Click Generate MCP

Preview Output – Review the generated code

Download Package – Click 📦 Download ZIP to get the complete package

💡 Example Prompts

"Create a file manager MCP for reading and writing files"

"Build a database MCP for SQLite operations"

"Make a web scraping MCP that extracts data from websites"

"Create a calendar MCP for managing events and appointments"

📦 Generated Package Structure
your_mcp_package.zip
├── your_mcp_code.py      # Main MCP implementation
├── requirements.txt      # Python dependencies
├── README.md             # Documentation
└── .env                  # Environment variables template

🔍 How It Works

User Input → Describe the desired MCP functionality

AI Processing → Backend sends request to GPT-4o-mini (via OpenRouter)

Code Generation → AI generates Python MCP code

Package Creation → Backend creates requirements.txt, README.md, .env

ZIP Bundling → All files packaged into a downloadable ZIP

Download → User downloads the ready-to-use MCP package