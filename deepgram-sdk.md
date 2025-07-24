TITLE: Run Example
DESCRIPTION: Executes the text analysis example using pnpm. This command starts the application after dependencies are installed.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/examples/node-read/README.md#_snippet_1

LANGUAGE: bash
CODE:
```
pnpm start
```

----------------------------------------

TITLE: Start Local Web Server
DESCRIPTION: Starts a local web server from the project root to serve the example files. This is required to run the browser-based transcription example.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/examples/browser-prerecorded/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
npx http-server .
```

----------------------------------------

TITLE: Run Deepgram JS SDK Live Transcription Example with pnpm
DESCRIPTION: Executes the live transcription example script using the pnpm package manager. This command starts the application, which requires a DEEPGRAM_API_KEY in a .env file.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/examples/node-live/README.md#_snippet_1

LANGUAGE: bash
CODE:
```
pnpm start
```

----------------------------------------

TITLE: Run Live Transcription Example
DESCRIPTION: Executes the live transcription example script. This command starts the application after dependencies are installed.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/examples/node-live-token/README.md#_snippet_1

LANGUAGE: bash
CODE:
```
pnpm start
```

----------------------------------------

TITLE: Run Deepgram Live Speak Example
DESCRIPTION: Executes the live text-to-speech example. This command starts the application after dependencies are installed and the API key is set.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/examples/node-speak-live/README.md#_snippet_1

LANGUAGE: bash
CODE:
```
pnpm start
```

----------------------------------------

TITLE: Start Local Web Server
DESCRIPTION: Starts a local web server from the project root to serve the browser example. This is typically used for development and testing.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/examples/browser-live/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
npx http-server .

```

----------------------------------------

TITLE: Run Example
DESCRIPTION: Executes the Deepgram JS SDK Text-to-Speech example using the pnpm package manager.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/examples/node-speak/README.md#_snippet_1

LANGUAGE: bash
CODE:
```
pnpm start
```

----------------------------------------

TITLE: Run Deepgram JS SDK Live Agent Example
DESCRIPTION: Executes the live agent example project after dependencies have been installed. This command starts the application that utilizes the Deepgram JS SDK.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/examples/node-agent-live/README.md#_snippet_1

LANGUAGE: bash
CODE:
```
pnpm start

```

----------------------------------------

TITLE: Build the Deepgram JS SDK
DESCRIPTION: Command to build the Deepgram JS SDK from the project root. This is a prerequisite for running the examples.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/examples/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
pnpm run build
```

----------------------------------------

TITLE: Project Setup and Execution
DESCRIPTION: Commands for installing project dependencies using pnpm and running the transcription example. Ensure your DEEPGRAM_API_KEY is set in a .env file.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/examples/node-prerecorded/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
pnpm install
```

LANGUAGE: bash
CODE:
```
pnpm start
```

----------------------------------------

TITLE: Get Project Usage Summary
DESCRIPTION: Retrieves a summary of usage for a project based on provided options. Offers a high-level overview of consumption.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_44

LANGUAGE: javascript
CODE:
```
const { result, error } = await deepgramClient.manage.getProjectUsageSummary(projectId, options);
```

----------------------------------------

TITLE: Get All Project Models
DESCRIPTION: Retrieves all models available for a given project. Requires project ID and an empty options object.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_49

LANGUAGE: javascript
CODE:
```
const { result, error } = await deepgramClient.manage.getAllModels(projectId, {});
```

----------------------------------------

