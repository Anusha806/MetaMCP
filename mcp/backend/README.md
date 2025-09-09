# MetaMCP 🚀

**AI-Powered Model Context Protocol (MCP) Code Generator**

MetaMCP is a full-stack application that automatically generates MCP (Model Context Protocol) code based on natural language descriptions. Simply describe what you want your MCP to do, and MetaMCP will generate a complete, ready-to-use package with all necessary files.

## ✨ Features

- **🤖 AI-Powered Generation**: Uses GPT-4o-mini via OpenRouter to generate high-quality MCP code
- **📦 Complete Package Creation**: Generates Python code, requirements.txt, README.md, and .env template
- **⬇️ Direct Download**: One-click download of complete MCP packages as ZIP files
- **👀 Live Preview**: See generated code before downloading
- **🔧 Smart Dependencies**: Automatically detects and includes required Python packages
- **💾 Local Storage**: Files saved locally in `mcp/generated/` folder for easy access
- **🎨 Modern UI**: Clean, responsive React frontend with real-time feedback

## 🏗️ Architecture

### Backend (FastAPI)
- **Framework**: FastAPI with Python
- **AI Integration**: OpenAI client connected to OpenRouter
- **File Management**: Automatic file creation and ZIP packaging
- **API Endpoints**: RESTful API for code generation and file downloads

### Frontend (React/Next.js)
- **Framework**: React with TypeScript
- **Styling**: Inline styles with modern design principles
- **State Management**: React hooks for application state
- **User Experience**: Real-time feedback and download management

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **OpenRouter API Key** (for AI code generation)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/metamcp.git
cd metamcp
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install fastapi uvicorn python-dotenv openai

# Create .env file
echo "OPENROUTER_API_KEY=your_openrouter_api_key_here" > .env

# Start the backend server
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 4. Access the Application
Open your browser and navigate to: `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

**Getting an OpenRouter API Key:**
1. Visit [OpenRouter.ai](https://openrouter.ai)
2. Sign up for an account
3. Navigate to API Keys section
4. Create a new API key
5. Add credits to your account

## 📖 Usage

### Basic Usage

1. **Enter Description**: Describe the MCP functionality you want
   ```
   Create a weather API MCP that fetches current weather data
   ```

2. **Generate Code**: Click "Generate MCP" button

3. **Review Output**: Preview the generated code and check for any errors

4. **Download Package**: Click "📦 Download ZIP" to get the complete package

### Example Prompts

- `"Create a file manager MCP for reading and writing files"`
- `"Build a database MCP for SQLite operations"`
- `"Make a web scraping MCP that extracts data from websites"`
- `"Create a calendar MCP for managing events and appointments"`

### Generated Package Structure

Each generated package includes:

```
your_mcp_package.zip
├── your_mcp_code.py          # Main MCP implementation
├── requirements.txt          # Python dependencies
├── README.md                 # Documentation and usage instructions
└── .env                      # Environment variables template
```

## 🛠️ API Reference

### POST `/generate`
Generate MCP code based on natural language description.

**Request Body:**
```json
{
  "prompt": "Create a weather API MCP"
}
```

**Response:**
```json
{
  "message": "MCP generated successfully ✅",
  "files": {...},
  "download_available": true,
  "download_filename": "weather_api_package.zip",
  "preview": "import os\nfrom fastapi import FastAPI..."
}
```

### GET `/download_zip`
Download the most recently generated MCP package.

**Response:** ZIP file download

## 📁 Project Structure

```
metamcp/
├── backend/
│   ├── main.py              # FastAPI application
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

## 🔍 How It Works

1. **User Input**: User describes desired MCP functionality
2. **AI Processing**: Backend sends prompt to GPT-4o-mini via OpenRouter
3. **Code Generation**: AI generates Python MCP code
4. **Package Creation**: Backend creates supporting files (requirements.txt, README, .env)
5. **ZIP Creation**: All files bundled into downloadable ZIP package
6. **Download**: User downloads complete package to local machine

## 🚨 Troubleshooting

### Common Issues

**Backend not starting:**
- Check if port 8000 is available
- Verify OpenRouter API key in `.env` file
- Ensure all Python dependencies are installed

**Frontend not connecting:**
- Verify backend is running on `http://localhost:8000`
- Check browser console for CORS errors
- Ensure frontend is running on `http://localhost:3000`

**Download not working:**
- Check browser's download settings
- Verify ZIP file is created in `mcp/generated/` folder
- Look for JavaScript errors in browser console

### Debug Logs

Backend includes console logging for troubleshooting:
```
Received request: your prompt here
Generated files and zip at: /path/to/zip
Download requested for: /path/to/zip
Serving file as: filename.zip
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenRouter** for providing access to GPT-4o-mini
- **FastAPI** for the excellent Python web framework
- **React/Next.js** for the frontend framework
- **MCP Protocol** for the inspiration and standards

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#🚨-troubleshooting) section
2. Open an issue on GitHub
3. Check OpenRouter documentation for API-related issues

---

**Made with ❤️ for the MCP community**