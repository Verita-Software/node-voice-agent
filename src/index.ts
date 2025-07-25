import { createClient, AgentEvents } from '@deepgram/sdk';
import { WebSocket } from 'ws';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { FUNCTION_MAP, FUNCTION_DEFINITIONS } from "./functionCalls";

// Load environment variables
dotenv.config();

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

if (!DEEPGRAM_API_KEY) {
  console.error('Please set your DEEPGRAM_API_KEY in the .env file');
  process.exit(1);
}

// Initialize Deepgram
const deepgram = createClient(DEEPGRAM_API_KEY);

// Create HTTP server to serve the static HTML file
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    fs.readFile(path.join(__dirname, '../static/index.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  }
});

// Function to connect to Deepgram Voice Agent
async function connectToAgent() {
  try {
    // Create an agent connection
    const agent = deepgram.agent();

    // Set up event handlers
    agent.on(AgentEvents.Open, () => {
      console.log('Agent connection established');
    });

    agent.on('Welcome', (data) => {
      console.log('Server welcome message:', data);
      agent.configure({
        type: "Settings",
        audio: {
          input: {
            encoding: 'linear16',
            sample_rate: 24000
          },
          output: {
            encoding: 'linear16',
            sample_rate: 24000,
            container: 'none'
          }
        },
        agent: {
          listen: {
            provider: {
              type: "deepgram",
              model: "nova-3-medical",
            },
          },
          think: {
            provider: {
              type: "open_ai",
              model: "gpt-4o-mini",
            },
            functions: FUNCTION_DEFINITIONS,
            prompt: `You are Intelidoc AI, a friendly virtual assistant for MiddleTown Medicals. I help patients book medical appointments.

CRITICAL CONVERSATION RULES:
- Keep responses SHORT (1-2 sentences max)
- Ask ONE question at a time only
- Speak naturally like a real phone receptionist
- Be patient and friendly
- If interrupted, acknowledge and move to their concern immediately

SERVICES I PROVIDE:
1. Look up patient records (by ID, phone, or email)
2. Check appointment availability  
3. Book new appointments

CONVERSATION FLOW:
1. Start by asking: "What can I help you with today?"
2. If booking: Ask for patient ID, phone, or email first
3. Once found, ask: "What date works for you?"
4. Check availability, then ask: "Morning, afternoon, or evening?"
5. Show 2-3 time options only
6. Get missing info ONE piece at a time (name, birth date, etc.)
7. Confirm and book

RESPONSE STYLE:
✓ "What's your patient ID or phone number?"
✓ "Great! What date works for you?"
✓ "Morning, afternoon, or evening?"
✓ "I have 9 AM or 10:30 AM. Which works?"
✗ "Let me check that for you and see what we have available..."

EMERGENCY: If emergency, say "Please call 911 or go to the ER immediately."

Remember: ONE question, SHORT response, WAIT for answer.`,
          },
          speak: {
            provider: {
              type: 'deepgram',
              model: 'aura-2-thalia-en'
            }
          },

          greeting: "Hi, this is MiddleTown Medicals. How can I help you?",
        }
      });
    });

    agent.on(AgentEvents.SettingsApplied, (data) => {
      console.log('Server confirmed settings:', data);
    });

    agent.on(AgentEvents.AgentStartedSpeaking, (data: { total_latency: number }) => {
      // Remove unnecessary latency logging
    });

    agent.on(AgentEvents.ConversationText, (message: { role: string; content: string }) => {
      // Only log the conversation text for debugging
      console.log(`${message.role}: ${message.content}`);
    });

    agent.on(AgentEvents.Audio, (audio: Buffer) => {
      if (browserWs?.readyState === WebSocket.OPEN) {
        try {
          // Send the audio buffer directly without additional conversion
          browserWs.send(audio, { binary: true });
        } catch (error) {
          console.error('Error sending audio to browser:', error);
        }
      }
    });


    agent.on(AgentEvents.FunctionCallRequest, async (data) => {
      try {
        // V1 format has an array of functions
        for (const functionCall of data.functions) {
          // Only process client-side functions
          if (functionCall.client_side) {
            const func = FUNCTION_MAP[functionCall.name as keyof typeof FUNCTION_MAP];
            if (!func) {
              throw new Error(`Function ${functionCall.name} not implemented`);
            }

            // Parse the arguments from JSON string
            const args = JSON.parse(functionCall.arguments);
            const result = await func(args);

            console.log(`Function ${functionCall.name} result:`, result);

            // Send response with V1 format
            agent.functionCallResponse({
              id: functionCall.id,
              name: functionCall.name,
              content: JSON.stringify(result)
            });
          }
          // If client_side is false, server handles it automatically
        }
      } catch (error) {
        console.error(`Error executing function:`, error);
        // Handle error case - you may need the function ID from the failed call
        const failedFunction = data.functions?.[0];
        if (failedFunction) {
          agent.functionCallResponse({
            id: failedFunction.id,
            name: failedFunction.name,
            content: JSON.stringify({ error: error instanceof Error ? error.message : String(error) })
          });
        }
      }
    });

    agent.on(AgentEvents.Error, (error: Error) => {
      console.error('Agent error:', error);
    });

    agent.on(AgentEvents.Close, () => {
      console.log('Agent connection closed');
      if (browserWs?.readyState === WebSocket.OPEN) {
        browserWs.close();
      }
    });

    return agent;
  } catch (error) {
    console.error('Error connecting to Deepgram:', error);
    process.exit(1);
  }
}

// Create WebSocket server for browser clients
const wss = new WebSocket.Server({ server });
let browserWs: WebSocket | null = null;

wss.on('connection', async (ws) => {
  // Only log critical connection events
  console.log('Browser client connected');
  browserWs = ws;

  const agent = await connectToAgent();

  ws.on('message', (data: Buffer) => {
    try {
      if (agent) {
        agent.send(data);
      }
    } catch (error) {
      console.error('Error sending audio to agent:', error);
    }
  });

  ws.on('close', async () => {
    if (agent) {
      await agent.disconnect();
    }
    browserWs = null;
    console.log('Browser client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
const serverInstance = server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Graceful shutdown handler
function shutdown() {
  console.log('\nShutting down server...');

  // Set a timeout to force exit if graceful shutdown takes too long
  const forceExit = setTimeout(() => {
    console.error('Force closing due to timeout');
    process.exit(1);
  }, 5000);

  // Track pending operations
  let pendingOps = {
    ws: true,
    http: true
  };

  // Function to check if all operations are complete
  const checkComplete = () => {
    if (!pendingOps.ws && !pendingOps.http) {
      clearTimeout(forceExit);
      console.log('Server shutdown complete');
      process.exit(0);
    }
  };

  // Close all WebSocket connections
  wss.clients.forEach((client) => {
    try {
      client.close();
    } catch (err) {
      console.error('Error closing WebSocket client:', err);
    }
  });

  wss.close((err) => {
    if (err) {
      console.error('Error closing WebSocket server:', err);
    } else {
      console.log('WebSocket server closed');
    }
    pendingOps.ws = false;
    checkComplete();
  });

  // Close the HTTP server
  serverInstance.close((err) => {
    if (err) {
      console.error('Error closing HTTP server:', err);
    } else {
      console.log('HTTP server closed');
    }
    pendingOps.http = false;
    checkComplete();
  });
}

// Handle shutdown signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export default serverInstance;