TITLE: Install Deepgram JS SDK Dependencies with pnpm
DESCRIPTION: Installs project dependencies for the Deepgram JS SDK using the pnpm package manager. Ensure Node.js and pnpm are installed on your system before running this command.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/examples/node-live/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
pnpm install
```

----------------------------------------

TITLE: Get Project Usage (Deprecated)
DESCRIPTION: Deprecated: Retrieves usage for a specific project. Use 'Get Project Usage Breakdown' for a more comprehensive summary.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_46

LANGUAGE: javascript
CODE:
```
const { result, error } = await deepgramClient.manage.getProjectUsage(projectId, options);
```

----------------------------------------

TITLE: Get Project Usage Requests
DESCRIPTION: Retrieves all requests associated with a project based on provided options. Useful for detailed usage analysis.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_42

LANGUAGE: javascript
CODE:
```
const { result, error } = await deepgramClient.manage.getProjectUsageRequests(projectId, options);
```

----------------------------------------

TITLE: Transcribe Prerecorded Audio from URL
DESCRIPTION: This example demonstrates how to transcribe prerecorded audio from a given URL using the Deepgram JavaScript SDK. It includes fetching an API key from URL parameters, creating a Deepgram client, specifying the audio source and transcription model, and logging the transcribed text or any errors.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/examples/browser-prerecorded/index.html#_snippet_0

LANGUAGE: javascript
CODE:
```
const transcribe = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const apiKey = urlParams.get("key");

  if (!apiKey) {
    alert("Please add your DEEPGRAM_API_KEY to the query string. .e.g. ?key=YOUR_API_KEY");
    return;
  }

  // Assuming 'deepgram' is globally available or imported
  // const deepgram = require("@deepgram/sdk"); // If using Node.js or bundler
  const deepgram = window.deepgram; // If using in a browser with script tag
  const client = deepgram.createClient(apiKey);

  const audioUrl = "https://dpgr.am/spacewalk.wav";

  try {
    const { result, error } = await client.listen.prerecorded.transcribeUrl(
      { url: audioUrl },
      { model: "nova-3" }
    );

    if (error) {
      console.error("Deepgram transcription error:", error);
    } else {
      console.log("Transcription result:", result.results.channels[0].alternatives[0].transcript);
    }
  } catch (e) {
    console.error("An unexpected error occurred:", e);
  }
};

// To run this function, you would typically call it, e.g.:
// transcribe();
```

----------------------------------------

TITLE: Get All Projects
DESCRIPTION: Fetches a list of all projects accessible by the current API key. This method is part of the project management capabilities of the SDK.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_26

LANGUAGE: javascript
CODE:
```
const { result, error } = await deepgramClient.manage.getProjects();
```

----------------------------------------

TITLE: Get Project Model
DESCRIPTION: Retrieves detailed information about a specific model within a project. Requires project ID and model ID.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_50

LANGUAGE: javascript
CODE:
```
const { result, error } = await deepgramClient.manage.getModel(projectId, modelId);
```

----------------------------------------

TITLE: Install Deepgram JS SDK Dependencies
DESCRIPTION: Installs the project dependencies required for the Deepgram JS SDK live agent example using the pnpm package manager. Ensure you have pnpm installed globally.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/examples/node-agent-live/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
pnpm install

```

----------------------------------------

TITLE: Get Project Usage Fields
DESCRIPTION: Lists features, models, tags, languages, and processing methods used for requests in a project. Requires project ID and options.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_45

LANGUAGE: javascript
CODE:
```
const { result, error } = await deepgramClient.manage.getProjectUsageFields(projectId, options);
```

----------------------------------------

TITLE: Get Project Balances
DESCRIPTION: Retrieves the list of balance information for a specified project. Requires project ID.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_47

LANGUAGE: javascript
CODE:
```
const { result, error } = await deepgramClient.manage.getProjectBalances(projectId);
```

----------------------------------------

TITLE: Get Project Usage Request
DESCRIPTION: Retrieves details for a specific request within a project. Requires project ID and request ID.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_43

LANGUAGE: javascript
CODE:
```
const { result, error } = await deepgramClient.manage.getProjectUsageRequest(projectId, requestId);
```

----------------------------------------

TITLE: Get Specific Project
DESCRIPTION: Retrieves details for a single project identified by its unique project ID. This allows for focused management of individual projects.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_27

LANGUAGE: javascript
CODE:
```
const { result, error } = await deepgramClient.manage.getProject(projectId);
```

----------------------------------------

