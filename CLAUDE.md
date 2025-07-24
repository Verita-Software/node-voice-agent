# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js starter application for Deepgram's Voice Agent API, demonstrating how to create a voice agent that can engage in natural conversations. The application serves as a virtual assistant for medical appointment booking with Deepgram's speech-to-text, text-to-speech, and voice agent capabilities.

## Core Architecture

### Main Components

- **`src/index.ts`**: Main server file that:
  - Creates HTTP server serving static HTML at `http://localhost:3000`
  - Establishes WebSocket server for browser-agent communication
  - Manages Deepgram Voice Agent connections with event handlers
  - Handles graceful shutdown with proper cleanup

- **`src/functionCalls.ts`**: Function calling system that:
  - Defines agent function schemas (`FUNCTION_DEFINITIONS`)
  - Implements API integration functions (`FUNCTION_MAP`)
  - Handles patient lookup, appointment booking, and availability checking
  - Communicates with external booking APIs at `localhost:3032`

- **`static/index.html`**: Browser client with:
  - WebAudio API integration for microphone input/speaker output
  - WebSocket connection to Node.js server
  - Audio processing with 24kHz sample rate matching Deepgram's requirements
  - Queue-based audio playback system

### Voice Agent Configuration

The agent is configured as "Intelidoc AI" for MiddleTown Medicals with:
- **Listen**: Deepgram Nova-3-Medical model for speech recognition
- **Think**: OpenAI GPT-4o-mini for conversation logic
- **Speak**: Deepgram Aura-2-Thalia for text-to-speech
- **Functions**: Patient lookup, appointment booking, availability checking

## Development Commands

```bash
# Install dependencies
npm install

# Development server with auto-restart
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run tests
npm test
```

## Environment Setup

Create `.env` file from `sample.env`:
```
DEEPGRAM_API_KEY=your_deepgram_api_key_here
```

## Key Implementation Details

### Audio Processing
- Uses 24kHz sample rate throughout the pipeline
- Browser captures microphone input as Float32, converts to Int16 PCM
- Agent responses are Int16 PCM, converted back to Float32 for playback
- Queue-based audio playback prevents choppy responses

### Function Calling System
- Functions are defined with detailed schemas in `FUNCTION_DEFINITIONS`
- External API integration points to appointment booking system
- Error handling with fallback responses to agent

### WebSocket Communication
- Single WebSocket connection per browser session
- Binary audio data streaming in both directions
- Proper connection cleanup on disconnect

## Testing

- Jest configured with ts-jest for TypeScript support
- Test files expected in `**/__tests__/**/*.test.ts` pattern
- Previously had test file at `src/__tests__/index.test.ts` (now deleted)

## Important Notes

- Server runs on port 3000 by default
- External appointment API expected at `localhost:3032`
- Patient lookup API expected at `localhost:3005`
- Graceful shutdown handles WebSocket and HTTP server cleanup
- Audio context requires user interaction to start (browser security)