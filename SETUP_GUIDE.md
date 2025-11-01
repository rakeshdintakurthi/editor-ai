# Complete Setup Guide - AI Code Editor

## Required Software & Installation

### 1. Node.js (Required for Frontend & Backend)
- **Download**: https://nodejs.org/
- **Version**: 18.x or higher
- **Verify**: `node --version` and `npm --version`

### 2. Python (For Python Code Execution)
- **Download**: https://www.python.org/downloads/
- **Version**: 3.8 or higher
- **Important**: Check "Add Python to PATH" during installation
- **Verify**: `python --version`

#### Python Package Installation
```bash
# Install common packages (optional, for your Python code)
pip install numpy pandas matplotlib requests
```

### 3. Java JDK (For Java Code Execution)
- **Download**: https://www.oracle.com/java/technologies/downloads/
- **Alternative**: https://adoptium.net/ (OpenJDK)
- **Version**: JDK 11 or higher
- **Important**: Set JAVA_HOME environment variable
- **Verify**: `javac -version` and `java -version`

### 4. GCC Compiler (For C/C++ Code Execution)

#### Windows - MSYS2 (Recommended)
1. **Download**: https://www.msys2.org/
2. **Install** MSYS2
3. **Open MSYS2 terminal** and run:
   ```bash
   pacman -S mingw-w64-x86_64-gcc
   ```
4. **Add to PATH**: `C:\msys64\mingw64\bin`
5. **Verify**: `gcc --version` and `g++ --version`

#### Alternative - TDM-GCC
- **Download**: https://jmeubank.github.io/tdm-gcc/
- Easier installer, includes C and C++

### 5. Go (For Go Code Execution)
- **Download**: https://go.dev/dl/
- **Version**: 1.18 or higher
- **Verify**: `go version`

### 6. C# Compiler (Optional, for C# Code Execution)
- **Download**: https://dotnet.microsoft.com/download
- Install .NET SDK
- **Verify**: `dotnet --version`

---

## Project Setup

### 1. Install Project Dependencies

```bash
# Navigate to project directory
cd ai-code-editor

# Install Node.js dependencies
npm install
```

### 2. Environment Variables Setup

Create a `.env` file in the root directory:

```env
# Gemini AI API Key (for chat assistant)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI API Key (for code suggestions)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration (optional, uses mock DB if not set)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Get API Keys:
- **Gemini API**: https://makersuite.google.com/app/apikey
- **OpenAI API**: https://platform.openai.com/api-keys
- **Supabase**: https://supabase.com/ (create a project)

### 3. Run the Application

**Terminal 1 - Backend Server:**
```bash
npm run server
```

**Terminal 2 - Frontend Dev Server:**
```bash
npm run dev
```

**Access**: Open browser to `http://localhost:5173`

---

## Package Dependencies

### Frontend Dependencies (package.json)
```json
{
  "dependencies": {
    "@monaco-editor/react": "^4.7.0",      // Code editor
    "@supabase/supabase-js": "^2.57.4",    // Database client
    "lucide-react": "^0.344.0",            // Icons
    "react": "^18.3.1",                     // UI framework
    "react-dom": "^18.3.1"                  // React DOM
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",      // Vite React plugin
    "autoprefixer": "^10.4.18",            // CSS autoprefixer
    "tailwindcss": "^3.4.1",               // CSS framework
    "typescript": "^5.5.3",                 // TypeScript
    "vite": "^5.4.2"                        // Build tool
  }
}
```

### Backend Dependencies
```json
{
  "dependencies": {
    "express": "^5.1.0",                    // Web framework
    "cors": "^2.8.5",                       // CORS middleware
    "dotenv": "^17.2.3"                     // Environment variables
  }
}
```

---

## Adding System PATH (Windows)

### Method 1: Using System Properties
1. Press `Windows + R`
2. Type: `sysdm.cpl` and press Enter
3. Go to "Advanced" tab
4. Click "Environment Variables"
5. Under "System variables", find and select `Path`
6. Click "Edit"
7. Click "New"
8. Add the path (see below)
9. Click "OK" on all windows
10. **Restart** your terminal/IDE

### Paths to Add:

```
# Python
C:\Users\YourUsername\AppData\Local\Programs\Python\Python312
C:\Users\YourUsername\AppData\Local\Programs\Python\Python312\Scripts

# Java
C:\Program Files\Java\jdk-21\bin

# GCC (MSYS2)
C:\msys64\mingw64\bin

# Go
C:\Program Files\Go\bin

# Node.js (usually added automatically)
C:\Program Files\nodejs
```

### Method 2: Using PowerShell (Temporary)
```powershell
# Add to current session only
$env:Path += ";C:\msys64\mingw64\bin"
```

---

## Python Packages for Common Use Cases

### Data Science
```bash
pip install numpy pandas matplotlib seaborn scikit-learn
```

### Web Development
```bash
pip install flask django requests beautifulsoup4
```

### Machine Learning
```bash
pip install tensorflow pytorch transformers
```

### General Utilities
```bash
pip install pillow opencv-python pyyaml
```

---

## Troubleshooting

### Issue: "Command not found" errors
**Solution**: Make sure the compiler/interpreter is in your PATH and restart your terminal

### Issue: Java compilation fails
**Solution**: 
1. Verify Java JDK is installed: `javac -version`
2. Make sure your Java code has a class with the same name as the file
3. Check for syntax errors

### Issue: Python module not found
**Solution**: Install the module using pip:
```bash
pip install module_name
```

### Issue: GCC not found
**Solution**: 
1. Install MSYS2 and GCC
2. Add `C:\msys64\mingw64\bin` to PATH
3. Restart terminal

### Issue: Port 5000 or 5173 already in use
**Solution**: 
```bash
# Windows - Kill process on port
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## Verification Commands

Run these to verify everything is installed:

```bash
# Node.js
node --version
npm --version

# Python
python --version
pip --version

# Java
javac -version
java -version

# GCC (C/C++)
gcc --version
g++ --version

# Go
go version

# .NET (C#)
dotnet --version
```

---

## Project Structure

```
ai-code-editor/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── lib/               # Utilities and services
│   ├── App.tsx            # Main app
│   └── main.tsx           # Entry point
├── server.js              # Backend server
├── temp/                  # Temporary code execution files
├── package.json           # Node dependencies
├── .env                   # Environment variables
├── vite.config.ts         # Vite configuration
└── tailwind.config.js     # Tailwind CSS config
```

---

## Quick Start Checklist

- [ ] Install Node.js
- [ ] Install Python (add to PATH)
- [ ] Install Java JDK (add to PATH)
- [ ] Install GCC/MinGW (add to PATH)
- [ ] Install Go (add to PATH)
- [ ] Clone/download project
- [ ] Run `npm install`
- [ ] Create `.env` file with API keys
- [ ] Run `npm run server` (Terminal 1)
- [ ] Run `npm run dev` (Terminal 2)
- [ ] Open `http://localhost:5173`
- [ ] Test each language!

---

## Support

For issues, check:
1. All compilers are in PATH
2. Terminal is restarted after PATH changes
3. API keys are correctly set in `.env`
4. Both servers (backend & frontend) are running

Happy Coding! 🚀