TITLE: Get Project Balance
DESCRIPTION: Retrieves balance information for a specific project and balance ID. Requires project ID and balance ID.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_48

LANGUAGE: javascript
CODE:
```
const { result, error } = await deepgramClient.manage.getProjectBalance(projectId, balanceId);
```

----------------------------------------

TITLE: Get Project Members
DESCRIPTION: Retrieves all account objects (members) associated with a given project ID. This provides visibility into who has access to the project.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_34

LANGUAGE: javascript
CODE:
```
const { result, error } = await deepgramClient.manage.getProjectMembers(projectId);
```

----------------------------------------

TITLE: Get Specific Project Key
DESCRIPTION: Fetches details for a particular API key within a project, using both the project ID and the key's ID. This allows for granular inspection of keys.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_31

LANGUAGE: javascript
CODE:
```
const { result, error } = await deepgramClient.manage.getProjectKey(projectId, projectKeyId);
```

----------------------------------------

TITLE: Get Authentication Token Details
DESCRIPTION: Retrieves details about the current authentication token being used by the SDK. This is useful for verifying token status or information.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_24

LANGUAGE: javascript
CODE:
```
const { result, error } = await deepgramClient.manage.getTokenDetails();
```

----------------------------------------

TITLE: Get Project Member Scopes
DESCRIPTION: Retrieves the scopes assigned to a specific member within a project. Requires project ID and member ID.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_36

LANGUAGE: javascript
CODE:
```
const { result, error } = await deepgramClient.manage.getProjectMemberScopes(
  projectId,
  projectMemberId
);
```

----------------------------------------

TITLE: Get On-Prem Credentials using Deepgram JS SDK
DESCRIPTION: This snippet demonstrates how to retrieve distribution credentials for a specified project using the Deepgram JavaScript SDK. It requires a `projectId` and `credentialId` as input and returns the credential details or an error.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_52

LANGUAGE: javascript
CODE:
```
const { result, error } = await deepgramClient.onprem.getCredentials(projectId, credentialId);
```

----------------------------------------

TITLE: Install Dependencies
DESCRIPTION: Installs project dependencies using pnpm. Ensure you have a .env file with your DEEPGRAM_API_KEY.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/examples/node-read/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
pnpm install
```

----------------------------------------

TITLE: Install Deepgram JS SDK Dependencies
DESCRIPTION: Installs the necessary project dependencies using pnpm. Ensure you have Node.js and pnpm installed.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/examples/node-live-token/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
pnpm install
```

----------------------------------------

TITLE: Install Deepgram JS SDK Dependencies
DESCRIPTION: Installs project dependencies using pnpm. Ensure you have a .env file with your DEEPGRAM_API_KEY configured before running.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/examples/node-speak-live/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
pnpm install
```

----------------------------------------

TITLE: JavaScript Deepgram Live Transcription Setup
DESCRIPTION: This snippet demonstrates setting up a live transcription connection with Deepgram. It captures audio from the user's microphone, streams it to the Deepgram API, and displays the returned transcriptions in real-time. It requires a Deepgram API key passed via URL parameters and browser support for the MediaDevices API.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/examples/browser-live/index.html#_snippet_0

LANGUAGE: javascript
CODE:
```
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const transcriptEl = document.getElementById("transcript");
let connection;
let mediaRecorder;

