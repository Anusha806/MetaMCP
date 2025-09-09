
import os
import re
import time
import sys
import subprocess
import zipfile
from typing import List, Set, Dict, Tuple

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI

# Load .env
load_dotenv()

app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str

# Init OpenRouter client
client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

# ---------- Helpers ----------

def safe_filename(prompt: str, extension: str = ".py") -> str:
    """Create a short, unique, filesystem-safe filename from the prompt."""
    words = prompt.split()[:5]
    short = "_".join(words)
    short = re.sub(r"[^a-zA-Z0-9_]", "", short).lower() or "generated_mcp"
    unique = str(int(time.time()))
    return f"{short}_{unique}{extension}"

_STDLIB: Set[str] = set(getattr(sys, "stdlib_module_names", set())) or {
    "abc","argparse","asyncio","base64","collections","concurrent","contextlib","copy",
    "csv","ctypes","datetime","decimal","enum","functools","glob","gzip","hashlib","heapq",
    "html","http","importlib","io","itertools","json","logging","math","multiprocessing",
    "numbers","operator","os","pathlib","pickle","platform","plistlib","queue","random",
    "re","sched","secrets","shutil","signal","socket","sqlite3","statistics","string",
    "struct","subprocess","sys","tempfile","textwrap","threading","time","timeit","typing",
    "uuid","unittest","urllib","warnings","weakref","xml","zipfile"
}

_PIP_NAME_OVERRIDES = {
    "cv2": "opencv-python",
    "PIL": "Pillow",
    "yaml": "PyYAML",
    "sklearn": "scikit-learn",
    "bs4": "beautifulsoup4",
}

def _top_level_module(name: str) -> str:
    name = name.strip()
    if " as " in name:
        name = name.split(" as ", 1)[0]
    if "." in name:
        name = name.split(".", 1)[0]
    return name.strip()

def extract_requirements_from_code(code: str) -> List[str]:
    reqs: Set[str] = set()
    for raw in code.splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue

        if line.startswith("import "):
            modules = line[len("import "):].split(",")
            for m in modules:
                top = _top_level_module(m)
                if top and top not in _STDLIB and top.isidentifier():
                    reqs.add(_PIP_NAME_OVERRIDES.get(top, top))

        elif line.startswith("from "):
            after_from = line[len("from "):]
            pkg = after_from.split(" import ")[0].strip()
            top = _top_level_module(pkg)
            if top and top not in _STDLIB and top.isidentifier():
                reqs.add(_PIP_NAME_OVERRIDES.get(top, top))

    return sorted(reqs)

