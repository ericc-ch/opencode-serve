# Sessions API

The Sessions API manages conversation sessions, allowing you to create, list, delete, and interact with AI conversations.

## GET /session

List all sessions sorted by most recently updated.

**Operation ID:** `session.list`

### Description

Retrieve a list of all sessions, sorted by update time in descending order (most recent first).

### Parameters

None

### Response

**Status:** `200 OK`

**Content-Type:** `application/json`

**Schema:** Array of [Session](#session-schema)

### Example Response

```json
[
  {
    "id": "session_abc123",
    "title": "Bug fix for authentication",
    "version": "0.0.3",
    "time": {
      "created": 1683456789000,
      "updated": 1683456990000
    },
    "share": {
      "url": "https://opencode.ai/share/abc123"
    }
  },
  {
    "id": "session_def456",
    "title": "New feature implementation",
    "version": "0.0.3",
    "time": {
      "created": 1683456000000,
      "updated": 1683456500000
    }
  }
]
```

---

## POST /session

Create a new session.

**Operation ID:** `session.create`

### Description

Create a new conversation session with a unique ID and default settings.

### Parameters

None

### Request Body

None

### Response

**Status:** `200 OK`

**Content-Type:** `application/json`

**Schema:** [Session](#session-schema)

**Status:** `400 Bad Request`

**Content-Type:** `application/json`

**Schema:** [Error](#error-schema)

### Example Response

```json
{
  "id": "session_xyz789",
  "title": "Untitled Session",
  "version": "0.0.3",
  "time": {
    "created": 1683457000000,
    "updated": 1683457000000
  }
}
```

---

## DELETE /session/{id}

Delete a session and all its data.

**Operation ID:** `session.delete`

### Description

Permanently delete a session and all associated messages, history, and data.

### Parameters

- **id** (path, string, required): Session ID

### Response

**Status:** `200 OK`

**Content-Type:** `application/json`

**Schema:** `boolean`

### Example Response

```json
true
```

---

## POST /session/{id}/init

Initialize a session by analyzing the app and creating an AGENTS.md file.

**Operation ID:** `session.init`

### Description

Analyze the current application structure and create or update an AGENTS.md file with project-specific agent configurations.

### Parameters

- **id** (path, string, required): Session ID

### Request Body

```json
{
  "messageID": "string",
  "providerID": "string",
  "modelID": "string"
}
```

### Response

**Status:** `200 OK`

**Content-Type:** `application/json`

**Schema:** `boolean`

### Example Response

```json
true
```

---

## POST /session/{id}/message

Send a message to a session and get an AI response.

**Operation ID:** `session.chat`

### Description

Send a new message to the session and receive an AI assistant response.

### Parameters

- **id** (path, string, required): Session ID

### Request Body

The request body follows the `Session.ChatInput` schema (excluding sessionID).

### Response

**Status:** `200 OK`

**Content-Type:** `application/json`

**Schema:** MessageV2.Assistant

### Implementation Details

- Processes the message through the AI model
- Updates the session with the new conversation
- Returns the assistant's response message

---

## Additional Session Endpoints

The Sessions API includes several other endpoints for advanced functionality:

### POST /session/{id}/abort

Abort a currently running session.

### POST /session/{id}/share

Share a session publicly and get a share URL.

### DELETE /session/{id}/share

Remove public sharing from a session.

### POST /session/{id}/summarize

Generate a summary of the session conversation.

### GET /session/{id}/message

List all messages in a session.

### GET /session/{id}/message/{messageID}

Get a specific message from a session.

### POST /session/{id}/revert

Revert messages back to a specific point.

### POST /session/{id}/unrevert

Restore all reverted messages.

### POST /session/{id}/permissions/{permissionID}

Respond to a permission request from the AI.

---

## Session Schema

The Session schema represents a conversation session with metadata and state.

### Properties

- **id** (string): Unique session identifier
- **parentID** (string, optional): Parent session ID for forked sessions
- **title** (string): Human-readable session title
- **version** (string): Application version when session was created
- **time** (object): Timing information
  - **created** (number): Unix timestamp when session was created
  - **updated** (number): Unix timestamp when session was last updated
- **share** (object, optional): Sharing information
  - **url** (string): Public URL for shared session
- **revert** (object, optional): Revert state information
  - **messageID** (string): ID of message to revert to
  - **partID** (string, optional): Specific part ID within message
  - **snapshot** (string, optional): Snapshot data for revert
  - **diff** (string, optional): Diff information for revert

### Session States

Sessions can be in various states:

- **Active**: Currently accepting new messages
- **Shared**: Publicly accessible via share URL
- **Reverted**: Has messages hidden/reverted to a previous state
- **Summarized**: Has been processed for summary generation

### Usage Notes

- Session IDs are automatically generated unique identifiers
- Sessions persist until explicitly deleted
- Shared sessions remain accessible via their share URL
- Reverting a session hides newer messages but doesn't delete them
- All session operations emit events via the event stream
