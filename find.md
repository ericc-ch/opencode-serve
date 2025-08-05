# Find API

The Find API provides search capabilities for text content, files, and symbols within the workspace.

## GET /find

Find text content within files using regular expressions.

**Operation ID:** `find.text`

### Description

Search for text patterns within files in the current workspace using ripgrep for fast text search.

### Parameters

**Query Parameters:**

- **pattern** (string, required): Regular expression pattern to search for

### Response

**Status:** `200 OK`

**Content-Type:** `application/json`

**Schema:** Array of Ripgrep Match objects

### Example Request

```
GET /find?pattern=function\s+\w+
```

### Example Response

```json
[
  {
    "data": {
      "type": "match",
      "path": "src/utils/helpers.ts",
      "lines": {
        "text": "function calculateTotal(items: Item[]) {"
      },
      "line_number": 15,
      "absolute_offset": 342,
      "submatches": [
        {
          "match": {
            "text": "function calculateTotal"
          },
          "start": 0,
          "end": 23
        }
      ]
    }
  },
  {
    "data": {
      "type": "match",
      "path": "src/api/auth.ts",
      "lines": {
        "text": "function validateToken(token: string) {"
      },
      "line_number": 8,
      "absolute_offset": 156,
      "submatches": [
        {
          "match": {
            "text": "function validateToken"
          },
          "start": 0,
          "end": 22
        }
      ]
    }
  }
]
```

### Implementation Details

- Uses ripgrep for fast text search
- Searches within the current working directory
- Limited to 10 results by default
- Supports full regular expression syntax
- Returns file paths relative to workspace root

---

## GET /find/file

Find files by name or path pattern.

**Operation ID:** `find.files`

### Description

Search for files by name or path pattern within the current workspace.

### Parameters

**Query Parameters:**

- **query** (string, required): File name or path pattern to search for

### Response

**Status:** `200 OK`

**Content-Type:** `application/json`

**Schema:** Array of strings (file paths)

### Example Request

```
GET /find/file?query=*.ts
```

### Example Response

```json
[
  "src/utils/helpers.ts",
  "src/api/auth.ts",
  "src/components/Button.ts",
  "tests/unit/helpers.test.ts",
  "src/types/index.ts"
]
```

### Implementation Details

- Uses ripgrep for fast file search
- Searches within the current working directory
- Limited to 10 results by default
- Supports glob patterns and regular expressions
- Returns file paths relative to workspace root

---

## GET /find/symbol

Find workspace symbols using Language Server Protocol (LSP).

**Operation ID:** `find.symbols`

### Description

Search for symbols (functions, classes, variables, etc.) across the workspace using LSP workspace symbol search.

### Parameters

**Query Parameters:**

- **query** (string, required): Symbol name or pattern to search for

### Response

**Status:** `200 OK`

**Content-Type:** `application/json`

**Schema:** Array of LSP Symbol objects

### Example Request

```
GET /find/symbol?query=calculateTotal
```

### Example Response

```json
[
  {
    "name": "calculateTotal",
    "kind": 12,
    "location": {
      "uri": "file:///workspace/src/utils/helpers.ts",
      "range": {
        "start": {
          "line": 14,
          "character": 9
        },
        "end": {
          "line": 14,
          "character": 22
        }
      }
    },
    "containerName": "helpers"
  },
  {
    "name": "calculateTotalPrice",
    "kind": 12,
    "location": {
      "uri": "file:///workspace/src/api/pricing.ts",
      "range": {
        "start": {
          "line": 45,
          "character": 16
        },
        "end": {
          "line": 45,
          "character": 35
        }
      }
    },
    "containerName": "pricing"
  }
]
```

### Symbol Kinds

LSP symbol kinds are represented as numbers:

- 1: File
- 2: Module
- 3: Namespace
- 4: Package
- 5: Class
- 6: Method
- 7: Property
- 8: Field
- 9: Constructor
- 10: Enum
- 11: Interface
- 12: Function
- 13: Variable
- 14: Constant
- 15: String
- 16: Number
- 17: Boolean
- 18: Array

### Implementation Details

- Uses Language Server Protocol (LSP) for symbol search
- Requires active LSP servers for the file types in the workspace
- Returns symbols from all files in the workspace
- Provides precise location information including line and character positions
- Symbol search is fuzzy and supports partial matches

### Usage Notes

- All Find endpoints operate within the current workspace directory
- Search results are limited to prevent overwhelming responses
- Regular expression syntax varies by endpoint (ripgrep vs LSP)
- File paths are returned relative to the workspace root
- LSP symbol search requires appropriate language servers to be running
