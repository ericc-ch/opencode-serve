# File API

The File API provides operations for reading files and getting file status information.

## GET /file

Read a file's content.

**Operation ID:** `file.read`

### Description

Read and return the content of a file, with support for both raw content and patch format.

### Parameters

**Query Parameters:**

- **path** (string, required): File path to read

### Response

**Status:** `200 OK`

**Content-Type:** `application/json`

**Schema:**

```json
{
  "type": "raw" | "patch",
  "content": "string"
}
```

### Example Request

```
GET /file?path=src/utils/helpers.ts
```

### Example Response

```json
{
  "type": "raw",
  "content": "import { Item } from '../types';\n\nexport function calculateTotal(items: Item[]): number {\n  return items.reduce((sum, item) => sum + item.price, 0);\n}\n\nexport function formatCurrency(amount: number): string {\n  return `$${amount.toFixed(2)}`;\n}"
}
```

### Implementation Details

- Supports both absolute and relative file paths
- Returns raw content by default
- May return patch format for certain file types or contexts
- File content is returned as a string with preserved line endings

---

## GET /file/status

Get status information for files in the workspace.

**Operation ID:** `file.status`

### Description

Retrieve status information for files, typically including git status, modification state, and other metadata.

### Parameters

None

### Response

**Status:** `200 OK`

**Content-Type:** `application/json`

**Schema:** Array of File.Info objects

### Example Response

```json
[
  {
    "path": "src/utils/helpers.ts",
    "status": "modified",
    "size": 1024,
    "lastModified": 1683456789000,
    "type": "file"
  },
  {
    "path": "src/api/auth.ts",
    "status": "untracked",
    "size": 2048,
    "lastModified": 1683456990000,
    "type": "file"
  },
  {
    "path": "docs/",
    "status": "clean",
    "type": "directory"
  }
]
```

### File Status Types

Common status values include:

- **clean**: File is unchanged
- **modified**: File has been modified
- **untracked**: File is not tracked by version control
- **staged**: File changes are staged for commit
- **deleted**: File has been deleted
- **renamed**: File has been renamed

### Implementation Details

- Returns information for all files in the current workspace
- Includes both files and directories
- Status information is typically based on git status when available
- File sizes are in bytes
- Last modified times are Unix timestamps

---

# Mode API

The Mode API provides information about available modes in opencode.

## GET /mode

List all available modes.

**Operation ID:** `app.modes`

### Description

Retrieve a list of all configured modes, including built-in and custom modes defined in configuration.

### Parameters

None

### Response

**Status:** `200 OK`

**Content-Type:** `application/json`

**Schema:** Array of Mode.Info objects

### Example Response

```json
[
  {
    "name": "build",
    "description": "Optimized for building and compilation tasks",
    "model": "anthropic/claude-3-opus-20240229",
    "temperature": 0.1,
    "tools": {
      "bash": true,
      "edit": true,
      "read": true
    },
    "prompt": "You are focused on building, compiling, and testing code..."
  },
  {
    "name": "plan",
    "description": "Optimized for planning and architecture",
    "model": "anthropic/claude-3-sonnet-20240229",
    "temperature": 0.7,
    "tools": {
      "read": true,
      "write": false,
      "bash": false
    },
    "prompt": "You help plan software architecture and design..."
  },
  {
    "name": "general",
    "description": "General-purpose coding assistance",
    "model": "anthropic/claude-3-sonnet-20240229",
    "temperature": 0.3,
    "tools": {
      "bash": true,
      "edit": true,
      "read": true,
      "write": true
    },
    "prompt": "You are a helpful coding assistant..."
  }
]
```

### Mode Properties

- **name** (string): Unique mode identifier
- **description** (string): Human-readable description of the mode
- **model** (string, optional): Specific model to use in `provider/model` format
- **temperature** (number, optional): Model temperature setting (0.0 to 1.0)
- **tools** (object, optional): Tool availability configuration
- **prompt** (string, optional): Custom system prompt for the mode
- **disable** (boolean, optional): Whether the mode is disabled

### Implementation Details

- Modes are loaded from configuration files and markdown definitions
- Built-in modes include "build", "plan", and "general"
- Custom modes can be defined in `mode/*.md` files
- Mode configurations override global settings when active
- Tool availability can be controlled per mode

---

# Log API

The Log API allows writing log entries to the server log system.

## POST /log

Write a log entry to the server logs.

**Operation ID:** `app.log`

### Description

Submit a log entry to be written to the server's logging system with specified service, level, and message.

### Parameters

None

### Request Body

```json
{
  "service": "string",
  "level": "debug" | "info" | "error" | "warn",
  "message": "string",
  "extra": {
    "key": "value"
  }
}
```

### Request Body Properties

- **service** (string, required): Service name for the log entry
- **level** (string, required): Log level (debug, info, error, warn)
- **message** (string, required): Log message text
- **extra** (object, optional): Additional metadata for the log entry

### Response

**Status:** `200 OK`

**Content-Type:** `application/json`

**Schema:** `boolean`

### Example Request

```json
{
  "service": "client",
  "level": "info",
  "message": "User action completed successfully",
  "extra": {
    "userId": "user123",
    "action": "file_save",
    "duration": 150
  }
}
```

### Example Response

```json
true
```

### Log Levels

- **debug**: Detailed debugging information
- **info**: General informational messages
- **warn**: Warning messages for potentially problematic situations
- **error**: Error messages for serious problems

### Implementation Details

- Log entries are written to the server's logging system
- Service names help categorize log entries by component
- Extra metadata is preserved and can be used for filtering/searching
- All log levels are processed and stored according to server configuration
- Useful for debugging client-side issues and tracking user actions

### Usage Notes

- File operations are relative to the current workspace
- File status reflects git state when available
- Modes can be switched during conversations to change AI behavior
- Logging helps with debugging and monitoring system behavior
