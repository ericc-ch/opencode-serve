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

data: {"type": "session.created", "properties": {"id": "abc123"}}

data: {"type": "tool.called", "properties": {"sessionId": "abc123", "tool": "read"}}
```

### Usage Notes

- This endpoint establishes a persistent connection for real-time updates
- Events are sent as JSON objects in the SSE data field
- Connection will be automatically closed if client disconnects
- All events from the internal event bus are forwarded to connected clients

## Event Schema

Events follow a consistent structure with a `type` field and a `properties` object containing event-specific data.

**Structure:**

```json
{
  "type": "string",
  "properties": {}
}
```

**Common Event Types:**

- `server.connected` - Sent immediately when client connects
- `session.created` - When a new session is created
- `session.deleted` - When a session is deleted
- `tool.called` - When a tool is called in a session
- `message.sent` - When a message is sent to a session

For complete Event schema details, see the OpenAPI specification.