def extract_api_keys_and_secrets(code: str) -> Dict[str, str]:
    """Extract potential API keys, secrets, and configuration from code"""
    env_vars = {}
    
    # Common patterns for API keys and secrets
    patterns = {
        # OpenAI API
        r'openai[._]api[._]key': 'OPENAI_API_KEY',
        r'openai[._]key': 'OPENAI_API_KEY',
        r'OpenAI\([^)]*api_key\s*=\s*["\']([^"\']*)["\']': 'OPENAI_API_KEY',
        
        # Generic API patterns
        r'api[._]key': 'API_KEY',
        r'apikey': 'API_KEY',
        r'secret[._]key': 'SECRET_KEY',
        r'access[._]token': 'ACCESS_TOKEN',
        r'bearer[._]token': 'BEARER_TOKEN',
        
        # Database URLs
        r'database[._]url': 'DATABASE_URL',
        r'db[._]url': 'DATABASE_URL',
        
        # Service specific
        r'weather[._]api': 'WEATHER_API_KEY',
        r'news[._]api': 'NEWS_API_KEY',
        r'github[._]token': 'GITHUB_TOKEN',
        r'slack[._]token': 'SLACK_TOKEN',
        r'discord[._]token': 'DISCORD_TOKEN',
        
        # AWS
        r'aws[._]access[._]key': 'AWS_ACCESS_KEY_ID',
        r'aws[._]secret': 'AWS_SECRET_ACCESS_KEY',
        
        # Google
        r'google[._]api': 'GOOGLE_API_KEY',
        r'gmail[._]password': 'GMAIL_APP_PASSWORD',
        
        # Other common services
        r'stripe[._]key': 'STRIPE_API_KEY',
        r'twilio[._]sid': 'TWILIO_ACCOUNT_SID',
        r'twilio[._]token': 'TWILIO_AUTH_TOKEN',
    }
    
    # Look for environment variable usage patterns
    env_patterns = [
        r'os\.getenv\(["\']([^"\']+)["\']',
        r'os\.environ\[["\']([^"\']+)["\']\]',
        r'getenv\(["\']([^"\']+)["\']',
        r'environ\[["\']([^"\']+)["\']\]',
    ]
    
    code_lower = code.lower()
    
    # Check for common API key patterns
    for pattern, env_name in patterns.items():
        if re.search(pattern, code_lower):
            env_vars[env_name] = f"your_{env_name.lower()}_here"
    
    # Extract actual environment variable names used in code
    for pattern in env_patterns:
        matches = re.findall(pattern, code, re.IGNORECASE)
        for match in matches:
            # Generate appropriate placeholder
            placeholder = f"your_{match.lower().replace('_', '_')}_here"
            env_vars[match] = placeholder
    
    # Add some common defaults if it looks like an API-heavy application
    if any(keyword in code_lower for keyword in ['requests.', 'http', 'api', 'client']):
        if 'API_KEY' not in env_vars:
            env_vars['API_KEY'] = 'your_api_key_here'
    
    # Add database-related vars if database operations detected
    if any(keyword in code_lower for keyword in ['sqlite', 'postgres', 'mysql', 'database', 'db']):
        if 'DATABASE_URL' not in env_vars:
            env_vars['DATABASE_URL'] = 'sqlite:///./database.db'
    
    return env_vars

def create_enhanced_env_file(path: str, detected_vars: Dict[str, str]):
    """Create a comprehensive .env file with detected variables and common ones"""
    
    env_content = [
        "# Environment Variables for MCP Application",
        "# Replace placeholder values with your actual keys/tokens",
        "",
        "# =============================================================================",
        "# DETECTED VARIABLES (Based on your generated code)",
        "# =============================================================================",
    ]
    
    if detected_vars:
        for var, placeholder in sorted(detected_vars.items()):
            env_content.append(f"{var}={placeholder}")
    else:
        env_content.append("# No specific API keys detected in the generated code")
    
    env_content.extend([
        "",
        "# =============================================================================", 
        "# COMMON OPTIONAL VARIABLES (Uncomment and fill as needed)",
        "# =============================================================================",
        "",
        "# OpenAI API",
        "# OPENAI_API_KEY=sk-your-openai-api-key-here",
        "# OPENAI_ORG_ID=org-your-organization-id",
        "",
        "# Database Configuration", 
        "# DATABASE_URL=sqlite:///./app.db",
        "# DB_HOST=localhost",
        "# DB_PORT=5432",
        "# DB_USER=username",
        "# DB_PASSWORD=password",
        "# DB_NAME=database_name",
        "",
        "# Web Service Configuration",
        "# HOST=0.0.0.0",
        "# PORT=8000",
        "# DEBUG=False",
        "",
        "# External APIs",
        "# WEATHER_API_KEY=your-weather-api-key",
        "# NEWS_API_KEY=your-news-api-key", 
        "# GITHUB_TOKEN=ghp_your-github-token",
        "",
        "# AWS Credentials",
        "# AWS_ACCESS_KEY_ID=your-access-key",
        "# AWS_SECRET_ACCESS_KEY=your-secret-key",
        "# AWS_REGION=us-east-1",
        "",
        "# Other Common Services",
        "# STRIPE_API_KEY=sk_test_your-stripe-key",
        "# TWILIO_ACCOUNT_SID=AC-your-twilio-sid",
        "# TWILIO_AUTH_TOKEN=your-twilio-token",
        "# SLACK_BOT_TOKEN=xoxb-your-slack-token",
        "# DISCORD_TOKEN=your-discord-bot-token",
    ])
    
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(env_content))