const setup = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const apiKey = urlParams.get("key");

    if (!apiKey) {
        alert("Please add your DEEPGRAM_API_KEY to the query string.");
        return;
    }

    // Assuming 'deepgram' is a globally available client instance or imported module
    // For example: import { Deepgram } from '@deepgram/sdk';
    // const deepgram = new Deepgram(apiKey);
    const deepgram = deepgram.createClient(apiKey); // Placeholder for actual client creation

    connection = deepgram.listen.live({
        model: "nova-3",
    });

    connection.on(deepgram.LiveTranscriptionEvents.Open, () => {
        console.log("Connection opened.");
        // Fetch and stream audio from a BBC World Service stream
        fetch("http://stream.live.vc.bbcmedia.co.uk/bbc_world_service")
            .then((response) => response.body)
            .then((body) => {
                const reader = body.getReader();
                function read() {
                    reader
                        .read()
                        .then(({ done, value }) => {
                            if (done) {
                                console.log("Stream complete");
                                return;
                            }
                            connection.send(value);
                            read();
                        })
                        .catch((error) => {
                            console.error("Stream read error:", error);
                        });
                }
                read();
            })
            .catch((error) => {
                console.error("Fetch error:", error);
            });
    });

    connection.on(deepgram.LiveTranscriptionEvents.Transcript, (data) => {
        transcriptEl.textContent = data.channel.alternatives[0].transcript;
    });

    connection.on(deepgram.LiveTranscriptionEvents.Close, () => {
        console.log("Connection closed.");
    });

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            connection.send(event.data);
        }
    };
};

startButton.onclick = () => {
    if (!connection) {
        setup().then(() => {
            mediaRecorder.start(1000);
        });
    } else {
        mediaRecorder.start(1000);
    }
};

stopButton.onclick = () => {
    mediaRecorder.stop();
    connection.finish();
};
```

----------------------------------------

TITLE: Install Dependencies
DESCRIPTION: Installs the necessary project dependencies using the pnpm package manager.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/examples/node-speak/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
pnpm install
```

----------------------------------------

TITLE: Create Project Key
DESCRIPTION: Generates a new API key for a specified project, allowing for the definition of associated scopes. This is used to grant specific permissions.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_32

LANGUAGE: javascript
CODE:
```
const { result, error } = await deepgramClient.manage.createProjectKey(projectId, options);
```

----------------------------------------

TITLE: Initialize Deepgram Client (CommonJS)
DESCRIPTION: Initializes the Deepgram client using CommonJS require syntax. This is common in older Node.js projects or specific build setups.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_8

LANGUAGE: javascript
CODE:
```
const { createClient } = require("@deepgram/sdk");

const deepgramClient = createClient(DEEPGRAM_API_KEY);
```

----------------------------------------

TITLE: Transcribe Audio with Callback URL
DESCRIPTION: Transcribe audio from a URL and specify a callback URL for receiving the transcription results asynchronously. This is useful for server-to-server communication or when direct response handling is not feasible.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_17

LANGUAGE: javascript
CODE:
```
import { CallbackUrl } from "@deepgram/sdk";

const { result, error } = await deepgramClient.listen.prerecorded.transcribeUrlCallback(
  { url: "https://dpgr.am/spacewalk.wav" },
  new CallbackUrl("http://callback/endpoint"),
  {
    model: "nova-3",
    // pre-recorded transcription options
  }
);
```

----------------------------------------

TITLE: Live Transcription via WebSocket
DESCRIPTION: Connect to Deepgram's WebSocket API for real-time, live audio transcription. This snippet shows how to establish a connection, handle events like 'Open' and 'Transcript', and send audio data for processing.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_18

LANGUAGE: javascript
CODE:
```
const deepgramConnection = deepgramClient.listen.live({
  model: "nova-3",
  // live transcription options
});

deepgramConnection.on(LiveTranscriptionEvents.Open, () => {
  deepgramConnection.on(LiveTranscriptionEvents.Transcript, (data) => {
    console.log(data);
  });

  source.addListener("got-some-audio", async (event) => {
    deepgramConnection.send(event.raw_audio_data);
  });
});
```

----------------------------------------

TITLE: Initialize Deepgram Client (ESM)
DESCRIPTION: Initializes the Deepgram client using ES Module import syntax. This is the standard for modern JavaScript environments like Node.js or browser modules.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_7

LANGUAGE: javascript
CODE:
```
import { createClient } from "@deepgram/sdk";

const deepgramClient = createClient(DEEPGRAM_API_KEY);
```

----------------------------------------

