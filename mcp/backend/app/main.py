
# import os
# import re
# import time
# import sys
# import subprocess
# from typing import List, Set

# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from dotenv import load_dotenv
# from openai import OpenAI

# # Load .env
# load_dotenv()

# app = FastAPI()

# # Allow frontend to talk to backend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# class PromptRequest(BaseModel):
#     prompt: str

# # Init OpenRouter client
# client = OpenAI(
#     api_key=os.getenv("OPENROUTER_API_KEY"),
#     base_url="https://openrouter.ai/api/v1",
# )

# # ---------- Helpers ----------

# def safe_filename(prompt: str, extension: str = ".py") -> str:
#     """Create a short, unique, filesystem-safe filename from the prompt."""
#     words = prompt.split()[:5]
#     short = "_".join(words)
#     short = re.sub(r"[^a-zA-Z0-9_]", "", short).lower() or "generated_mcp"
#     unique = str(int(time.time()))
#     return f"{short}_{unique}{extension}"

# # Basic stdlib filter using Python's known stdlib names + a few common aliases.
# # Python 3.10+ has sys.stdlib_module_names; for safety we fall back if missing.
# _STDLIB: Set[str] = set(getattr(sys, "stdlib_module_names", set())) or {
#     # Common stdlib modules (fallback list; not exhaustive but safe)
#     "abc","argparse","asyncio","base64","collections","concurrent","contextlib","copy",
#     "csv","ctypes","datetime","decimal","enum","functools","glob","gzip","hashlib","heapq",
#     "html","http","importlib","io","itertools","json","logging","math","multiprocessing",
#     "numbers","operator","os","pathlib","pickle","platform","plistlib","queue","random",
#     "re","sched","secrets","shutil","signal","socket","sqlite3","statistics","string",
#     "struct","subprocess","sys","tempfile","textwrap","threading","time","timeit","typing",
#     "uuid","unittest","urllib","warnings","weakref","xml","zipfile"
# }

# # Some external packages have top-level names that differ from the pip name;
# # handle a few common mappings here if needed later.
# _PIP_NAME_OVERRIDES = {
#     # "PIL": "Pillow",
# }

# def _top_level_module(name: str) -> str:
#     """Reduce 'pkg.sub.mod as alias' → 'pkg'."""
#     name = name.strip()
#     if " as " in name:
#         name = name.split(" as ", 1)[0]
#     if "." in name:
#         name = name.split(".", 1)[0]
#     return name.strip()

# def extract_requirements_from_code(code: str) -> List[str]:
#     """
#     Parse import lines from code and return a list of non-stdlib top-level packages.
#     Handles:
#       - import a, b, c
#       - import a as x
#       - from a import b
#       - from a.b import c
#     """
#     reqs: Set[str] = set()

#     for raw in code.splitlines():
#         line = raw.strip()
#         if not line or line.startswith("#"):
#             continue

#         if line.startswith("import "):
#             modules = line[len("import "):].split(",")
#             for m in modules:
#                 top = _top_level_module(m)
#                 if top and top not in _STDLIB and top.isidentifier():
#                     reqs.add(_PIP_NAME_OVERRIDES.get(top, top))

#         elif line.startswith("from "):
#             # from a.b import c → a
#             after_from = line[len("from "):]
#             pkg = after_from.split(" import ")[0].strip()
#             top = _top_level_module(pkg)
#             if top and top not in _STDLIB and top.isidentifier():
#                 reqs.add(_PIP_NAME_OVERRIDES.get(top, top))

#     # Very common external libs might be used via strings; keep as-is if imported.
#     return sorted(reqs)

# def extract_code_from_response(text: str) -> str:
#     """
#     Prefer ```python ... ``` fenced blocks; fall back to generic ``` ... ```.
#     If none, return the raw text.
#     """
#     m = re.findall(r"```python(.*?)```", text, re.DOTALL | re.IGNORECASE)
#     if m:
#         return m[0].strip()
#     m2 = re.findall(r"```(.*?)```", text, re.DOTALL)
#     if m2:
#         return m2[0].strip()
#     return text.strip()

# # ---------- Routes ----------

# @app.post("/generate")
# def generate(req: PromptRequest):
#     try:
#         # 1) Call OpenRouter to generate code
#         response = client.chat.completions.create(
#             model="gpt-4o-mini",
#             messages=[
#                 {
#                     "role": "system",
#                     "content": (
#                         "You are an AI code generator.\n"
#                         "Your job is to produce COMPLETE, runnable Python programs "
#                         "from natural language prompts.\n\n"