def create_enhanced_readme(path: str, prompt: str, detected_vars: Dict[str, str], requirements: List[str]):
    """Create a comprehensive README with setup instructions"""
    
    readme_content = f"""# MCP Application

Generated by MetaMCP based on: **{prompt}**

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Environment Setup
Copy the `.env` file and fill in your API keys and configuration:

```bash
# The .env file contains placeholders for detected variables
# Edit .env and replace placeholder values with your actual keys
```

### 3. Required Environment Variables

"""
    
    if detected_vars:
        readme_content += "**Detected from your code:**\n"
        for var, placeholder in sorted(detected_vars.items()):
            readme_content += f"- `{var}`: {placeholder.replace('_', ' ').title()}\n"
        readme_content += "\n"
    
    readme_content += """### 4. Run the Application
```bash
python main.py
```

## 📦 Package Contents

- `main.py`: Main application code
- `requirements.txt`: Python dependencies  
- `.env`: Environment variables (fill with your keys)
- `README.md`: This file

## 🔧 Configuration

### Environment Variables
All sensitive data like API keys should be stored in the `.env` file. The application will automatically load these using `python-dotenv`.

### Dependencies
"""
    
    if requirements:
        readme_content += "This application requires the following packages:\n"
        for req in requirements:
            readme_content += f"- {req}\n"
    else:
        readme_content += "This application uses only Python standard library modules.\n"
    
    readme_content += f"""

## 📝 Usage Instructions

{prompt}

## 🛡️ Security Notes

1. **Never commit your `.env` file to version control**
2. Keep your API keys secret and rotate them regularly
3. Use environment-specific `.env` files for different deployments
4. Consider using a secrets management service for production

## 🤝 Support

This MCP was generated automatically. If you need help:
1. Check the `.env` file for required variables
2. Ensure all dependencies are installed
3. Verify your API keys are valid and have proper permissions

---
*Generated by MetaMCP - Your AI-powered MCP Generator*
"""
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(readme_content)

def extract_code_from_response(text: str) -> str:
    m = re.findall(r"```python(.*?)```", text, re.DOTALL | re.IGNORECASE)
    if m:
        return m[0].strip()
    m2 = re.findall(r"```(.*?)```", text, re.DOTALL)
    if m2:
        return m2[0].strip()
    return text.strip()

def enhance_code_with_env_loading(code: str) -> str:
    """Enhance the generated code to properly load environment variables"""
    
    # Check if dotenv is already imported
    has_dotenv = 'from dotenv import load_dotenv' in code or 'import dotenv' in code
    has_os = 'import os' in code
    
    # Add necessary imports at the top
    lines = code.split('\n')
    import_section = []
    other_lines = []
    
    # Separate imports from other code
    in_imports = True
    for line in lines:
        stripped = line.strip()
        if in_imports and (stripped.startswith('import ') or stripped.startswith('from ') or stripped == '' or stripped.startswith('#')):
            import_section.append(line)
        else:
            in_imports = False
            other_lines.append(line)
    
    # Add missing imports
    if not has_os:
        import_section.append('import os')
    if not has_dotenv:
        import_section.append('from dotenv import load_dotenv')
    
    # Add load_dotenv() call
    if not 'load_dotenv()' in code:
        import_section.extend(['', '# Load environment variables', 'load_dotenv()', ''])
    
    # Reconstruct code
    enhanced_code = '\n'.join(import_section + other_lines)
    
    return enhanced_code

def make_zip(files: dict, zip_path: str):
    """Bundle all files into a single zip"""
    with zipfile.ZipFile(zip_path, "w") as zipf:
        for filename, filepath in files.items():
            if os.path.exists(filepath):
                zipf.write(filepath, os.path.basename(filepath))
    return zip_path

# ---------- Routes ----------

