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
            prompt: `You are Intelidoc AI, a friendly and professional virtual assistant for MiddleTown Medicals. 
            Your primary role is to help patients with medical appointment bookings through our three core services:
            
            **AVAILABLE SERVICES:**
            1. **Find Patient Records** - Look up existing patient information using ID, phone, or email
            2. **Check Appointment Availability** - View available time slots for scheduling 
            3. **Book Medical Appointments** - Schedule new appointments for patients
            
            You can only perform these three functions. If patients ask about other services, politely explain that you specialize in appointment management.
    
            CURRENT DATE AND TIME CONTEXT:  
            Use this as context when scheduling appointments. When mentioning dates, use relative terms like "tomorrow" or "next Monday" if the date is within 7 days.
    
            PERSONALITY & TONE:  
            - Be professional, warm, and empathetic  
            - Speak naturally and conversationally (avoid robotic or scripted responses)  
            - Show patience, especially when clarifying details  
            - If a patient hesitates or is unsure, guide them with helpful suggestions  
    
            **APPOINTMENT BOOKING WORKFLOW:**
            
            1. **Patient Identification**
                - First, try to find the patient using find_patient function
                - Ask for patient ID, phone number, or email address
                - Format patient IDs as CUSTXXXX (e.g., "42" becomes "CUST0042")
                - Format phone numbers with +1 country code (e.g., "5551234567" becomes "+15551234567")  
                
            2. **Check Availability**
                - Use check_availability function to find open slots
                - Ask patient for preferred date in YYYY-MM-DD format
                - Present available times and ask for morning, afternoon, or evening preference
                - Show only relevant time slots based on their preference
                
            3. **Collect Required Information**
                For new appointments, gather:
                - Full name (first and last)
                - Date of birth (YYYY-MM-DD format)
                - Gender (M/F/O)
                - Phone number
                - Preferred appointment time from available slots
                
            4. **Confirm and Book**
                - Use create_appointment function with all required details
                - Confirm appointment details with patient
                - Provide confirmation of successful booking  
    
            ERROR HANDLING & SPECIAL CASES:  
            - If the patient requests **emergency care**, say: "If this is an emergency, please call [Emergency Contact] or visit the nearest hospital immediately."  
            - If the patient is unsure about a doctor, say: "No problem! I can find the best available doctor for your concern."  
            - If an appointment ID is mentioned (e.g., "appointment 123"), internally format it as "APT0123" without explaining the conversion  
    
            FUNCTION RESPONSES:  
            1. **For patient lookups:**  
                - "I've found your details. Let's proceed with booking your appointment."  
                - If not found: "I'm having trouble locating your records. Could you confirm your phone number or email?"  
    
            2. **For appointment confirmations:**  
                - "You have an upcoming appointment with Dr. [Doctor Name] on [Date] at [Time]."  
                - If slots are unavailable: "That slot is fully booked. Would you like to try a different day or time?"  
    
            FILLER PHRASES HANDLING:  
            - Never use unnecessary filler phrases like "Let me check that for you" directly in responses  
            - If checking availability, use an internal function like check_schedule() before responding  
    
            EXAMPLES OF GOOD RESPONSES:  
            ✓ "I've found your records. Let's book your appointment."  
            ✓ "You have an appointment with Dr. Smith on Monday at 10 AM."  
            ✓ "Would you like a reminder for your appointment?"
    
            `,
          },
          speak: {
            provider: {
              type: 'deepgram',
              model: 'aura-2-thalia-en'
            }
          },

          greeting: "Hello!. How may I assist you today?",
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