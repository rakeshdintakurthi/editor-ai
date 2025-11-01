export interface GeminiMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GeminiRequest {
  message: string;
  context?: string;
  language?: string;
  conversationHistory?: GeminiMessage[];
}

export interface GeminiResponse {
  response: string;
  conversationHistory: GeminiMessage[];
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || GEMINI_API_KEY || '';
  }

  private getSystemPrompt(): string {
    return `You are a helpful coding assistant specialized in providing conceptual explanations and guidance to developers. Your role is to:

1. Explain programming concepts clearly and concisely
2. Help developers understand best practices and design patterns
3. Provide architectural guidance and suggestions
4. Answer questions about algorithms, data structures, and software engineering principles
5. Help debug conceptual issues in code logic
6. Suggest improvements and optimizations with explanations

Always be friendly, clear, and educational in your responses. Focus on helping developers learn and understand, not just providing code snippets.`;
  }

  async sendMessage(request: GeminiRequest): Promise<GeminiResponse> {
    if (!this.apiKey) {
      return this.getMockResponse(request);
    }

    try {
      const conversationContext = request.conversationHistory
        ?.map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n\n') || '';

      let prompt = this.getSystemPrompt() + '\n\n';
      
      if (conversationContext) {
        prompt += 'Previous conversation:\n' + conversationContext + '\n\n';
      }

      if (request.context) {
        prompt += `Current code context (${request.language || 'code'}):\n\`\`\`\n${request.context}\n\`\`\`\n\n`;
      }

      prompt += `User question: ${request.message}`;

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';

      const updatedHistory = [
        ...(request.conversationHistory || []),
        { role: 'user' as const, content: request.message },
        { role: 'assistant' as const, content: responseText },
      ];

      return {
        response: responseText,
        conversationHistory: updatedHistory,
      };
    } catch (error) {
      console.error('Gemini Service Error:', error);
      return this.getMockResponse(request);
    }
  }

  private getMockResponse(request: GeminiRequest): GeminiResponse {
    // Provide a basic fallback response based on common programming questions
    let response = "I'm currently running in offline mode. For full AI-powered assistance, please add your VITE_GEMINI_API_KEY to the .env file.\n\n";
    
    const message = request.message.toLowerCase();
    
    // Basic pattern matching for common requests
    if (message.includes('hello world') && message.includes('c')) {
      response += "Here's a simple Hello World program in C:\n\n```c\n#include <stdio.h>\n\nint main() {\n    printf(\"Hello, World!\\n\");\n    return 0;\n}\n```\n\nTo compile and run:\n```bash\ngcc hello.c -o hello\n./hello\n```";
    } else if (message.includes('hello world') && (message.includes('python') || message.includes('py'))) {
      response += "Here's a simple Hello World program in Python:\n\n```python\nprint(\"Hello, World!\")\n```\n\nTo run:\n```bash\npython hello.py\n```";
    } else if (message.includes('hello world') && (message.includes('java'))) {
      response += "Here's a simple Hello World program in Java:\n\n```java\npublic class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}\n```\n\nTo compile and run:\n```bash\njavac HelloWorld.java\njava HelloWorld\n```";
    } else if (message.includes('hello world') && (message.includes('javascript') || message.includes('js'))) {
      response += "Here's a simple Hello World program in JavaScript:\n\n```javascript\nconsole.log(\"Hello, World!\");\n```\n\nTo run with Node.js:\n```bash\nnode hello.js\n```";
    } else {
      response += "I can provide basic assistance, but for detailed explanations and advanced help, please configure the Gemini API key.\n\nTo set up:\n1. Get a Gemini API key from Google AI Studio (https://makersuite.google.com/app/apikey)\n2. Add it to your .env file as VITE_GEMINI_API_KEY\n3. Restart the development server";
    }
    
    const updatedHistory = [
      ...(request.conversationHistory || []),
      { role: 'user' as const, content: request.message },
      { role: 'assistant' as const, content: response },
    ];

    return {
      response,
      conversationHistory: updatedHistory,
    };
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }
}

export const geminiService = new GeminiService();
