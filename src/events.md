# Events API

The Events API provides a Server-Sent Events (SSE) stream for real-time updates from the opencode server.

## GET /event

Subscribe to the event stream to receive real-time updates.

**Operation ID:** `event.subscribe`

### Description

Get events via Server-Sent Events (SSE) stream. The connection automatically sends a `server.connected` event when the client connects, then streams all subsequent events.

### Parameters

None

### Response

**Status:** `200 OK`

**Content-Type:** `application/json` (via SSE)

**Schema:** [Event](#event-schema)

### Implementation Details

- Uses Server-Sent Events (SSE) for real-time streaming
- Automatically sends a `server.connected` event upon connection
- Subscribes to all events via the internal Bus system
- Connection automatically cleans up when client disconnects

### Example Response Stream

```
data: {"type": "server.connected", "properties": {}}

data: {"type": "session.updated", "properties": {"info": {"id": "ses123", "title": "Chat Session"}}}

data: {"type": "message.part.updated", "properties": {"part": {"id": "prt456", "type": "text", "text": "Hello"}}}
```

### Usage Notes

- This endpoint establishes a persistent connection for real-time updates
- Events are sent as JSON objects in the SSE data field
- Connection will be automatically closed if client disconnects
- All events from the internal event bus are forwarded to connected clients

## Event Types

opencode emits 17 different event types covering server status, session management, messaging, file operations, permissions, and system updates.

### Server Events

#### server.connected

Sent immediately when a client connects to the event stream.

**Type:** `server.connected`

**Properties:**

- Empty object `{}`

**Triggered when:**

- Client establishes SSE connection to `/event` endpoint

**Example:**

```json
{
  "type": "server.connected",
  "properties": {}
}
```

### Session Events

#### session.updated

Fired when session information is modified, including title changes, sharing status updates, and other metadata changes.

**Type:** `session.updated`

**Properties:**

- `info` ([Session](#session-schema)) - Complete session information

**Triggered when:**

- **Session title is automatically updated** (happens after first message in new sessions)
- Session sharing status is changed (shared/unshared)
- Session metadata is modified
- Session revert state changes

**Example:**

```json
{
  "type": "session.updated",
  "properties": {
    "info": {
      "id": "ses123",
      "title": "Updated Chat Session",
      "version": "1.0.0",
      "time": {
        "created": 1704067200000,
        "updated": 1704067300000
      }
    }
  }
}
```

#### session.deleted

Emitted when a session is permanently removed from the system.

**Type:** `session.deleted`

**Properties:**

- `info` ([Session](#session-schema)) - Session information before deletion

**Triggered when:**

- Session is deleted via DELETE `/session/{id}` endpoint
- Session cleanup processes remove old sessions

**Example:**

```json
{
  "type": "session.deleted",
  "properties": {
    "info": {
      "id": "ses123",
      "title": "Deleted Session",
      "version": "1.0.0",
      "time": {
        "created": 1704067200000,
        "updated": 1704067200000
      }
    }
  }
}
```

#### session.idle

Indicates when a session transitions to an idle state, typically after message processing completes.

**Type:** `session.idle`

**Properties:**

- `sessionID` (string) - ID of the idle session

**Triggered when:**

- Message processing completes successfully
- Session becomes inactive after assistant response

**Example:**

```json
{
  "type": "session.idle",
  "properties": {
    "sessionID": "ses123"
  }
}
```

#### session.error

Fired when an error occurs during session processing, including provider authentication errors and system failures.

**Type:** `session.error`

**Properties:**

- `sessionID` (string, optional) - ID of the session where error occurred
- `error` ([Error](#error-schema)) - Error details with name and data

**Triggered when:**

- Provider authentication fails
- Message processing encounters errors
- System errors during session operations

**Example:**

```json
{
  "type": "session.error",
  "properties": {
    "sessionID": "ses123",
    "error": {
      "name": "ProviderAuthError",
      "data": {
        "providerID": "anthropic",
        "message": "Invalid API key"
      }
    }
  }
}
```

### Message Events

#### message.updated

Emitted when message metadata is updated, such as completion status, timing, or error states.

**Type:** `message.updated`

**Properties:**

- `info` ([Message](#message-schema)) - Complete message information

**Triggered when:**

- Assistant message completion status changes
- Message timing information is updated
- Message error state changes

**Example:**

```json
{
  "type": "message.updated",
  "properties": {
    "info": {
      "id": "msg123",
      "sessionID": "ses123",
      "role": "assistant",
      "time": {
        "created": 1704067200000,
        "completed": 1704067250000
      },
      "modelID": "claude-3-sonnet",
      "providerID": "anthropic"
    }
  }
}
```

#### message.removed

Fired when a message is deleted from a session.

**Type:** `message.removed`

**Properties:**

- `sessionID` (string) - Session containing the removed message
- `messageID` (string) - ID of the removed message

**Triggered when:**

- Message is reverted in a session
- Message is explicitly deleted

**Example:**

```json
{
  "type": "message.removed",
  "properties": {
    "sessionID": "ses123",
    "messageID": "msg123"
  }
}
```

#### message.part.updated

Emitted when individual message parts are updated, including text content, tool results, and file attachments.

**Type:** `message.part.updated`

**Properties:**

- `part` ([Part](#part-schema)) - Complete part information

**Triggered when:**

- Text parts receive streaming content
- Tool execution state changes (pending → running → completed/error)
- File parts are processed and attached
- Step parts mark completion with cost/token information

**Example:**

```json
{
  "type": "message.part.updated",
  "properties": {
    "part": {
      "id": "prt123",
      "sessionID": "ses123",
      "messageID": "msg123",
      "type": "text",
      "text": "Hello, how can I help you?",
      "synthetic": false,
      "time": {
        "start": 1704067200000,
        "end": 1704067205000
      }
    }
  }
}
```

#### message.part.removed

Fired when a message part is deleted from a message.

**Type:** `message.part.removed`

**Properties:**

- `sessionID` (string) - Session containing the message
- `messageID` (string) - Message containing the part
- `partID` (string) - ID of the removed part

**Triggered when:**

- Parts are removed during message reversion
- Parts are explicitly deleted

**Example:**

```json
{
  "type": "message.part.removed",
  "properties": {
    "sessionID": "ses123",
    "messageID": "msg123",
    "partID": "prt123"
  }
}
```

### File System Events

#### file.edited

Emitted when files are modified through opencode tools like Write and Edit.

**Type:** `file.edited`

**Properties:**

- `file` (string) - Path to the edited file

**Triggered when:**

- Write tool creates or overwrites a file
- Edit tool modifies file content
- File system operations complete successfully

**Example:**

```json
{
  "type": "file.edited",
  "properties": {
    "file": "/path/to/modified/file.ts"
  }
}
```

#### file.watcher.updated

Fired when the file system watcher detects changes to files in the project.

**Type:** `file.watcher.updated`

**Properties:**

- `file` (string) - Path to the changed file
- `event` (string) - Type of change: "rename" or "change"

**Triggered when:**

- Files are renamed or moved
- File content is modified outside of opencode
- File system events are detected by the watcher

**Example:**

```json
{
  "type": "file.watcher.updated",
  "properties": {
    "file": "/path/to/changed/file.ts",
    "event": "change"
  }
}
```

### Permission Events

#### permission.updated

Emitted when a new permission request is created, requiring user approval for restricted operations.

**Type:** `permission.updated`

**Properties:**

- ([Permission](#permission-schema)) - Complete permission request details

**Triggered when:**

- Tools request permission for restricted operations
- Bash commands require user approval
- File edit operations need confirmation

**Example:**

```json
{
  "type": "permission.updated",
  "properties": {
    "id": "perm123",
    "type": "bash",
    "pattern": "npm install",
    "sessionID": "ses123",
    "messageID": "msg123",
    "callID": "call123",
    "title": "Execute bash command",
    "metadata": {
      "command": "npm install"
    },
    "time": {
      "created": 1704067200000
    }
  }
}
```

#### permission.replied

Fired when a user responds to a permission request.

**Type:** `permission.replied`

**Properties:**

- `sessionID` (string) - Session containing the permission request
- `permissionID` (string) - ID of the permission request
- `response` (string) - User response: "once", "always", or "reject"

**Triggered when:**

- User responds to permission request via POST `/session/{id}/permissions/{permissionID}`
- Permission request is approved or denied

**Example:**

```json
{
  "type": "permission.replied",
  "properties": {
    "sessionID": "ses123",
    "permissionID": "perm123",
    "response": "once"
  }
}
```

### System Events

#### storage.write

Emitted when data is written to opencode's internal storage system.

**Type:** `storage.write`

**Properties:**

- `key` (string) - Storage key that was written
- `content` (any) - Content that was stored

**Triggered when:**

- Configuration data is saved
- Session state is persisted
- Cache data is written

**Example:**

```json
{
  "type": "storage.write",
  "properties": {
    "key": "session.ses123.messages",
    "content": {...}
  }
}
```

#### lsp.client.diagnostics

Fired when Language Server Protocol (LSP) diagnostics are updated for files.

**Type:** `lsp.client.diagnostics`

**Properties:**

- `serverID` (string) - ID of the LSP server
- `path` (string) - File path for which diagnostics were updated

**Triggered when:**

- LSP server provides new diagnostic information
- Syntax errors or warnings are detected
- Code analysis results are available

**Example:**

```json
{
  "type": "lsp.client.diagnostics",
  "properties": {
    "serverID": "typescript",
    "path": "/path/to/file.ts"
  }
}
```

#### installation.updated

Emitted when opencode is updated to a new version.

**Type:** `installation.updated`

**Properties:**

- `version` (string) - New version that was installed

**Triggered when:**

- Automatic update process completes
- Manual update is performed
- Version upgrade is successful

**Example:**

```json
{
  "type": "installation.updated",
  "properties": {
    "version": "1.2.3"
  }
}
```

#### ide.installed

Fired when an IDE integration is installed or updated.

**Type:** `ide.installed`

**Properties:**

- `ide` (string) - Name of the IDE that was installed

**Triggered when:**

- VSCode extension is installed
- IDE plugin is updated
- IDE integration is configured

**Example:**

```json
{
  "type": "ide.installed",
  "properties": {
    "ide": "vscode"
  }
}
```

## Event Schema

Events follow a consistent structure with a `type` field and a `properties` object containing event-specific data.

**Structure:**

```json
{
  "type": "string",
  "properties": {}
}
```

**Event Discriminator:**

Events use a discriminated union based on the `type` field. Each event type has a specific schema for its `properties` object.

**Common Properties:**

- `type` (string) - Event type identifier
- `properties` (object) - Event-specific data payload

For complete Event schema details, see the [OpenAPI specification](opencode-openapi.json).
