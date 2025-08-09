# TUI Control API

Remote control interface for the opencode Terminal User Interface (TUI) client.

## Overview

The TUI Control API enables external applications to remotely control the opencode terminal interface. This bidirectional communication system allows web interfaces, IDE extensions, and automation scripts to trigger actions in the TUI client running in a terminal.

### How It Works

The TUI Control API uses a queue-based request/response protocol:

1. **External Request**: Client calls a TUI control endpoint (e.g., `/tui/open-help`)
2. **Request Queue**: Server queues the request for the TUI client
3. **TUI Polling**: TUI client polls `/tui/control/next` for pending requests
4. **Action Execution**: TUI performs the requested action (open dialog, append text, etc.)
5. **Response**: TUI posts result back via `/tui/control/response`
6. **Client Response**: Original client receives the response

### Architecture

```
External Client → Server API → Request Queue → TUI Client
                              ↘             ↗
                               Response Queue
```

---

## POST /tui/append-prompt

Append text to the TUI's input prompt area.

**Operation ID:** `tui.appendPrompt`

### Description

Adds text to the current prompt input in the TUI interface. This allows external applications to pre-fill or add content to what the user is typing, enabling features like template insertion or auto-completion.

### Request Body

**Content-Type:** `application/json`

```json
{
  "text": "string (required)"
}
```

### Parameters

- **text** (required): Text content to append to the current prompt

### Response

**Status:** `200 OK`

**Content-Type:** `application/json`

**Schema:** `boolean`

Returns `true` when the text has been successfully appended to the TUI prompt.

### Example Request

```bash
curl -X POST http://localhost:8080/tui/append-prompt \
  -H "Content-Type: application/json" \
  -d '{"text": "Fix the authentication bug in "}'
```

### Example Response

```json
true
```

### Usage Examples

```javascript
// Pre-fill prompt with template
await fetch("/tui/append-prompt", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: "Please help me debug this function: " }),
})

// Add file path from file explorer
await fetch("/tui/append-prompt", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: "src/auth/login.ts" }),
})
```

### Use Cases

- **Template Insertion**: Insert common prompt templates
- **File Path Completion**: Add selected file paths from external file browsers
- **Snippet Integration**: Insert code snippets or examples
- **Auto-suggestion**: Add suggested text based on context

---

## POST /tui/open-help

Open the help dialog in the TUI interface.

**Operation ID:** `tui.openHelp`

### Description

Displays the help dialog in the TUI, showing available commands, keyboard shortcuts, and usage information. This provides users with contextual assistance within the terminal interface.

### Request Body

None required.

### Response

**Status:** `200 OK`

**Content-Type:** `application/json`

**Schema:** `boolean`

Returns `true` when the help dialog has been successfully opened.

### Example Request

```bash
curl -X POST http://localhost:8080/tui/open-help
```

### Example Response

```json
true
```

### Usage Examples

```javascript
// Open help from web interface
document.getElementById("help-button").addEventListener("click", async () => {
  await fetch("/tui/open-help", { method: "POST" })
})

// Open help via keyboard shortcut
document.addEventListener("keydown", async (e) => {
  if (e.key === "F1") {
    await fetch("/tui/open-help", { method: "POST" })
  }
})
```

### Use Cases

- **Remote Help Access**: Trigger help from external interfaces
- **Guided Tutorials**: Open help as part of onboarding flows
- **Context-sensitive Help**: Show help based on current state
- **Accessibility**: Provide alternative help access methods

---

## POST /tui/open-sessions

Open the session management dialog in the TUI.

**Operation ID:** `tui.openSessions`

### Description

Displays the session selection and management interface in the TUI, allowing users to browse, switch between, or manage conversation sessions within the terminal interface.

### Request Body

None required.

### Response

**Status:** `200 OK`

**Content-Type:** `application/json`

**Schema:** `boolean`

Returns `true` when the sessions dialog has been successfully opened.

### Example Request

```bash
curl -X POST http://localhost:8080/tui/open-sessions
```

### Example Response

```json
true
```

### Usage Examples

```javascript
// Open sessions from sidebar
document.getElementById("sessions-button").addEventListener("click", async () => {
  await fetch("/tui/open-sessions", { method: "POST" })
})

// Quick session switcher
async function openSessionSelector() {
  const response = await fetch("/tui/open-sessions", { method: "POST" })
  return response.json()
}
```

### Use Cases

- **Session Navigation**: Quick access to session management
- **Workflow Integration**: Integrate session switching into external workflows
- **Multi-session Management**: Coordinate session selection across interfaces
- **Project Context Switching**: Switch sessions based on project context

---

## POST /tui/open-themes

Open the theme selection dialog in the TUI.

**Operation ID:** `tui.openThemes`