#                         "⚠️ Output Rules:\n"
#                         "- You MUST output only a single fenced code block: ```python ... ```.\n"
#                         "- Do NOT include explanations, text, or comments outside the code block.\n"
#                         "- Inside the code block, only include real Python code. "
#                         "Avoid markdown, placeholders, or explanatory comments that break execution.\n\n"

#                         "💡 Coding Rules:\n"
#                         "1. Always implement a working solution, not just placeholders.\n"
#                         "2. If the request is vague (e.g., 'todo list', 'weekly schedule'), "
#                         "make a small but functional CLI app with menus or options.\n"
#                         "3. Prefer clarity and structure: use functions or classes if useful.\n"
#                         "4. If persistence is relevant (e.g., todo list), use JSON or CSV storage.\n"
#                         "5. ✅ IMPORTANT: If a prompt requires external data (like weather, news, stocks):\n"
#                             "   - First try open-source datasets, public/free APIs, or built-in libraries.\n"
#                             "   - If that's not possible, only then include an API key, but use a safe placeholder "
#                             "like 'YOUR_API_KEY' instead of a real one.\n"
#                             "   - The code must still run without crashing when no API key is present.\n"
#                         "6. Ensure the script runs with `python file.py` without modification."
#                     )
#                 },

#                 {"role": "user", "content": f"Generate MCP code based on: {req.prompt}"},
#             ],
#         )

#         raw_output = (response.choices[0].message.content or "").strip()
#         code_output = extract_code_from_response(raw_output)

#         if not code_output:
#             return {"error": "The model returned no code."}

#         # 2) Prepare filesystem layout
#         save_dir = os.path.join("mcp", "generated")
#         os.makedirs(save_dir, exist_ok=True)

#         py_path = os.path.join(save_dir, safe_filename(req.prompt, ".py"))
#         req_path = os.path.join(save_dir, "requirements.txt")
#         readme_path = os.path.join(save_dir, "README.md")

#         # 3) Write code file
#         with open(py_path, "w", encoding="utf-8") as f:
#             f.write(code_output)

#         # 4) Extract & install dependencies
#         deps = extract_requirements_from_code(code_output)

#         # Write requirements.txt (overwrite with latest set)
#         # with open(req_path, "w", encoding="utf-8") as f:
#         #     f.write("\n".join(deps))

#         # Merge with existing requirements.txt if it exists
#         existing_deps = set()
#         if os.path.exists(req_path):
#             with open(req_path, "r", encoding="utf-8") as f:
#                 for line in f:
#                     pkg = line.strip()
#                     if pkg:
#                         existing_deps.add(pkg)

#         all_deps = sorted(existing_deps.union(deps))

# # Write back updated requirements.txt
#         with open(req_path, "w", encoding="utf-8") as f:
#             f.write("\n".join(all_deps))


#         install_stdout = ""
#         install_stderr = ""
#         if deps:
#             # Install into current interpreter's environment
#             try:
#                 proc = subprocess.run(
#                     [sys.executable, "-m", "pip", "install", "-r", req_path],
#                     capture_output=True,
#                     text=True,
#                     check=False,     # don't hard-fail the whole request; report below
#                 )
#                 install_stdout = proc.stdout.strip()
#                 install_stderr = proc.stderr.strip()
#             except Exception as install_exc:
#                 install_stderr = f"pip install raised: {install_exc}"

#         # 5) Test-run the generated script (short timeout)
#         try:
#             run_result = subprocess.run(
#                 [sys.executable, py_path],
#                 capture_output=True,
#                 text=True,
#                 timeout=12,  # guard against infinite loops
#             )
#             test_output = {
#                 "stdout": run_result.stdout.strip(),
#                 "stderr": run_result.stderr.strip(),
#             }
#         except Exception as run_err:
#             test_output = {"error": str(run_err)}

#         # 6) Write README (truncate very long prompts)
#         prompt_preview = (req.prompt[:200] + "…") if len(req.prompt) > 200 else req.prompt
#         with open(readme_path, "w", encoding="utf-8") as f:
#             f.write(f"# MCP\n\n")
#             f.write(f"**Prompt:** {prompt_preview}\n\n")
#             f.write("This MCP was auto-generated by MetaMCP.\n\n")
#             f.write("## Run\n")
#             f.write(f"```bash\npython {os.path.basename(py_path)}\n```\n")