TITLE: Run All Tests
DESCRIPTION: Executes the complete test suite for the Deepgram JS SDK using the pnpm package manager.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/tests/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
pnpm test
```

----------------------------------------

TITLE: Leave Project
DESCRIPTION: Allows the authenticated user to remove themselves from a project. Requires the project ID.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_41

LANGUAGE: javascript
CODE:
```
const { result, error } = await deepgramClient.manage.leaveProject(projectId);
```

----------------------------------------

TITLE: Send Project Invite
DESCRIPTION: Sends an invitation to a specified email address for a project. Requires project ID and invitation options.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_39

LANGUAGE: javascript
CODE:
```
const { result, error } = await deepgramClient.manage.sendProjectInvite(projectId, options);
```

----------------------------------------

TITLE: Create On-Prem Credentials using Deepgram JS SDK
DESCRIPTION: This snippet shows how to create new distribution credentials for a project with the Deepgram JavaScript SDK. It takes a `projectId` and `options` object as input, returning the created credentials or an error.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_53

LANGUAGE: javascript
CODE:
```
const { result, error } = await deepgramClient.onprem.createCredentials(projectId, options);
```

----------------------------------------

TITLE: Initialize Deepgram client in browser (UMD)
DESCRIPTION: Initializes the Deepgram client using the globally available 'deepgram' object after loading via a UMD script tag. Requires an API key.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_5

LANGUAGE: html
CODE:
```
<script>
  const { createClient } = deepgram;
  const deepgramClient = createClient("deepgram-api-key");

  console.log("Deepgram client instance: ", deepgramClient);
  // ...
</script>
```

----------------------------------------

TITLE: Transcribe Local Audio File
DESCRIPTION: Transcribe audio from a local file using the Deepgram SDK. This involves creating a readable stream from the local file path and passing it to the transcription method. It allows for on-device audio processing.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_16

LANGUAGE: javascript
CODE:
```
const { result, error } = await deepgramClient.listen.prerecorded.transcribeFile(
  fs.createReadStream("./examples/spacewalk.wav"),
  {
    model: "nova-3",
    // pre-recorded transcription options
  }
);
```

----------------------------------------

TITLE: Configure and Use Voice Agent
DESCRIPTION: Set up and interact with a Deepgram Voice Agent for conversational AI applications. This involves creating an agent connection, defining event handlers for conversation data, and configuring the agent's behavior.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_20

LANGUAGE: javascript
CODE:
```
import { AgentEvents } from "@deepgram/sdk";

// Create an agent connection
const deepgramConnection = deepgramClient.agent();

// Set up event handlers
deepgramConnection.on(AgentEvents.Open, () => {
  console.log("Connection opened");

  // Set up event handlers
  deepgramConnection.on(AgentEvents.ConversationText, (data) => {
    console.log(data);
  });

  // other events

  // Configure the agent once connection is established
  deepgramConnection.configure({
    // agent configuration
  });

  // etc...
});
```

----------------------------------------

TITLE: List Keys for a Project
DESCRIPTION: Retrieves all API keys associated with a specific project, identified by its project ID. This is useful for managing access credentials.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_30

LANGUAGE: javascript
CODE:
```
const { result, error } = await deepgramClient.manage.getProjectKeys(projectId);
```

----------------------------------------

TITLE: List On-Prem Credentials
DESCRIPTION: Lists sets of distribution credentials for the specified project. Requires project ID.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_51

LANGUAGE: javascript
CODE:
```
const { result, error } = await deepgramClient.onprem.listCredentials(projectId);
```

----------------------------------------

TITLE: Connect and Stream Text via WebSocket
DESCRIPTION: Establishes a WebSocket connection to Deepgram's speak API and sends text for real-time speech synthesis. Includes event handling for connection open and close.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_22

LANGUAGE: javascript
CODE:
```
const deepgramConnection = deepgramClient.speak.live({
  model: "aura-2-thalia-en",
  // live text to speech options
});

