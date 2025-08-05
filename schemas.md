# API Schemas

This document describes the data schemas used throughout the opencode API.

## Event Schema

Events represent real-time updates sent via the Server-Sent Events (SSE) stream. All events follow a discriminated union pattern based on the `type` field.

### Base Event Structure

```json
{
  "type": "string",
  "properties": {}
}
```

### Event Types

Events are categorized by their `type` field, which determines the structure of the `properties` object:

#### Server Events

- **server.connected** - Sent when a client connects to the event stream

#### Session Events

- **session.updated** - Session metadata has been updated
- **session.deleted** - Session has been deleted
- **session.idle** - Session has become idle
- **session.error** - Error occurred in session

#### Message Events

- **message.updated** - Message has been updated
- **message.removed** - Message has been removed
- **message.part.updated** - Part of a message has been updated
- **message.part.removed** - Part of a message has been removed

#### File Events

- **file.edited** - File has been edited
- **file.watcher.updated** - File watcher detected changes

#### Permission Events

- **permission.updated** - Permission request has been updated
- **permission.replied** - Response to permission request

#### System Events

- **installation.updated** - Installation status changed
- **lsp.client.diagnostics** - LSP diagnostics received
- **storage.write** - Data written to storage
- **ide.installed** - IDE integration installed

### Example Events

```json
{
  "type": "server.connected",
  "properties": {}
}

{
  "type": "session.updated",
  "properties": {
    "sessionId": "ses_abc123",
    "title": "New session title"
  }
}

{
  "type": "file.edited",
  "properties": {
    "path": "src/utils/helpers.ts",
    "sessionId": "ses_abc123"
  }
}
```

---

## App Schema

The App schema provides information about the application environment and configuration.

```json
{
  "hostname": "string",
  "git": "boolean",
  "path": {
    "config": "string",
    "data": "string",
    "root": "string",
    "cwd": "string",
    "state": "string"
  },
  "time": {
    "initialized": "number"
  }
}
```

### Properties

- **hostname** (string, required): System hostname
- **git** (boolean, required): Whether current directory is in a git repository
- **path** (object, required): Path configuration
  - **config** (string, required): Configuration directory path
  - **data** (string, required): Data storage directory path
  - **root** (string, required): Project root directory
  - **cwd** (string, required): Current working directory
  - **state** (string, required): State storage directory path
- **time** (object, required): Timing information
  - **initialized** (number, optional): Unix timestamp when app was initialized

### Example

```json
{
  "hostname": "dev-machine",
  "git": true,
  "path": {
    "config": "/home/user/.config/opencode",
    "data": "/home/user/.local/share/opencode/project/my-project",
    "root": "/home/user/projects/my-project",
    "cwd": "/home/user/projects/my-project/src",
    "state": "/home/user/.local/state/opencode"
  },
  "time": {
    "initialized": 1683456789000
  }
}
```

---

## Config Schema

The Config schema defines all available configuration options for opencode. This is a comprehensive schema with many optional properties.

### Core Properties

```json
{
  "$schema": "string",
  "theme": "string",
  "username": "string",
  "model": "string",
  "small_model": "string",
  "share": "manual" | "auto" | "disabled",
  "autoupdate": "boolean"
}
```

### Advanced Configuration

The Config schema includes nested objects for:

- **keybinds**: Keyboard shortcut configurations
- **mode**: Mode-specific settings (build, plan, etc.)
- **agent**: Agent configurations
- **provider**: AI provider settings
- **mcp**: Model Context Protocol server configurations
- **formatter**: Code formatter settings
- **lsp**: Language Server Protocol configurations
- **permission**: Permission system settings
- **experimental**: Experimental features

See the full Config API documentation for detailed property descriptions and examples.

---

## Session Schema

The Session schema represents a conversation session with metadata and state information.

```json
{
  "id": "string",
  "parentID": "string",
  "share": {
    "url": "string"
  },
  "title": "string",
  "version": "string",
  "time": {
    "created": "number",
    "updated": "number"
  },
  "revert": {
    "messageID": "string",
    "partID": "string",
    "snapshot": "string",
    "diff": "string"
  }
}
```

### Properties

- **id** (string, required): Unique session identifier (pattern: `^ses`)
- **parentID** (string, optional): Parent session ID for forked sessions (pattern: `^ses`)
- **title** (string, required): Human-readable session title
- **version** (string, required): Application version when session was created
- **time** (object, required): Timing information
  - **created** (number, required): Unix timestamp when created
  - **updated** (number, required): Unix timestamp when last updated
- **share** (object, optional): Sharing information
  - **url** (string, required): Public URL for shared session
- **revert** (object, optional): Revert state information
  - **messageID** (string, required): ID of message to revert to
  - **partID** (string, optional): Specific part ID within message
  - **snapshot** (string, optional): Snapshot data for revert
  - **diff** (string, optional): Diff information for revert

### Example

```json
{
  "id": "ses_abc123",
  "title": "Bug fix for authentication",
  "version": "0.0.3",
  "time": {
    "created": 1683456789000,
    "updated": 1683456990000
  },
  "share": {
    "url": "https://opencode.ai/share/abc123"
  }
}
```

---

## Error Schema

The Error schema provides a standardized format for API error responses.

```json
{
  "data": {}
}
```

### Properties

- **data** (object, required): Error details and context information

The `data` object contains error-specific information and can include any additional properties relevant to the specific error type.

### Example

```json
{
  "data": {
    "message": "Session not found",
    "code": "SESSION_NOT_FOUND",
    "sessionId": "ses_invalid123"
  }
}
```

---

## Additional Schemas

The API includes many other specialized schemas for different components:

### Message Schemas

- **Message**: Base message structure
- **AssistantMessage**: AI assistant messages
- **UserMessage**: User messages
- **Part**: Message parts (text, tool calls, files, etc.)

### Provider Schemas

- **Provider**: AI model provider information
- **Model**: AI model specifications

### Tool Schemas

- **ToolState**: Tool execution states
- **Permission**: Permission request structures

### File Schemas

- **File**: File information and content
- **Range**: Text range specifications

For complete schema definitions, refer to the OpenAPI specification at `/docs/opencode-openapi.json`.

---

## Schema Usage Notes

- All timestamps are Unix timestamps (milliseconds since epoch)
- String patterns like `^ses` indicate required prefixes
- Optional properties may be omitted from responses
- Additional properties beyond the schema may be present in some cases
- Schemas follow OpenAPI 3.0 specification standards