#         return {
#             "message": "MCP generated successfully ✅",
#             "files": {
#                 "python_file": py_path,
#                 "requirements": req_path,
#                 "readme": readme_path,
#             },
#             "preview": code_output[:500] + ("..." if len(code_output) > 500 else ""),
#             "install": {
#                 "attempted": bool(deps),
#                 "deps": deps,
#                 "stdout": install_stdout,
#                 "stderr": install_stderr,
#             },
#             "test_run": test_output,
#         }

#     except Exception as e:
#         return {"error": str(e)}

# @app.get("/")
# def root():
#     return {"message": "MetaMCP Backend is running 🚀"}

import os
import re
import time
import sys
import subprocess
import zipfile
from typing import List, Set

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

_PIP_NAME_OVERRIDES = {}

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

def extract_code_from_response(text: str) -> str:
    m = re.findall(r"```python(.*?)```", text, re.DOTALL | re.IGNORECASE)
    if m:
        return m[0].strip()
    m2 = re.findall(r"```(.*?)```", text, re.DOTALL)
    if m2:
        return m2[0].strip()
    return text.strip()

def create_env_file(path: str):
    """Create a .env file with placeholders for API keys"""
    env_content = (
        "# Environment Variables\n"
        "API_KEY=YOUR_API_KEY_HERE\n"
        "SECRET_KEY=YOUR_SECRET_KEY_HERE\n"
    )
    with open(path, "w", encoding="utf-8") as f:
        f.write(env_content)

def make_zip(files: dict, zip_path: str):
    """Bundle all files into a single zip"""
    with zipfile.ZipFile(zip_path, "w") as zipf:
        for f in files.values():
            if os.path.exists(f):
                zipf.write(f, os.path.basename(f))
    return zip_path

# ---------- Routes ----------

@app.post("/generate")
def generate(req: PromptRequest):
    try:
        print(f"Received request: {req.prompt}")  # Debug log
        
        # 1) Call OpenRouter
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an AI code generator.\n"
                        "Output ONLY ```python ... ``` fenced code.\n"
                        "Never add extra text.\n"
                    )
                },
                {"role": "user", "content": f"Generate MCP code based on: {req.prompt}"},
            ],
        )

        raw_output = (response.choices[0].message.content or "").strip()
        code_output = extract_code_from_response(raw_output)

        if not code_output:
            return {"error": "The model returned no code."}

        # 2) File structure (Keep existing mcp/generated structure)
        save_dir = os.path.join("mcp", "generated")
        os.makedirs(save_dir, exist_ok=True)

        py_path = os.path.join(save_dir, safe_filename(req.prompt, ".py"))
        req_path = os.path.join(save_dir, "requirements.txt")
        readme_path = os.path.join(save_dir, "README.md")
        env_path = os.path.join(save_dir, ".env")
        zip_path = os.path.join(save_dir, "mcp_package.zip")

        # 3) Write files
        with open(py_path, "w", encoding="utf-8") as f:
            f.write(code_output)

        deps = extract_requirements_from_code(code_output)

        all_deps = set()
        if os.path.exists(req_path):
            with open(req_path, "r", encoding="utf-8") as f:
                for line in f:
                    if line.strip():
                        all_deps.add(line.strip())
        all_deps.update(deps)

        with open(req_path, "w", encoding="utf-8") as f:
            f.write("\n".join(sorted(all_deps)))

        with open(readme_path, "w", encoding="utf-8") as f:
            f.write(f"# MCP\n\nPrompt: {req.prompt}\n\nGenerated by MetaMCP.\n")

        create_env_file(env_path)

        # 4) Make ZIP
        files = {
            "python_file": py_path,
            "requirements": req_path,
            "readme": readme_path,
            "env": env_path,
        }
        make_zip(files, zip_path)
        
        print(f"Generated files and zip at: {zip_path}")  # Debug log

        # Generate a unique zip filename for download
        download_zip_filename = safe_filename(req.prompt, "_package.zip")

        return {
            "message": "MCP generated successfully ✅",
            "files": files,
            "zip": zip_path,
            "download_available": True,
            "download_filename": download_zip_filename,
            "preview": code_output[:500] + ("..." if len(code_output) > 500 else "")
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
        # Get the most recent python file to generate a better filename
        try:
            py_files = [f for f in os.listdir(save_dir) if f.endswith('.py')]
            if py_files:
                # Use the most recent .py file name for the zip
                latest_py = max(py_files, key=lambda x: os.path.getctime(os.path.join(save_dir, x)))
                download_filename = latest_py.replace('.py', '_package.zip')
            else:
                download_filename = "mcp_package.zip"
        except:
            download_filename = "mcp_package.zip"
            
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