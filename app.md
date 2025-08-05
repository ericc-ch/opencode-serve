# App API

The App API provides endpoints for getting application information and initialization.

## GET /app

Get application information including paths, hostname, and initialization status.

**Operation ID:** `app.get`

### Description

Retrieve comprehensive application information including path configuration, system details, and initialization status.

### Parameters

None

### Response

**Status:** `200 OK`

**Content-Type:** `application/json`

**Schema:** [App](#app-schema)

### Example Response

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

### Implementation Details

- Returns information from the current app context
- Paths are automatically determined based on the working directory
- Git detection identifies if the current directory is within a git repository
- Data path is project-specific when in a git repository, otherwise global

---

## POST /app/init

Initialize the application by recording the initialization timestamp.

**Operation ID:** `app.init`

### Description

Initialize the application by setting the initialization time and persisting it to the app state file.

### Parameters

None

### Request Body

None

### Response

**Status:** `200 OK`

**Content-Type:** `application/json`

**Schema:** `boolean`

### Example Response

```json
true
```

### Implementation Details

- Sets `initialized` timestamp to current time
- Persists initialization state to `app.json` in the data directory
- Always returns `true` on successful initialization
- Can be called multiple times to update the initialization timestamp

### Usage Notes

- Used to mark when the application was first set up or last reset
- The timestamp is available via the GET /app endpoint
- Essential for tracking application lifecycle and state

---

## App Schema

The App schema provides comprehensive information about the application environment.

### Properties

- **hostname** (string): System hostname where the application is running
- **git** (boolean): Whether the current directory is within a git repository
- **path** (object): Path configuration for the application
  - **config** (string): Configuration directory path
  - **data** (string): Data storage directory path (project-specific or global)
  - **root** (string): Root directory (git repository root or current working directory)
  - **cwd** (string): Current working directory
  - **state** (string): State storage directory path
- **time** (object): Timing information
  - **initialized** (number, optional): Unix timestamp when app was initialized

### Path Behavior

- **root**: Set to git repository root if available, otherwise current working directory
- **data**: Project-specific when in git repository (`project/{repo-name}`), otherwise global
- **config**: User's configuration directory (typically `~/.config/opencode`)
- **state**: User's state directory (typically `~/.local/state/opencode`)
- **cwd**: The directory where opencode was started