### Description

Displays the theme customization interface in the TUI, allowing users to browse and select different visual themes for the terminal interface.

### Request Body

None required.

### Response

**Status:** `200 OK`

**Content-Type:** `application/json`

**Schema:** `boolean`

Returns `true` when the themes dialog has been successfully opened.

### Example Request

```bash
curl -X POST http://localhost:8080/tui/open-themes
```

### Example Response

```json
true
```

### Usage Examples

```javascript
// Open theme selector from settings
document.getElementById("themes-button").addEventListener("click", async () => {
  await fetch("/tui/open-themes", { method: "POST" })
})

// Theme customization workflow
async function customizeTheme() {
  const opened = await fetch("/tui/open-themes", { method: "POST" })
  if (opened) {
    console.log("Theme selector opened in TUI")
  }
}
```

### Use Cases

- **Visual Customization**: Remote theme selection and customization
- **Accessibility**: Adjust themes for visual accessibility needs
- **Brand Integration**: Apply organizational theme preferences
- **User Preferences**: Synchronize theme preferences across interfaces

---

## POST /tui/open-models

Open the AI model selection dialog in the TUI.

**Operation ID:** `tui.openModels`

### Description

Displays the AI model selection interface in the TUI, allowing users to browse and select different AI providers and models for conversations within the terminal interface.

### Request Body

None required.

### Response

**Status:** `200 OK`

**Content-Type:** `application/json`

**Schema:** `boolean`

Returns `true` when the models dialog has been successfully opened.

### Example Request

```bash
curl -X POST http://localhost:8080/tui/open-models
```

### Example Response

```json
true
```

### Usage Examples

```javascript
// Open model selector from toolbar
document.getElementById("models-button").addEventListener("click", async () => {
  await fetch("/tui/open-models", { method: "POST" })
})

// Model selection workflow
async function selectModel() {
  const response = await fetch("/tui/open-models", { method: "POST" })
  return response.json()
}
```

### Use Cases

- **Model Selection**: Remote AI model and provider selection
- **Performance Optimization**: Switch models based on task requirements
- **Cost Management**: Select models based on cost considerations
- **Feature Access**: Access specific model capabilities remotely

---

## POST /tui/submit-prompt

Submit the current prompt in the TUI interface.

**Operation ID:** `tui.submitPrompt`

### Description

Triggers submission of whatever text is currently in the TUI's prompt input area, as if the user pressed Enter. This allows external applications to programmatically send messages to the AI.

### Request Body

None required.

### Response

**Status:** `200 OK`

**Content-Type:** `application/json`

**Schema:** `boolean`

Returns `true` when the prompt has been successfully submitted.

### Example Request

```bash
curl -X POST http://localhost:8080/tui/submit-prompt
```

### Example Response

```json
true
```

### Usage Examples

```javascript
// Submit prompt from external interface
async function submitCurrentPrompt() {
  const response = await fetch("/tui/submit-prompt", { method: "POST" })
  return response.json()
}

// Combined workflow: append text and submit
async function sendMessage(text) {
  await fetch("/tui/append-prompt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  })

  await fetch("/tui/submit-prompt", { method: "POST" })
}
```

### Use Cases

- **Automated Messaging**: Send pre-constructed messages programmatically
- **Workflow Automation**: Trigger message submission as part of larger workflows
- **Template Execution**: Submit template-based prompts
- **Batch Operations**: Submit multiple prompts in sequence

---

## POST /tui/clear-prompt

Clear the current prompt text in the TUI interface.

**Operation ID:** `tui.clearPrompt`

### Description

Removes all text from the TUI's prompt input area, effectively clearing whatever the user has typed. This allows external applications to reset the input state.

### Request Body

None required.

### Response

**Status:** `200 OK`

**Content-Type:** `application/json`

**Schema:** `boolean`

Returns `true` when the prompt has been successfully cleared.

### Example Request

```bash
curl -X POST http://localhost:8080/tui/clear-prompt
```

### Example Response

```json
true
```

### Usage Examples

```javascript
// Clear prompt from external interface
async function clearPrompt() {
  const response = await fetch("/tui/clear-prompt", { method: "POST" })
  return response.json()
}

// Reset and replace workflow
async function replacePromptText(newText) {
  await fetch("/tui/clear-prompt", { method: "POST" })
  await fetch("/tui/append-prompt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: newText }),
  })
}
```

### Use Cases

- **Input Reset**: Clear input before adding new content
- **Error Recovery**: Reset input after errors or cancellations
- **Template Replacement**: Clear before inserting new templates
- **Workflow Cleanup**: Reset state between automated operations

---

## POST /tui/execute-command

Execute a specific TUI command.

**Operation ID:** `tui.executeCommand`

### Description