@app.post("/generate")
def generate(req: PromptRequest):
    try:
        print(f"Received request: {req.prompt}")  # Debug log
        
        # 1) Call OpenRouter with enhanced prompt
        enhanced_prompt = f"""Generate MCP (Model Context Protocol) code based on: {req.prompt}

Please follow these guidelines:
1. Use environment variables for all API keys, secrets, and configuration
2. Use os.getenv() to load environment variables with sensible defaults where possible
3. Include proper error handling for missing environment variables
4. Add comments explaining what environment variables are needed
5. Structure the code to be production-ready
6. Include proper imports and dependencies"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert MCP (Model Context Protocol) code generator.\n"
                        "Generate production-ready Python code that:\n"
                        "- Uses environment variables for all sensitive data\n"
                        "- Includes proper error handling\n"
                        "- Has clear documentation\n"
                        "- Follows best practices for security\n"
                        "Output ONLY ```python ... ``` fenced code.\n"
                        "Never add extra explanatory text outside the code block.\n"
                    )
                },
                {"role": "user", "content": enhanced_prompt},
            ],
        )

        raw_output = (response.choices[0].message.content or "").strip()
        code_output = extract_code_from_response(raw_output)

        if not code_output:
            return {"error": "The model returned no code."}

        # 2) Enhance the code with proper env loading
        enhanced_code = enhance_code_with_env_loading(code_output)

        # 3) File structure (Keep existing mcp/generated structure)
        save_dir = os.path.join("mcp", "generated")
        os.makedirs(save_dir, exist_ok=True)

        py_path = os.path.join(save_dir, "main.py")  # Always use main.py
        req_path = os.path.join(save_dir, "requirements.txt")
        readme_path = os.path.join(save_dir, "README.md")
        env_path = os.path.join(save_dir, ".env")
        zip_path = os.path.join(save_dir, "mcp_package.zip")

        # 4) Analyze code for requirements and environment variables
        deps = extract_requirements_from_code(enhanced_code)
        detected_vars = extract_api_keys_and_secrets(enhanced_code)
        
        # Add python-dotenv to requirements if not present
        if 'python-dotenv' not in deps:
            deps.append('python-dotenv')

        # 5) Write enhanced files
        with open(py_path, "w", encoding="utf-8") as f:
            f.write(enhanced_code)

        # Write requirements with all dependencies
        all_deps = set(deps)
        if os.path.exists(req_path):
            with open(req_path, "r", encoding="utf-8") as f:
                for line in f:
                    if line.strip():
                        all_deps.add(line.strip())

        with open(req_path, "w", encoding="utf-8") as f:
            f.write("\n".join(sorted(all_deps)))

        # Create enhanced README
        create_enhanced_readme(readme_path, req.prompt, detected_vars, sorted(all_deps))

        # Create enhanced .env file
        create_enhanced_env_file(env_path, detected_vars)

        # 6) Make ZIP
        files = {
            "main.py": py_path,
            "requirements.txt": req_path,
            "README.md": readme_path,
            ".env": env_path,
        }
        make_zip(files, zip_path)
        
        print(f"Generated enhanced files and zip at: {zip_path}")  # Debug log

        # Generate a unique zip filename for download
        download_zip_filename = safe_filename(req.prompt, "_mcp_package.zip")

        return {
            "message": "Enhanced MCP package generated successfully ✅",
            "files": files,
            "zip": zip_path,
            "download_available": True,
            "download_filename": download_zip_filename,
            "preview": enhanced_code[:500] + ("..." if len(enhanced_code) > 500 else ""),
            "detected_env_vars": len(detected_vars),
            "dependencies_count": len(all_deps),
            "env_vars": list(detected_vars.keys()) if detected_vars else []
        }

    except Exception as e:
        print(f"Error: {str(e)}")  # Debug log
        return {"error": str(e)}

@app.get("/download_zip")
def download_zip():
    """Download the latest generated zip file"""
    save_dir = os.path.join("mcp", "generated")
    zip_path = os.path.join(save_dir, "mcp_package.zip")
    
    print(f"Download requested for: {zip_path}")  # Debug log
    
    if os.path.exists(zip_path):
        # Generate a timestamped filename
        timestamp = int(time.time())
        download_filename = f"mcp_package_{timestamp}.zip"
            
        print(f"Serving file as: {download_filename}")  # Debug log
        
        return FileResponse(
            path=zip_path,
            filename=download_filename,
            media_type='application/zip',
            headers={
                "Content-Disposition": f"attachment; filename={download_filename}",
                "Cache-Control": "no-cache"
            }
        )
    
    return {"error": "No zip file found. Generate one first."}

@app.get("/")
def root():
    return {"message": "MetaMCP Backend is running 🚀"}