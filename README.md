# AI Code Editor

A powerful, context-aware code editor with integrated AI assistance powered by OpenAI and Google Gemini.

## ✨ Features

### 🤖 Dual AI Assistance
- **Code Suggestions (OpenAI)**: Inline code completions, optimizations, debugging, and documentation
- **Gemini Assistant**: Conceptual help, best practices, design patterns, and architectural guidance

### 💻 Multi-Language Support
- JavaScript
- TypeScript
- Python
- Java
- Go
-HTML
-CSS

### 🎯 Key Capabilities
- Real-time code execution
- AI-powered code suggestions (Ctrl+Space)
- Automatic optimization suggestions (Alt+O)
- Debug assistance (Alt+B)
- Documentation generation (Alt+D)
- Persistent code storage (never lose your work!)
- Analytics dashboard
- Monaco Editor integration

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ai-code-editor
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Add your API keys to `.env`:
```env
# Supabase (for data persistence)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# Gemini AI (for conceptual assistant)
VITE_GEMINI_API_KEY=your_gemini_api_key

# OpenAI (optional, for code suggestions)
VITE_OPENAI_API_KEY=your_openai_api_key
```

5. Start the development server:
```bash
npm run dev
```

6. Start the code execution server (in a separate terminal):
```bash
npm run server
```

## 📚 Documentation

- **[Gemini Assistant Setup](./GEMINI_SETUP.md)** - How to set up and use the Gemini AI assistant
- **[Supabase Setup](./SUPABASE_SETUP.md)** - Database configuration guide
- **[Multi-Language Setup](./MULTI_LANGUAGE_SETUP.md)** - Language runtime requirements

## 🎨 Features in Detail

### Gemini AI Assistant (Right Panel)
- Click the purple sparkle button in the bottom-right corner
- Ask conceptual questions about programming
- Get explanations of design patterns and best practices
- Discuss architecture and code structure
- Context-aware of your current code

### Code Suggestions (Inline)
- **Ctrl+Space**: Get code completions
- **Alt+D**: Generate documentation
- **Alt+O**: Optimize code
- **Alt+B**: Debug assistance
- **Ctrl+Enter**: Apply suggestion

### Code Persistence
- Your code is automatically saved to localStorage
- Persists across page refreshes and navigation
- Separate storage per language
- Never lose your work when switching between Editor, Dashboard, and Settings

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Editor**: Monaco Editor
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Database**: Supabase
- **AI**: Google Gemini + OpenAI
- **Backend**: Express.js (for code execution)

## 📝 Usage Examples

### Using the Gemini Assistant
```
You: "What's the difference between map and forEach in JavaScript?"
Gemini: "Great question! Let me explain the key differences..."
```

### Code Suggestions
1. Type your code
2. Press Ctrl+Space for completions
3. Press Alt+O to optimize
4. Press Alt+B to debug

## 🔧 Configuration

### Supabase Setup
See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.

### Language Runtimes
Ensure you have the required runtimes installed:
- Node.js (JavaScript/TypeScript)
- Python 3.x
- Java JDK
- .NET SDK (for C#)
- Go

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License

## 🙏 Acknowledgments

- Monaco Editor by Microsoft
- Google Gemini AI
- OpenAI API
- Supabase

---
