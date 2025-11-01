# Gemini AI Assistant Setup Guide

## Overview

The AI Code Editor now includes a **Gemini AI Assistant** - a conceptual coding assistant that appears on the right side of your screen. This assistant helps developers understand programming concepts, best practices, design patterns, and provides architectural guidance.

## Features

- 🤖 **Conceptual Assistance**: Get explanations about programming concepts and patterns
- 💬 **Conversational Interface**: Chat-based interaction with context awareness
- 🎯 **Code Context**: The assistant can see your current code and language
- 📚 **Educational Focus**: Learn while you code with clear explanations
- 🔄 **Persistent Conversations**: Your chat history is maintained during your session
- ✨ **Minimizable Panel**: Minimize when you need more screen space

## Getting Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Get API Key"** or **"Create API Key"**
4. Copy your API key

## Setup Instructions

### Step 1: Add API Key to Environment

1. Open your `.env` file (or create one from `.env.example`)
2. Add your Gemini API key:

```env
VITE_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Step 2: Restart Development Server

After adding the API key, restart your development server:

```bash
npm run dev
```

## Using the Gemini Assistant

### Opening the Assistant

- Look for the **purple sparkle button** in the bottom-right corner of the editor
- Click it to open the assistant panel

### Asking Questions

The assistant can help with:

- **Conceptual Questions**: "What is the difference between map and forEach?"
- **Best Practices**: "What are the best practices for error handling in JavaScript?"
- **Design Patterns**: "Explain the Observer pattern with an example"
- **Code Review**: "Is there a better way to structure this code?"
- **Debugging Help**: "Why might this function cause a memory leak?"
- **Architecture**: "How should I structure a React application?"

### Features

- **Context Awareness**: The assistant can see your current code and programming language
- **Conversation History**: Your chat is preserved during the session
- **Minimize/Maximize**: Use the minimize button to save screen space
- **Clear Conversation**: Start fresh anytime with the "Clear conversation" button

### Keyboard Shortcuts

- **Enter**: Send message
- **Shift + Enter**: New line in message

## Differences from Code Suggestions

The editor has two AI features:

1. **Code Suggestions (Ctrl+Space, Alt+D, Alt+O, Alt+B)**
   - Provides inline code completions
   - Optimizes existing code
   - Generates documentation
   - Debugs specific code issues
   - Uses OpenAI API (if configured)

2. **Gemini Assistant (Purple button)**
   - Explains programming concepts
   - Answers "how" and "why" questions
   - Provides learning resources
   - Discusses architecture and design
   - Uses Google Gemini API

## Troubleshooting

### Assistant Shows Mock Responses

If you see messages about adding your API key:
1. Verify your `.env` file has `VITE_GEMINI_API_KEY`
2. Ensure the key is valid (starts with `AIzaSy`)
3. Restart the development server

### API Key Not Working

1. Check that your API key is active in [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Verify there are no extra spaces in your `.env` file
3. Make sure you're using the correct environment variable name: `VITE_GEMINI_API_KEY`

### Rate Limiting

Google Gemini has rate limits. If you hit them:
- Wait a few minutes before trying again
- Consider upgrading your API plan if needed
- Check [Google AI Studio](https://makersuite.google.com/) for your usage

## Privacy & Security

- Your API key is stored locally in `.env` (never committed to git)
- Conversations are sent to Google's Gemini API
- Code context is only sent when you ask a question
- No data is stored on external servers beyond Google's API

## Cost

- Gemini API has a free tier with generous limits
- Check current pricing at [Google AI Pricing](https://ai.google.dev/pricing)
- Monitor your usage in Google AI Studio

## Tips for Best Results

1. **Be Specific**: "Explain React hooks" vs "What is useState?"
2. **Provide Context**: Mention your language and framework
3. **Ask Follow-ups**: Build on previous answers
4. **Use for Learning**: Ask "why" and "how" questions
5. **Reference Your Code**: "In my current code, why would..."

## Example Questions

```
- "What's the difference between async/await and promises?"
- "Explain the SOLID principles with examples"
- "How do I structure error handling in Express.js?"
- "What are React hooks and when should I use them?"
- "Explain time complexity of this algorithm"
- "What design pattern should I use for this problem?"
```

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your API key is correct
3. Ensure your internet connection is stable
4. Try clearing your browser cache

---

**Happy Coding with Gemini AI! 🚀**
