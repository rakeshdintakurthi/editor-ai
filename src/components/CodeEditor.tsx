import { useRef, useState, useEffect } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { aiService, AIRequest } from '../lib/aiService';
import { db } from '../lib/database';
import { Sparkles, Loader2, ExternalLink, Terminal, X } from 'lucide-react';
import GeminiAssistant from './GeminiAssistant';

interface CodeEditorProps {
  sessionId: string;
  language: string;
  code: string;
  onCodeChange: (code: string) => void;
  onLanguageChange: (lang: string) => void;
}

export default function CodeEditor({ sessionId, language, code, onCodeChange, onLanguageChange }: CodeEditorProps) {
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [suggestion, setSuggestion] = useState<{
    text: string;
    explanation: string;
    line: number;
    column: number;
    type: string;
  } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [runOutput, setRunOutput] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [splitWidth, setSplitWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [programInput, setProgramInput] = useState('');
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const terminalInputRef = useRef<HTMLInputElement | null>(null);

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'go', label: 'Go' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
  ];

  const isWebLanguage = language === 'html' || language === 'css';

  // Auto-update preview for HTML/CSS
  useEffect(() => {
    if (isWebLanguage && code) {
      const timer = setTimeout(() => {
        updatePreview();
      }, 500); // Debounce 500ms
      return () => clearTimeout(timer);
    }
  }, [code, language]);

  // Handle drag for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        setSplitWidth(Math.min(Math.max(newWidth, 20), 80));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  function handleEditorDidMount(editor: editor.IStandaloneCodeEditor, monaco: Monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, () => {
      handleManualSuggestion('completion');
    });

    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyD, () => {
      handleManualSuggestion('docstring');
    });

    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyO, () => {
      handleManualSuggestion('optimization');
    });

    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyB, () => {
      handleManualSuggestion('debug');
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (suggestion) {
        applySuggestion();
      }
    });
  }

  async function handleManualSuggestion(requestType: AIRequest['requestType']) {
    if (!editorRef.current || isAIProcessing) return;

    const editor = editorRef.current;
    const position = editor.getPosition();
    const code = editor.getValue();

    if (!position) return;

    await getSuggestion(code, position, requestType);
  }

  async function getSuggestion(
    currentCode: string,
    position: { lineNumber: number; column: number },
    requestType: AIRequest['requestType']
  ) {
    setIsAIProcessing(true);
    const startTime = Date.now();

    try {
      const lines = currentCode.split('\n');
      const currentLine = lines[position.lineNumber - 1] || '';
      const surroundingCode = lines
        .slice(Math.max(0, position.lineNumber - 5), position.lineNumber + 5)
        .join('\n');

      const request: AIRequest = {
        code: surroundingCode,
        language,
        cursorPosition: { line: position.lineNumber, column: position.column },
        requestType,
      };

      const response = await aiService.getSuggestion(request);
      const latency = Date.now() - startTime;

      await db.suggestions.create({
        session_id: sessionId,
        suggestion_type: requestType,
        original_code: currentLine,
        suggested_code: response.suggestion,
        explanation: response.explanation,
        issue_detected: response.issue_detected,
        language,
        line_number: position.lineNumber,
        accepted: false,
        latency_ms: latency,
      });

      await db.sessions.incrementSuggestions(sessionId, false);

      setSuggestion({
        text: response.suggestion,
        explanation: response.explanation,
        line: position.lineNumber,
        column: position.column,
        type: requestType,
      });
    } catch (error) {
      console.error('Error getting suggestion:', error);
    } finally {
      setIsAIProcessing(false);
    }
  }

  function applySuggestion() {
    if (!editorRef.current || !suggestion) return;

    const editor = editorRef.current;
    const position = editor.getPosition();

    if (position) {
      editor.executeEdits('ai-suggestion', [
        {
          range: new monacoRef.current!.Range(
            suggestion.line,
            1,
            suggestion.line,
            suggestion.column + 100
          ),
          text: suggestion.text,
        },
      ]);

      db.sessions.incrementSuggestions(sessionId, true);
      setSuggestion(null);
    }
  }

  function dismissSuggestion() {
    setSuggestion(null);
  }

  function handleEditorChange(value: string | undefined) {
    const newCode = value || '';
    onCodeChange(newCode);
  }

  function stringifyForOutput(value: unknown): string {
    try {
      if (typeof value === 'string') return value;
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }

  function updatePreview() {
    if (language === 'html') {
      setPreviewHtml(code);
    } else if (language === 'css') {
      const sampleHTML = `
<!DOCTYPE html>
<html>
<head>
<style>
${code}
</style>
</head>
<body>
<h1>CSS Preview</h1>
<p>This is a paragraph to demonstrate your CSS styles.</p>
<button>Sample Button</button>
<div class="container">
  <div class="box">Box 1</div>
  <div class="box">Box 2</div>
  <div class="box">Box 3</div>
</div>
</body>
</html>`;
      setPreviewHtml(sampleHTML);
    }
  }

  function openInNewTab() {
    const htmlContent = language === 'html' ? code : previewHtml;
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    }
  }

  function handleTerminalCommand(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && terminalInput.trim()) {
      const command = terminalInput.trim();
      setTerminalHistory(prev => [...prev, `> ${command}`]);
      
      // Execute command
      executeTerminalCommand(command);
      setTerminalInput('');
    }
  }

  async function executeTerminalCommand(command: string) {
    try {
      // Check if it's a pip command
      if (command.startsWith('pip ')) {
        setTerminalHistory(prev => [...prev, 'Executing pip command...']);
        
        const response = await fetch('http://localhost:5000/api/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: command, language: 'terminal' }),
        });
        
        const result = await response.json();
        setTerminalHistory(prev => [...prev, result.output || result.error || 'Command executed']);
      }
      // Check if it's a node/npm command
      else if (command.startsWith('npm ') || command.startsWith('node ')) {
        setTerminalHistory(prev => [...prev, 'Executing Node command...']);
        
        const response = await fetch('http://localhost:5000/api/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: command, language: 'terminal' }),
        });
        
        const result = await response.json();
        setTerminalHistory(prev => [...prev, result.output || result.error || 'Command executed']);
      }
      // Other commands
      else {
        setTerminalHistory(prev => [...prev, `Command not supported: ${command}`]);
        setTerminalHistory(prev => [...prev, 'Supported: pip, npm, node, python -m pip']);
      }
    } catch (error) {
      setTerminalHistory(prev => [...prev, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    }
  }

  function clearTerminal() {
    setTerminalHistory([]);
  }

  async function runCurrentCode() {
    setIsRunning(true);
    setRunOutput('');
    
    try {
      // For HTML, render in iframe
      if (language === 'html') {
        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'width: 100%; height: 400px; border: 1px solid #444; border-radius: 4px; background: white;';
        iframe.srcdoc = code;
        
        const container = document.createElement('div');
        container.appendChild(iframe);
        setRunOutput(container.innerHTML);
      }
      // For CSS, show preview with sample HTML
      else if (language === 'css') {
        const sampleHTML = `
<!DOCTYPE html>
<html>
<head>
<style>
${code}
</style>
</head>
<body>
<h1>CSS Preview</h1>
<p>This is a paragraph to demonstrate your CSS styles.</p>
<button>Sample Button</button>
<div class="container">
  <div class="box">Box 1</div>
  <div class="box">Box 2</div>
  <div class="box">Box 3</div>
</div>
</body>
</html>`;
        
        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'width: 100%; height: 400px; border: 1px solid #444; border-radius: 4px; background: white;';
        iframe.srcdoc = sampleHTML;
        
        const container = document.createElement('div');
        container.appendChild(iframe);
        setRunOutput(container.innerHTML);
      }
      // For JavaScript, we can run it in the browser
      else if (language === 'javascript') {
        const logs: string[] = [];
        const originalLog = console.log;
        // Capture console.log
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (console as any).log = (...args: unknown[]) => {
          logs.push(args.map(stringifyForOutput).join(' '));
        };
        let returnValue: unknown;
        try {
          // eslint-disable-next-line no-new-func
          const fn = new Function(code);
          returnValue = fn();
        } finally {
          console.log = originalLog;
        }
        const output = [] as string[];
        if (logs.length) output.push(logs.join('\n'));
        if (typeof returnValue !== 'undefined') {
          output.push(`[return] ${stringifyForOutput(returnValue)}`);
        }
        setRunOutput(output.join('\n') || 'Code executed successfully');
      } 
      // For other languages, use the backend API
      else if (['typescript', 'python', 'java', 'go'].includes(language)) {
        console.log('Sending to backend:', { language, codeLength: code.length, codePreview: code.substring(0, 50) });
        
        const response = await fetch('http://localhost:5000/api/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            code, 
            language,
            input: programInput // Send input data
          }),
        });

        const result = await response.json();
        console.log('Backend response:', result);
        
        if (result.error) {
          setRunOutput(`Error: ${result.error}`);
        } else {
          setRunOutput(result.output || 'Code executed successfully');
        }
      } else {
        setRunOutput(`Run is not supported for ${language} yet.`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setRunOutput(`Error: ${message}`);
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h2 className="text-white font-semibold">AI Code Editor</h2>
          </div>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-slate-700 text-white px-3 py-1.5 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
          {!isWebLanguage && (
            <button
              onClick={runCurrentCode}
              disabled={isRunning}
              className="ml-2 px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm"
            >
              {isRunning ? 'Running…' : 'Run'}
            </button>
          )}
          {isWebLanguage && (
            <button
              onClick={openInNewTab}
              className="ml-2 px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open in New Tab
            </button>
          )}
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className="ml-2 px-4 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white text-sm flex items-center gap-2"
            title="Toggle Terminal"
          >
            <Terminal className="w-4 h-4" />
            Terminal
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <kbd className="px-2 py-1 bg-slate-700 rounded border border-slate-600">Ctrl+Space</kbd>
          <span>Suggest</span>
          <kbd className="px-2 py-1 bg-slate-700 rounded border border-slate-600 ml-3">Alt+D</kbd>
          <span>Docs</span>
          <kbd className="px-2 py-1 bg-slate-700 rounded border border-slate-600 ml-3">Alt+O</kbd>
          <span>Optimize</span>
          <kbd className="px-2 py-1 bg-slate-700 rounded border border-slate-600 ml-3">Alt+B</kbd>
          <span>Debug</span>
        </div>
      </div>

      <div className="flex-1 relative flex" ref={containerRef}>
        {/* Editor Section */}
        <div style={{ width: isWebLanguage ? `${splitWidth}%` : '100%' }} className="relative">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: !isWebLanguage },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              renderWhitespace: 'selection',
              tabSize: 2,
              quickSuggestions: false,
              suggestOnTriggerCharacters: false,
            }}
          />

          {/* Input Panel for Programs - Top Right */}
          {!isWebLanguage && !runOutput && (
            <div className="absolute right-4 top-4 bg-slate-800/95 border border-slate-600 rounded p-3 w-80">
              <div className="flex items-center justify-between mb-2">
                <label className="text-white text-xs font-semibold">Program Input</label>
                <span className="text-slate-400 text-xs">For Scanner, input(), etc.</span>
              </div>
              <textarea
                value={programInput}
                onChange={(e) => setProgramInput(e.target.value)}
                placeholder="Enter input values (one per line)&#10;Example:&#10;John&#10;25"
                className="w-full bg-slate-900 text-white px-3 py-2 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
                rows={4}
              />
              <div className="text-xs text-slate-400 mt-1">
                Each line = one input value
              </div>
            </div>
          )}

          {/* Output Panel - Bottom */}
          {!isWebLanguage && runOutput && (
            <div className="absolute left-4 right-4 bottom-4 bg-black/70 text-green-300 border border-slate-700 rounded p-3 max-h-96 overflow-auto font-mono text-sm whitespace-pre-wrap">
              {runOutput}
            </div>
          )}

          {isAIProcessing && (
            <div className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">AI Thinking...</span>
            </div>
          )}

          {suggestion && !isAIProcessing && (
            <div className="absolute top-4 right-4 bg-slate-800 border border-slate-600 rounded-lg shadow-xl p-4 max-w-md">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-semibold text-white capitalize">
                    {suggestion.type} Suggestion
                  </span>
                </div>
                <button
                  onClick={dismissSuggestion}
                  className="text-slate-400 hover:text-white"
                >
                  ×
                </button>
              </div>
              <div className="bg-slate-900 rounded p-3 mb-3 overflow-x-auto">
                <pre className="text-sm text-green-400">{suggestion.text}</pre>
              </div>
              <p className="text-sm text-slate-300 mb-3">{suggestion.explanation}</p>
              <div className="flex gap-2">
                <button
                  onClick={applySuggestion}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium text-sm transition-colors"
                >
                  Apply (Ctrl+Enter)
                </button>
                <button
                  onClick={dismissSuggestion}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Resizer for HTML/CSS */}
        {isWebLanguage && (
          <div
            className="w-1 bg-slate-700 hover:bg-blue-500 cursor-col-resize transition-colors"
            onMouseDown={() => setIsDragging(true)}
          />
        )}

        {/* Preview Panel for HTML/CSS */}
        {isWebLanguage && (
          <div style={{ width: `${100 - splitWidth}%` }} className="bg-white relative">
            <div className="absolute top-2 right-2 text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
              Live Preview
            </div>
            {previewHtml ? (
              <iframe
                srcDoc={previewHtml}
                title="preview"
                className="w-full h-full border-0"
                sandbox="allow-scripts"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                <p>Preview will appear here...</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Terminal Panel */}
      {showTerminal && (
        <div className="h-64 bg-slate-900 border-t border-slate-700 flex flex-col">
          <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-green-400" />
              <span className="text-white text-sm font-semibold">Terminal</span>
              <span className="text-slate-400 text-xs">Run pip, npm, node commands</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearTerminal}
                className="px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded"
              >
                Clear
              </button>
              <button
                onClick={() => setShowTerminal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
            {terminalHistory.length === 0 ? (
              <div className="text-slate-500">
                <p>Terminal ready. Type commands like:</p>
                <p className="mt-2 text-green-400">pip install numpy pandas</p>
                <p className="text-green-400">npm install lodash</p>
                <p className="text-green-400">python -m pip install requests</p>
              </div>
            ) : (
              terminalHistory.map((line, index) => (
                <div
                  key={index}
                  className={line.startsWith('>') ? 'text-green-400' : 'text-slate-300'}
                >
                  {line}
                </div>
              ))
            )}
          </div>
          
          <div className="bg-slate-800 px-4 py-3 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <span className="text-green-400">$</span>
              <input
                ref={terminalInputRef}
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={handleTerminalCommand}
                placeholder="Type command and press Enter..."
                className="flex-1 bg-slate-900 text-white px-3 py-2 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
    
    <GeminiAssistant code={code} language={language} />
    </>
  );
}