deepgramConnection.on(LiveTTSEvents.Open, () => {
  console.log("Connection opened");

  // Send text data for TTS synthesis
  deepgramConnection.sendText(text);

  // Send Flush message to the server after sending the text
  deepgramConnection.flush();

  deepgramConnection.on(LiveTTSEvents.Close, () => {
    console.log("Connection closed");
  });
});
```

----------------------------------------

TITLE: Install Deepgram SDK using npm
DESCRIPTION: Installs the Deepgram JavaScript SDK using the npm package manager. This is the standard method for Node.js projects.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
npm install @deepgram/sdk
```

----------------------------------------

TITLE: List Project Invites
DESCRIPTION: Retrieves all invitations associated with a specific project ID. This function helps manage pending invitations.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_38

LANGUAGE: javascript
CODE:
```
const { result, error } = await deepgramClient.manage.getProjectInvites(projectId);
```

----------------------------------------

TITLE: Import Deepgram SDK in browser (ESM)
DESCRIPTION: Imports the Deepgram SDK using an ES Module type script tag from a CDN. This is the modern approach for browser-based JavaScript.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_6

LANGUAGE: html
CODE:
```
<script type="module">
  import { createClient } from "https://cdn.jsdelivr.net/npm/@deepgram/sdk/+esm";
  const deepgramClient = createClient("deepgram-api-key");

  console.log("Deepgram client instance: ", deepgramClient);
  // ...
</script>
```

----------------------------------------

TITLE: Configure Listen Namespace Fetch URL
DESCRIPTION: Sets a custom API URL specifically for the 'listen' namespace's fetch requests. This is useful for on-premise installations or specific routing.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_11

LANGUAGE: javascript
CODE:
```
import { createClient } from "@deepgram/sdk";

const deepgramClient = createClient(DEEPGRAM_API_KEY, {
  listen: { fetch: { options: { url: "http://localhost:8080" } } },
});
```

----------------------------------------

TITLE: Install Deepgram SDK using pnpm
DESCRIPTION: Installs the Deepgram JavaScript SDK using the pnpm package manager. This is an alternative method for managing project dependencies.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_1

LANGUAGE: bash
CODE:
```
pnpm install @deepgram/sdk
```

----------------------------------------

TITLE: Load Deepgram SDK via UMD script tag (unpkg)
DESCRIPTION: Loads the Deepgram SDK directly in the browser using a UMD compatible script tag from the unpkg CDN. This makes the SDK available globally.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_4

LANGUAGE: html
CODE:
```
<script src="https://unpkg.com/@deepgram/sdk"></script>
```

----------------------------------------

TITLE: Transcribe Remote Audio File
DESCRIPTION: Transcribe audio from a remote URL using the Deepgram SDK. This method sends the audio file located at the specified URL to Deepgram for processing. It supports various transcription options like specifying the model.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_15

LANGUAGE: javascript
CODE:
```
const { result, error } = await deepgramClient.listen.prerecorded.transcribeUrl(
  { url: "https://dpgr.am/spacewalk.wav" },
  {
    model: "nova-3",
    // pre-recorded transcription options
  }
);
```

----------------------------------------

TITLE: Text to Speech (Single Request)
DESCRIPTION: Convert text into speech using a single REST API request with the Deepgram SDK. This method allows for specifying the text content and various speech synthesis options, such as the voice model.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_21

LANGUAGE: javascript
CODE:
```
const { result } = await deepgramClient.speak.request(
  { text },
  {
    model: "aura-2-thalia-en",
    // text to speech options
  }
);
```

----------------------------------------

TITLE: Load Deepgram SDK via UMD script tag
DESCRIPTION: Loads the Deepgram SDK directly in the browser using a UMD compatible script tag from a CDN. This makes the SDK available globally.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_3

LANGUAGE: html
CODE:
```
<script src="https://cdn.jsdelivr.net/npm/@deepgram/sdk"></script>
```

----------------------------------------

TITLE: Set Custom Fetch Headers
DESCRIPTION: Demonstrates how to set custom headers for fetch requests within the Deepgram SDK configuration. This can be useful for various purposes, such as passing additional metadata or authentication tokens.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_14

