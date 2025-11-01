import { useState, useEffect } from 'react';
import { Code, BarChart3, Settings as SettingsIcon, Trophy, BookOpen, User, Target } from 'lucide-react';
import CodeEditor from './components/CodeEditor';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import LearningDashboard from './components/LearningDashboard';
import Leaderboard from './components/Leaderboard';
import LearningLibrary from './components/LearningLibrary';
import UserProfile from './components/UserProfile';
import ChallengeView from './components/ChallengeView';
import { db } from './lib/database';
import { isMock } from './lib/supabase';
import { gamificationService } from './lib/gamification';

type View = 'editor' | 'dashboard' | 'settings' | 'learn' | 'leaderboard' | 'library' | 'profile' | 'challenge';

function App() {
  const [currentView, setCurrentView] = useState<View>('learn');
  const [sessionId, setSessionId] = useState<string>('');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState<string>('// Start typing your code here...\n');
  const [userId, setUserId] = useState<string>('demo-user-123');
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>('');

  useEffect(() => {
    initializeSession();
    initializeUser();
  }, []);

  async function initializeUser() {
    try {
      let profile = await gamificationService.getProfile(userId);
      if (!profile) {
        profile = await gamificationService.createProfile(userId, 'demo_user', {
          full_name: 'Demo User',
          bio: 'Learning to code with AI assistance',
        });
      }

      let progress = await gamificationService.getProgress(userId);
      if (!progress) {
        await gamificationService.initializeProgress(userId);
      }
    } catch (error) {
      console.error('Error initializing user:', error);
    }
  }

  // Save code before switching views
  useEffect(() => {
    if (currentView !== 'editor' && sessionId && code) {
      localStorage.setItem(getStorageKey(sessionId, language), code);
    }
  }, [currentView, sessionId, code, language]);

  async function initializeSession() {
    try {
      // Try to get existing session ID from localStorage
      let existingSessionId = localStorage.getItem('current-session-id');
      
      if (existingSessionId) {
        // Use existing session
        setSessionId(existingSessionId);
        const saved = localStorage.getItem(getStorageKey(existingSessionId, language));
        if (saved != null) {
          setCode(saved);
        }
      } else {
        // Create new session
        const session = await db.sessions.create(language, 'AI Code Editor Demo');
        setSessionId(session.id);
        localStorage.setItem('current-session-id', session.id);
        
        // Try to load any existing code for this session
        const saved = localStorage.getItem(getStorageKey(session.id, language));
        if (saved != null) {
          setCode(saved);
        }
      }
    } catch (error) {
      console.error('Error creating session:', error);
    }
  }

  function getDefaultCode(lang: string): string {
    const defaults: Record<string, string> = {
      javascript: '// Start typing your code here...\nconsole.log("Hello, World!");',
      typescript: '// Start typing your code here...\nconsole.log("Hello, World!");',
      python: '# Start typing your code here...\nprint("Hello, World!")',
      java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
      go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
      html: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Hello World</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n    <p>Welcome to HTML editing!</p>\n</body>\n</html>',
      css: '/* Add your CSS styles here */\nbody {\n    font-family: Arial, sans-serif;\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    color: white;\n    padding: 20px;\n}\n\nh1 {\n    text-align: center;\n    font-size: 2.5rem;\n}\n\n.container {\n    display: flex;\n    gap: 20px;\n    margin-top: 20px;\n}\n\n.box {\n    background: rgba(255, 255, 255, 0.2);\n    padding: 20px;\n    border-radius: 10px;\n    flex: 1;\n}',
    };
    return defaults[lang] || '// Start typing your code here...\n';
  }

  async function handleLanguageChange(newLanguage: string) {
    // Save current code before switching language
    if (sessionId && code) {
      localStorage.setItem(getStorageKey(sessionId, language), code);
    }
    
    setLanguage(newLanguage);
    if (sessionId) {
      await db.sessions.update(sessionId, { language: newLanguage });
    }
    
    // Load code for new language or use default
    const saved = sessionId ? localStorage.getItem(getStorageKey(sessionId, newLanguage)) : null;
    if (saved != null) {
      setCode(saved);
    } else {
      setCode(getDefaultCode(newLanguage));
    }
  }

  function handleCodeChange(newCode: string) {
    setCode(newCode);
    if (sessionId) {
      localStorage.setItem(getStorageKey(sessionId, language), newCode);
      // optional: mirror to mock DB for analytics if desired
      db.codeContext.create(sessionId, newCode, language);
    }
  }

  function getStorageKey(sessId: string, lang: string) {
    return `editor-code:${sessId}:${lang}`;
  }

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      {isMock && (
        <div className="bg-amber-500 text-black text-center text-sm py-1">
          Running with in-memory mock database (no Supabase env vars)
        </div>
      )}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Code Editor</h1>
              <p className="text-xs text-slate-400">Context-aware coding assistant</p>
            </div>
          </div>

          <nav className="flex gap-2">
            <button
              onClick={() => setCurrentView('learn')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'learn'
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Target className="w-4 h-4" />
              Learn
            </button>
            <button
              onClick={() => setCurrentView('library')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'library'
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Library
            </button>
            <button
              onClick={() => setCurrentView('leaderboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'leaderboard'
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Trophy className="w-4 h-4" />
              Leaderboard
            </button>
            <button
              onClick={() => setCurrentView('editor')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'editor'
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Code className="w-4 h-4" />
              Editor
            </button>
            <button
              onClick={() => setCurrentView('profile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'profile'
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <User className="w-4 h-4" />
              Profile
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
            <button
              onClick={() => setCurrentView('settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'settings'
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              Settings
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        {currentView === 'learn' && <LearningDashboard userId={userId} />}
        {currentView === 'library' && (
          <LearningLibrary
            userId={userId}
            onSelectLesson={(lessonId) => {
              setSelectedChallengeId(lessonId);
              setCurrentView('challenge');
            }}
          />
        )}
        {currentView === 'leaderboard' && <Leaderboard />}
        {currentView === 'editor' && sessionId && (
          <CodeEditor
            sessionId={sessionId}
            language={language}
            code={code}
            onCodeChange={handleCodeChange}
            onLanguageChange={handleLanguageChange}
          />
        )}
        {currentView === 'profile' && <UserProfile userId={userId} />}
        {currentView === 'challenge' && selectedChallengeId && (
          <ChallengeView
            challengeId={selectedChallengeId}
            userId={userId}
            onComplete={() => setCurrentView('learn')}
          />
        )}
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'settings' && <Settings />}
      </main>
    </div>
  );
}

export default App;