Executes a named command within the TUI interface, such as mode switching or other internal TUI operations. This provides access to TUI's internal command system from external applications.

### Request Body

**Content-Type:** `application/json`

```json
{
  "command": "string (required)"
}
```

### Parameters

- **command** (required): Command name to execute (e.g., "switch_mode", "toggle_sidebar")

### Response

**Status:** `200 OK`

**Content-Type:** `application/json`

**Schema:** `boolean`

Returns `true` when the command has been successfully executed.

### Example Request

```bash
curl -X POST http://localhost:8080/tui/execute-command \
  -H "Content-Type: application/json" \
  -d '{"command": "switch_mode"}'
```

### Example Response

```json
true
```

### Available Commands

Common TUI commands that can be executed:

- **"switch_mode"**: Switch between different conversation modes
- **"toggle_sidebar"**: Show/hide sidebar panels
- **"focus_input"**: Move focus to the input area
- **"show_history"**: Display conversation history
- **"toggle_fullscreen"**: Toggle fullscreen mode

### Usage Examples

```javascript
// Switch conversation mode
async function switchMode() {
  await fetch("/tui/execute-command", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ command: "switch_mode" }),
  })
}

// Toggle interface elements
async function toggleSidebar() {
  await fetch("/tui/execute-command", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ command: "toggle_sidebar" }),
  })
}
```

### Use Cases

- **Interface Control**: Remote control of TUI interface elements
- **Mode Management**: Switch between different operation modes
- **Layout Control**: Adjust TUI layout and visibility
- **Workflow Integration**: Trigger TUI commands as part of larger workflows

---

## TUI Control Protocol

### Internal Endpoints

The TUI control system uses two internal endpoints for communication between the server and TUI client:

#### GET /tui/control/next

**For TUI client use only**

Retrieves the next pending request from the queue. The TUI client polls this endpoint to receive commands from external applications.

**Response:**

```json
{
  "path": "string (API endpoint path)",
  "body": "object (request body)"
}
```

#### POST /tui/control/response

**For TUI client use only**

Submits a response back to the server after executing a command. This completes the request/response cycle.

**Request Body:**

```json
{
  "result": "any (command execution result)"
}
```

### Implementation Details

- **Request Queue**: Server maintains an async queue of pending TUI requests
- **Response Queue**: Server maintains an async queue of TUI responses
- **Polling**: TUI client continuously polls for new requests
- **Timeout**: Requests timeout if TUI doesn't respond within reasonable time
- **Serialization**: All communication uses JSON serialization

### Error Handling

- **TUI Offline**: If TUI is not running, requests will timeout
- **Invalid Commands**: Unknown commands return error responses
- **Queue Overflow**: Excessive pending requests may be dropped
- **Connection Issues**: Network problems abort pending operations

---

## Integration Examples

### VS Code Extension Integration

```typescript
// Send selected text to TUI prompt
async function sendToTUI(text: string) {
  const port = await getOpencodePort()

  // Clear existing prompt and add new text
  await fetch(`http://localhost:${port}/tui/clear-prompt`, { method: "POST" })
  await fetch(`http://localhost:${port}/tui/append-prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  })

  // Submit the prompt
  await fetch(`http://localhost:${port}/tui/submit-prompt`, { method: "POST" })
}
```

### Web Interface Integration

```javascript
class TUIController {
  constructor(baseUrl = "http://localhost:8080") {
    this.baseUrl = baseUrl
  }

  async appendText(text) {
    return this.post("/tui/append-prompt", { text })
  }

  async submitPrompt() {
    return this.post("/tui/submit-prompt")
  }

  async clearPrompt() {
    return this.post("/tui/clear-prompt")
  }

  async openDialog(type) {
    const endpoints = {
      help: "/tui/open-help",
      sessions: "/tui/open-sessions",
      themes: "/tui/open-themes",
      models: "/tui/open-models",
    }

    return this.post(endpoints[type])
  }

  async executeCommand(command) {
    return this.post("/tui/execute-command", { command })
  }

  async post(endpoint, body = null) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: body ? { "Content-Type": "application/json" } : {},
      body: body ? JSON.stringify(body) : null,
    })
    return response.json()
  }
}

// Usage
const tui = new TUIController()
await tui.appendText("Debug this function: ")
await tui.submitPrompt()
```

### Automation Scripts

```bash
#!/bin/bash
# TUI automation script

BASE_URL="http://localhost:8080"

# Function to send TUI commands
tui_command() {
  curl -s -X POST "$BASE_URL/tui/$1" \
    ${2:+-H "Content-Type: application/json" -d "$2"}
}

# Send a message workflow
send_message() {
  local message="$1"

  # Clear prompt and add message
  tui_command "clear-prompt"
  tui_command "append-prompt" "{\"text\":\"$message\"}"

  # Submit the message
  tui_command "submit-prompt"
}