LANGUAGE: javascript
CODE:
```
import { createClient } from "@deepgram/sdk";

const deepgramClient = createClient("proxy", {
  global: { fetch: { options: { headers: { "x-custom-header": "foo" } } } },
});
```

----------------------------------------

TITLE: Analyze Text with Deepgram Intelligence
DESCRIPTION: Utilizes the Deepgram SDK to analyze provided text content using AI features. It demonstrates sending text and configuration options for language and other intelligence parameters.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_23

LANGUAGE: javascript
CODE:
```
const text = `The history of the phrase 'The quick brown fox jumps over the
lazy dog'. The earliest known appearance of the phrase was in The Boston
Journal...`;

const { result, error } = await deepgramClient.read.analyzeText(
  { text },
  {
    language: "en",
    // text intelligence options
  }
);
```

----------------------------------------

TITLE: Install Deepgram SDK using yarn
DESCRIPTION: Installs the Deepgram JavaScript SDK using the yarn package manager. This is another common method for managing project dependencies.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_2

LANGUAGE: bash
CODE:
```
yarn add @deepgram/sdk
```

----------------------------------------

TITLE: Run Unit Tests
DESCRIPTION: Executes only the unit tests for the Deepgram JS SDK, targeting the specific unit directory.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/tests/README.md#_snippet_2

LANGUAGE: bash
CODE:
```
pnpm test tests/unit/
```

----------------------------------------

TITLE: Convert Transcription to Captions
DESCRIPTION: Convert Deepgram transcription results into standard caption formats like WebVTT and SRT. This functionality is provided by a separate captions library, which can be imported and used with the transcription output.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_19

LANGUAGE: javascript
CODE:
```
import { webvtt, srt } from "@deepgram/sdk";

const { result, error } = await deepgramClient.listen.prerecorded.transcribeUrl({
  model: "nova-3",
  // pre-recorded transcription options
});

const vttResult = webvtt(result);
const srtResult = srt(result);
```

----------------------------------------

TITLE: Proxy Requests in Browser
DESCRIPTION: Configure the Deepgram SDK to proxy REST-based requests from the browser. This is necessary for requests like pre-recorded transcription, on-premise, and management requests due to CORS limitations. The SDK requires 'proxy' as the API key, and the proxy service must add the Authorization header.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_13

LANGUAGE: javascript
CODE:
```
import { createClient } from "@deepgram/sdk";

const deepgramClient = createClient("proxy", {
  global: { fetch: { options: { proxy: { url: "http://localhost:8080" } } } },
});
```

----------------------------------------

TITLE: Grant Temporary Token
DESCRIPTION: Creates a temporary authentication token with a 30-second Time-To-Live (TTL). This token can be used to authenticate client instances for specific, short-lived operations.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_25

LANGUAGE: javascript
CODE:
```
const { result, error } = await deepgramClient.auth.grantToken();

// Example of using the temporary token:
// const deepgramClient = new DeepgramClient(result.token, {
//   // options
// });
```

----------------------------------------

TITLE: Update Project
DESCRIPTION: Modifies an existing project using its project ID and provided options. This enables updating project configurations or metadata.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_28

LANGUAGE: javascript
CODE:
```
const { result, error } = await deepgramClient.manage.updateProject(projectId, options);
```

----------------------------------------

TITLE: Run E2E Tests
DESCRIPTION: Executes only the end-to-end tests for the Deepgram JS SDK, targeting the specific e2e directory.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/tests/README.md#_snippet_1

LANGUAGE: bash
CODE:
```
pnpm test tests/e2e/
```

----------------------------------------

TITLE: Override Fetch Transmitter Client
DESCRIPTION: Provides a custom fetch client implementation to the SDK. This allows for advanced control over HTTP requests, such as custom logging or error handling.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_12

