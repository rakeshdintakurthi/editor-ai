import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, CheckCircle, XCircle, Clock, Trophy, Code2, Lightbulb } from 'lucide-react';
import { Challenge, gamificationService } from '../lib/gamification';

interface ChallengeViewProps {
  challengeId: string;
  userId: string;
  onComplete?: () => void;
}

export default function ChallengeView({ challengeId, userId, onComplete }: ChallengeViewProps) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'passed' | 'failed'>('idle');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    loadChallenge();
    setStartTime(Date.now());
    timerRef.current = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [challengeId]);

  async function loadChallenge() {
    try {
      const data = await gamificationService.getChallenge(challengeId);
      setChallenge(data);
      setCode(data?.starter_code || '');
    } catch (error) {
      console.error('Error loading challenge:', error);
    }
  }

  async function runCode() {
    if (!challenge) return;

    setIsRunning(true);
    setOutput('');
    setTestResults(null);

    try {
      const response = await fetch('http://localhost:5000/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language: challenge.language,
        }),
      });

      const result = await response.json();

      if (result.error) {
        setOutput(`Error: ${result.error}`);
        setStatus('failed');
      } else {
        setOutput(result.output);
        runTests(result.output);
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setStatus('failed');
    } finally {
      setIsRunning(false);
    }
  }

  function runTests(executionOutput: string) {
    if (!challenge?.test_cases) {
      setStatus('passed');
      return;
    }

    const tests = challenge.test_cases as any[];
    const results = tests.map((test) => {
      const passed = executionOutput.includes(test.expected);
      return {
        name: test.name,
        passed,
        expected: test.expected,
        actual: executionOutput,
      };
    });

    setTestResults(results);

    const allPassed = results.every((r) => r.passed);
    setStatus(allPassed ? 'passed' : 'failed');

    if (allPassed) {
      submitSolution(executionOutput);
    }
  }

  async function submitSolution(executionOutput: string) {
    if (!challenge) return;

    try {
      const executionTime = Math.floor((Date.now() - startTime) / 1000);
      await gamificationService.submitChallenge(
        userId,
        challengeId,
        code,
        'passed',
        testResults,
        executionTime
      );

      if (onComplete) onComplete();
    } catch (error) {
      console.error('Error submitting challenge:', error);
    }
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  if (!challenge) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-400">Loading challenge...</div>
      </div>
    );
  }

  const difficultyColors = {
    easy: 'text-green-400 bg-green-500/20',
    medium: 'text-yellow-400 bg-yellow-500/20',
    hard: 'text-red-400 bg-red-500/20',
  };

  return (
    <div className="h-full flex flex-col bg-slate-900">
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">{challenge.challenge_title}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${difficultyColors[challenge.difficulty as keyof typeof difficultyColors]}`}>
              {challenge.difficulty}
            </span>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
              {challenge.xp_reward} XP
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{formatTime(timeElapsed)}</span>
            </div>
            <span className="text-slate-600">/</span>
            <span className="font-mono">{formatTime(challenge.time_limit_seconds)}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 border-r border-slate-700 overflow-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Description</h2>
            <p className="text-slate-300 mb-6 leading-relaxed">{challenge.description}</p>

            {testResults && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  {status === 'passed' ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  Test Results
                </h2>
                <div className="space-y-2">
                  {testResults.map((result: any, index: number) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        result.passed
                          ? 'bg-green-500/10 border-green-500/30'
                          : 'bg-red-500/10 border-red-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white">{result.name}</span>
                        {result.passed ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400">Expected: {result.expected}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {status === 'passed' && (
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-4 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="w-6 h-6" />
                  <h3 className="font-semibold text-lg">Challenge Complete!</h3>
                </div>
                <p className="text-green-100 text-sm">
                  You earned {challenge.xp_reward} XP! Time: {formatTime(timeElapsed)}
                </p>
              </div>
            )}

            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm mt-4"
            >
              <Lightbulb className="w-4 h-4" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>

            {showHint && (
              <div className="mt-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-200">
                  Think about the problem step by step. Break it down into smaller pieces and tackle each one individually.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="w-1/2 flex flex-col">
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={challenge.language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                automaticLayout: true,
                scrollBeyondLastLine: false,
              }}
            />
          </div>

          <div className="border-t border-slate-700 p-4 bg-slate-800">
            <button
              onClick={runCode}
              disabled={isRunning || status === 'passed'}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run Code
                </>
              )}
            </button>
          </div>

          {output && (
            <div className="border-t border-slate-700 p-4 bg-slate-900 max-h-48 overflow-auto">
              <div className="flex items-center gap-2 mb-2">
                <Code2 className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-semibold text-slate-300">Output:</span>
              </div>
              <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">{output}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