# Example usage
send_message "Please review the authentication code"
tui_command "open-help"
```

---

## Real-time Integration

### Event Stream Coordination

The TUI Control API works seamlessly with the Events API (`/event`) to provide coordinated real-time updates:

```javascript
// Listen for session updates while controlling TUI
const events = new EventSource("/event")
const tui = new TUIController()

events.onmessage = (event) => {
  const data = JSON.parse(event.data)

  // Coordinate TUI actions based on events
  if (data.type === "session.created") {
    // Automatically switch to new session
    tui.executeCommand("switch_session")
  }

  if (data.type === "message.completed") {
    // Clear prompt after message completion
    tui.clearPrompt()
  }
}
```

### Bidirectional Synchronization

```javascript
class SynchronizedTUIController extends TUIController {
  constructor(baseUrl) {
    super(baseUrl)
    this.setupEventStream()
  }

  setupEventStream() {
    this.events = new EventSource(`${this.baseUrl}/event`)
    this.events.onmessage = (event) => {
      this.handleServerEvent(JSON.parse(event.data))
    }
  }

  handleServerEvent(event) {
    // Sync external UI with TUI state changes
    switch (event.type) {
      case "tui.mode.changed":
        this.updateModeIndicator(event.properties.mode)
        break
      case "tui.prompt.cleared":
        this.updatePromptDisplay("")
        break
      case "tui.dialog.opened":
        this.updateUIState(event.properties.dialog)
        break
    }
  }

  async appendText(text) {
    const result = await super.appendText(text)
    // Update local UI immediately for responsiveness
    this.updatePromptDisplay(text)
    return result
  }
}
```

---

## Security Considerations

### Local Access Only

- **Network Binding**: TUI Control API is designed for local access only
- **No Authentication**: No authentication required for local development use
- **Port Binding**: Server typically binds to localhost:8080
- **Firewall**: Should not be exposed to external networks

### Command Validation

- **Command Whitelist**: Only predefined commands are accepted
- **Input Sanitization**: All input is validated and sanitized
- **Resource Limits**: Request queues have size limits to prevent DoS
- **Error Isolation**: Command failures don't affect overall system stability

### Usage Guidelines

- **Development Only**: Intended for development and automation use
- **Trusted Clients**: Only use with trusted client applications
- **Local Environment**: Keep server and TUI on same machine
- **Regular Updates**: Keep opencode updated for security patches

---

## Troubleshooting

### Common Issues

#### TUI Not Responding

```bash
# Check if TUI is running
ps aux | grep opencode

# Verify TUI polling
curl http://localhost:8080/tui/control/next

# Check server logs for errors
```

#### Request Timeouts

```javascript
// Add timeout handling
async function safeControlRequest(endpoint, body = null) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: body ? { "Content-Type": "application/json" } : {},
      body: body ? JSON.stringify(body) : null,
      signal: controller.signal,
    })
    return response.json()
  } catch (error) {
    console.error("TUI control request failed:", error)
    return false
  } finally {
    clearTimeout(timeout)
  }
}
```

#### Queue Overflow

```javascript
// Implement request throttling
class ThrottledTUIController extends TUIController {
  constructor(baseUrl, maxRequestsPerSecond = 10) {
    super(baseUrl)
    this.requestQueue = []
    this.requestRate = 1000 / maxRequestsPerSecond
    this.lastRequest = 0
  }

  async post(endpoint, body = null) {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequest

    if (timeSinceLastRequest < this.requestRate) {
      await new Promise((resolve) => setTimeout(resolve, this.requestRate - timeSinceLastRequest))
    }

    this.lastRequest = Date.now()
    return super.post(endpoint, body)
  }
}
```

### Debugging

#### Enable Debug Logging

```bash
# Set debug environment variable
export OPENCODE_DEBUG=true
opencode tui

# Or check server logs
curl http://localhost:8080/log -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "service": "tui-debug",
    "level": "info",
    "message": "Testing TUI control",
    "extra": {"endpoint": "/tui/open-help"}
  }'
```

#### Monitor Request Queue

```javascript
// Monitor queue status
async function checkQueueStatus() {
  try {
    const response = await fetch("/tui/control/next")
    if (response.ok) {
      console.log("TUI is responsive")
    }
  } catch (error) {
    console.error("TUI queue check failed:", error)
  }
}

setInterval(checkQueueStatus, 10000) // Check every 10 seconds
```

---

The TUI Control API provides powerful remote control capabilities for the opencode terminal interface, enabling seamless integration between external applications and the TUI client. Use these endpoints to build sophisticated workflows that bridge the gap between graphical interfaces and terminal-based AI interactions.