LANGUAGE: javascript
CODE:
```
import { createClient } from "@deepgram/sdk";

const yourFetch = async () => {
  // Custom fetch logic here
  return Response("...etc");
};

const deepgramClient = createClient(DEEPGRAM_API_KEY, {
  global: { fetch: { client: yourFetch } },
});
```

----------------------------------------

TITLE: Configure Global API URL for Fetch
DESCRIPTION: Sets a custom API URL for all fetch requests made by the SDK. Useful for targeting beta or specific API environments.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_9

LANGUAGE: javascript
CODE:
```
import { createClient } from "@deepgram/sdk";

const deepgramClient = createClient(DEEPGRAM_API_KEY, {
  global: { fetch: { options: { url: "https://api.beta.deepgram.com" } } },
});
```

----------------------------------------

TITLE: Update Snapshots (Jest Flag)
DESCRIPTION: Updates test snapshots by using Jest's update flag, which requires real API calls to generate new snapshots.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/tests/README.md#_snippet_3

LANGUAGE: bash
CODE:
```
pnpm test tests/e2e/ -- -u
```

----------------------------------------

TITLE: Delete Project Invite
DESCRIPTION: Removes a specific invitation from a project. Requires project ID and the email address of the invitee.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_40

LANGUAGE: javascript
CODE:
```
const { error } = await deepgramClient.manage.deleteProjectInvite(projectId, email);
```

----------------------------------------

TITLE: Update Snapshots (Env Variable)
DESCRIPTION: Updates test snapshots by setting the DEEPGRAM_FORCE_REAL_API environment variable to true, forcing real API calls.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/tests/README.md#_snippet_4

LANGUAGE: bash
CODE:
```
DEEPGRAM_FORCE_REAL_API=true pnpm test tests/e2e/
```

----------------------------------------

TITLE: Delete Project Key
DESCRIPTION: Removes an API key from a project using both the project ID and the key's ID. This is a security measure to revoke access.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_33

LANGUAGE: javascript
CODE:
```
const { error } = await deepgramClient.manage.deleteProjectKey(projectId, projectKeyId);
```

----------------------------------------

TITLE: Delete Project
DESCRIPTION: Removes a project from the Deepgram account using its project ID. This action is irreversible and should be used with caution.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_29

LANGUAGE: javascript
CODE:
```
const { error } = await deepgramClient.manage.deleteProject(projectId);
```

----------------------------------------

TITLE: Configure Global API URL for WebSocket
DESCRIPTION: Sets a custom API URL for all WebSocket connections made by the SDK. Useful for proxying or custom WebSocket endpoints.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_10

LANGUAGE: javascript
CODE:
```
import { createClient } from "@deepgram/sdk";

const deepgramClient = createClient(DEEPGRAM_API_KEY, {
  global: { websocket: { options: { url: "ws://localhost:8080" } } },
});
```

----------------------------------------

TITLE: Remove Project Member
DESCRIPTION: Deletes a member's account from a project using the project ID and the member's specific ID. This revokes a member's access to the project.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_35

LANGUAGE: javascript
CODE:
```
const { error } = await deepgramClient.manage.removeProjectMember(projectId, projectMemberId);
```

----------------------------------------

TITLE: Update Project Member Scope
DESCRIPTION: Updates the scope for a specified member in a given project. Requires project ID, member ID, and scope options.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_37

LANGUAGE: javascript
CODE:
```
const { result, error } = await deepgramClient.manage.updateProjectMemberScope(
  projectId,
  projectMemberId,
  options
);
```

----------------------------------------

TITLE: Delete On-Prem Credentials using Deepgram JS SDK
DESCRIPTION: This snippet illustrates how to delete distribution credentials for a project using the Deepgram JavaScript SDK. It requires a `projectId` and `credentialId` to identify and remove the credentials, returning the result or an error.
SOURCE: https://github.com/deepgram/deepgram-js-sdk/blob/main/README.md#_snippet_54

LANGUAGE: javascript
CODE:
```
const { result, error } = await deepgramClient.onprem.deleteCredentials(projectId, credentialId);
```