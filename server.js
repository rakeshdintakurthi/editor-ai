import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to find Java compiler
async function findJavaCompiler() {
  // Try javac in PATH first
  try {
    await execAsync('javac -version');
    return 'javac';
  } catch (error) {
    // Try common Windows Java installation paths
    const commonPaths = [
      'C:\\Program Files\\Java\\jdk-25\\bin\\javac.exe',
      'C:\\Program Files\\Java\\jdk-24\\bin\\javac.exe',
      'C:\\Program Files\\Java\\jdk-23\\bin\\javac.exe',
      'C:\\Program Files\\Java\\jdk-22\\bin\\javac.exe',
      'C:\\Program Files\\Java\\jdk-21\\bin\\javac.exe',
      'C:\\Program Files\\Java\\jdk-20\\bin\\javac.exe',
      'C:\\Program Files\\Java\\jdk-19\\bin\\javac.exe',
      'C:\\Program Files\\Java\\jdk-18\\bin\\javac.exe',
      'C:\\Program Files\\Java\\jdk-17\\bin\\javac.exe',
      'C:\\Program Files\\Java\\jdk-11\\bin\\javac.exe',
      'C:\\Program Files\\Java\\jdk1.8.0_*\\bin\\javac.exe',
      'C:\\Program Files (x86)\\Java\\jdk-17\\bin\\javac.exe',
      'C:\\Program Files (x86)\\Java\\jdk-11\\bin\\javac.exe',
    ];
    
    for (const javaPath of commonPaths) {
      try {
        await execAsync(`"${javaPath}" -version`);
        return `"${javaPath}"`;
      } catch (e) {
        continue;
      }
    }
    
    throw new Error('Java JDK not found. Please install Java JDK and ensure javac is in your PATH.');
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Create temp directory if it doesn't exist
const tempDir = path.join(__dirname, 'temp');

// Cleanup function for temp files
async function cleanupTempFile(filePath) {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error('Error cleaning up temp file:', error);
  }
}

// Root route - Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AI Code Editor - Code Execution Server',
    version: '1.0.0',
    endpoints: {
      execute: 'POST /api/execute',
      health: 'GET /api/health'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Execute code based on language
app.post('/api/execute', async (req, res) => {
  const { code, language, input } = req.body;

  // Debug logging
  console.log('Received request:', { 
    language, 
    codeLength: code?.length,
    hasCode: !!code,
    hasLanguage: !!language,
    hasInput: !!input,
    bodyKeys: Object.keys(req.body)
  });

  if (!code || !language) {
    console.log('ERROR: Missing code or language');
    return res.status(400).json({ error: 'Code and language are required' });
  }

  let tempFile;
  let tempInputFile;
  let command;
  const timestamp = Date.now();

  try {
    switch (language) {
      case 'terminal': {
        // Execute terminal commands directly
        command = code;
        break;
      }

      case 'javascript': {
        tempFile = path.join(tempDir, `temp_${timestamp}.js`);
        await fs.writeFile(tempFile, code);
        command = `node "${tempFile}"`;
        break;
      }

      case 'typescript': {
        tempFile = path.join(tempDir, `temp_${timestamp}.ts`);
        await fs.writeFile(tempFile, code);
        // Use ts-node to execute TypeScript directly
        command = `npx ts-node "${tempFile}"`;
        break;
      }

      case 'python': {
        tempFile = path.join(tempDir, `temp_${timestamp}.py`);
        await fs.writeFile(tempFile, code);
        command = `python "${tempFile}"`;
        break;
      }

      case 'csharp': {
        tempFile = path.join(tempDir, `temp_${timestamp}.cs`);
        await fs.writeFile(tempFile, code);
        // For C#, we need to compile and run
        const exeFile = path.join(tempDir, `temp_${timestamp}.exe`);
        command = `csc /out:"${exeFile}" "${tempFile}" && "${exeFile}"`;
        break;
      }

      case 'java': {
        // For Java, we need to compile and run
        // Extract class name from code - handle various class declarations
        // Matches: public class, class, public final class, abstract class, etc.
        const classNameMatch = code.match(/(?:public\s+)?(?:final\s+)?(?:abstract\s+)?class\s+(\w+)/);
        
        if (!classNameMatch) {
          return res.status(400).json({ 
            error: 'Could not find a class declaration in Java code. Please ensure your code contains a class definition.' 
          });
        }
        
        const className = classNameMatch[1];
        const javaFile = path.join(tempDir, `${className}.java`);
        
        // Write file with correct class name directly
        await fs.writeFile(javaFile, code);
        tempFile = javaFile;
        
        // Find Java compiler
        const javacPath = await findJavaCompiler();
        const javaPath = javacPath.replace('javac', 'java').replace('javac.exe', 'java.exe');
        
        command = `${javacPath} "${javaFile}" && ${javaPath} -cp "${tempDir}" ${className}`;
        break;
      }

      case 'c': {
        tempFile = path.join(tempDir, `temp_${timestamp}.c`);
        const exeFile = path.join(tempDir, `temp_${timestamp}.exe`);
        await fs.writeFile(tempFile, code);
        // Compile with gcc and run
        command = `gcc "${tempFile}" -o "${exeFile}" && "${exeFile}"`;
        break;
      }

      case 'go': {
        tempFile = path.join(tempDir, `temp_${timestamp}.go`);
        await fs.writeFile(tempFile, code);
        // Go can be run directly without compilation step visible to user
        command = `go run "${tempFile}"`;
        break;
      }

      default:
        return res.status(400).json({ error: `Unsupported language: ${language}` });
    }

    console.log(`Executing: ${command}`);

    // Prepare input if provided
    let execOptions = {
      timeout: 10000,
      maxBuffer: 1024 * 1024,
    };

    // If input is provided, write it to a temp file and redirect
    if (input && input.trim()) {
      tempInputFile = path.join(tempDir, `input_${timestamp}.txt`);
      await fs.writeFile(tempInputFile, input);
      command = `${command} < "${tempInputFile}"`;
      console.log(`Using input file: ${tempInputFile}`);
      console.log(`Input content: ${input}`);
    } else {
      console.log('No input provided');
    }

    const { stdout, stderr } = await execAsync(command, execOptions);

    // Cleanup temp files
    if (tempFile) {
      await cleanupTempFile(tempFile);
      // Also cleanup .exe file for C# and C
      if (language === 'csharp' || language === 'c') {
        const exeFile = path.join(tempDir, `temp_${timestamp}.exe`);
        await cleanupTempFile(exeFile);
      }
      // Also cleanup .class file for Java
      if (language === 'java') {
        const classNameMatch = code.match(/(?:public\s+)?(?:final\s+)?(?:abstract\s+)?class\s+(\w+)/);
        if (classNameMatch) {
          const className = classNameMatch[1];
          const classFile = path.join(tempDir, `${className}.class`);
          await cleanupTempFile(classFile);
        }
      }
    }
    // Cleanup input file if used
    if (tempInputFile) {
      await cleanupTempFile(tempInputFile);
    }

    res.json({
      output: stdout || stderr || 'Code executed successfully (no output)',
      error: null,
    });
  } catch (error) {
    // Cleanup temp file on error
    if (tempFile) {
      await cleanupTempFile(tempFile);
      // Also cleanup compiled files on error
      if (language === 'csharp' || language === 'c') {
        const exeFile = path.join(tempDir, `temp_${timestamp}.exe`);
        await cleanupTempFile(exeFile);
      }
      if (language === 'java') {
        const classNameMatch = code.match(/(?:public\s+)?(?:final\s+)?(?:abstract\s+)?class\s+(\w+)/);
        if (classNameMatch) {
          const className = classNameMatch[1];
          const classFile = path.join(tempDir, `${className}.class`);
          await cleanupTempFile(classFile);
        }
      }
    }

    // Better error message formatting
    let errorMessage = error.stderr || error.message || 'Unknown error occurred';
    
    // For compiled languages, extract the actual error from stderr
    if ((language === 'go' || language === 'java' || language === 'c' || language === 'csharp') && error.stderr) {
      const lines = error.stderr.split('\n').filter(line => line.trim());
      errorMessage = lines.join('\n');
    }
    
    // Add helpful hints for common errors
    if (language === 'java' && errorMessage.includes('javac')) {
      errorMessage += '\n\nMake sure Java JDK is installed and in your PATH.';
    }
    if (language === 'c' && errorMessage.includes('gcc')) {
      errorMessage += '\n\nMake sure GCC compiler is installed and in your PATH.';
    }
    if (language === 'python' && errorMessage.includes('python')) {
      errorMessage += '\n\nMake sure Python is installed and in your PATH.';
    }
    
    console.error('Execution error:', errorMessage);
    
    res.json({
      output: '',
      error: errorMessage,
    });
  }
});

// Initialize server
async function startServer() {
  try {
    // Create temp directory
    await fs.mkdir(tempDir, { recursive: true });
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`Code execution server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

startServer();
