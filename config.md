# Config API

The Config API provides access to the application configuration, including user preferences, model settings, keybinds, and more.

## GET /config

Get the complete configuration information for the current application context.

**Operation ID:** `config.get`

### Description

Retrieve the merged configuration from multiple sources including global config, project-specific config files (opencode.json/opencode.jsonc), custom config overrides, and agent/mode definitions.

### Parameters

None

### Response

**Status:** `200 OK`

**Content-Type:** `application/json`

**Schema:** [Config](#config-schema)

### Example Response

```json
{
  "$schema": "https://opencode.ai/config.json",
  "theme": "dark",
  "username": "developer",
  "model": "anthropic/claude-3-sonnet-20240229",
  "small_model": "anthropic/claude-3-haiku-20240307",
  "share": "manual",
  "autoupdate": true,
  "keybinds": {
    "leader": "ctrl+x",
    "app_help": "<leader>h",
    "session_new": "<leader>n",
    "editor_open": "<leader>e"
  },
  "mode": {
    "build": {
      "model": "anthropic/claude-3-opus-20240229",
      "temperature": 0.1
    }
  },
  "agent": {
    "general": {
      "description": "General-purpose coding assistant",
      "prompt": "You are a helpful coding assistant..."
    }
  },
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "sk-..."
      }
    }
  },
  "mcp": {
    "filesystem": {
      "type": "local",
      "command": ["mcp-server-filesystem", "/path/to/workspace"],
      "enabled": true
    }
  }
}
```

### Implementation Details

- Merges configuration from multiple sources in priority order:
  1. Global configuration files (`~/.config/opencode/`)
  2. Project-specific config files (`opencode.json`, `opencode.jsonc`)
  3. Custom config file (via `OPENCODE_CONFIG` flag)
  4. Well-known provider configurations (via auth tokens)
  5. Agent definitions from markdown files
  6. Mode definitions from markdown files
  7. Plugin files from `.ts` files
- Automatically migrates deprecated fields
- Sets default username from system user if not provided
- Processes template variables: `{env:VAR_NAME}` and `{file:path/to/file}`

### Configuration Sources

The configuration is loaded and merged from multiple sources:

1. **Global Config**: `~/.config/opencode/config.json`, `opencode.json`, `opencode.jsonc`
2. **Project Config**: `opencode.json`, `opencode.jsonc` files found in current directory and parents
3. **Custom Config**: File specified by `OPENCODE_CONFIG` environment variable
4. **Well-known Configs**: Retrieved from authenticated providers' `/.well-known/opencode` endpoints
5. **Agent Files**: Markdown files in `agent/*.md` directories
6. **Mode Files**: Markdown files in `mode/*.md` directories
7. **Plugin Files**: TypeScript files in `plugin/*.ts` directories

---

## Config Schema

The Config schema defines all available configuration options for opencode.

### Core Properties

- **$schema** (string, optional): JSON schema reference for validation
- **theme** (string, optional): Theme name for the interface
- **username** (string, optional): Custom username override
- **model** (string, optional): Default model in `provider/model` format
- **small_model** (string, optional): Small model for summarization tasks
- **share** (enum, optional): Sharing behavior (`manual`, `auto`, `disabled`)
- **autoupdate** (boolean, optional): Enable automatic updates

### Keybinds Configuration

The `keybinds` object allows customization of all keyboard shortcuts:

```json
{
  "keybinds": {
    "leader": "ctrl+x",
    "app_help": "<leader>h",
    "session_new": "<leader>n",
    "editor_open": "<leader>e",
    "input_submit": "enter",
    "input_newline": "shift+enter,ctrl+j"
  }
}
```

### Mode Configuration

Modes allow different model behaviors for specific tasks:

```json
{
  "mode": {
    "build": {
      "model": "anthropic/claude-3-opus-20240229",
      "temperature": 0.1,
      "tools": {
        "bash": true,
        "edit": true
      }
    },
    "plan": {
      "model": "anthropic/claude-3-sonnet-20240229",
      "temperature": 0.7
    }
  }
}
```

### Agent Configuration

Agents are specialized assistants with custom prompts:

```json
{
  "agent": {
    "general": {
      "description": "General-purpose coding assistant",
      "model": "anthropic/claude-3-sonnet-20240229",
      "prompt": "You are a helpful coding assistant..."
    }
  }
}
```

### Provider Configuration

Custom provider settings and model overrides:

```json
{
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "sk-...",
        "baseURL": "https://api.anthropic.com"
      },
      "models": {
        "claude-3-custom": {
          "name": "claude-3-sonnet-20240229",
          "contextLength": 200000
        }
      }
    }
  }
}
```

### MCP (Model Context Protocol)

Configuration for MCP servers that extend tool capabilities:

```json
{
  "mcp": {
    "filesystem": {
      "type": "local",
      "command": ["mcp-server-filesystem", "/workspace"],
      "enabled": true,
      "environment": {
        "DEBUG": "1"
      }
    },
    "web-search": {
      "type": "remote",
      "url": "https://api.example.com/mcp",
      "enabled": true,
      "headers": {
        "Authorization": "Bearer token"
      }
    }
  }
}
```

### Permission System

Control what actions opencode can perform:

```json
{
  "permission": {
    "edit": "ask",
    "bash": {
      "default": "ask",
      "npm": "allow",
      "git": "allow"
    }
  }
}
```

### Template Variables

Configuration files support template variables:

- **Environment Variables**: `{env:VARIABLE_NAME}`
- **File Contents**: `{file:path/to/file}` or `{file:~/path/to/file}`

---

## GET /config/providers

Get available AI model providers and their default models.

**Operation ID:** `config.providers`

### Description

Retrieve a list of all available AI model providers, including their configurations and the default model for each provider.

### Parameters

None

### Response

**Status:** `200 OK`

**Content-Type:** `application/json`

**Schema:**

```json
{
  "providers": "array of Provider objects",
  "default": "object mapping provider IDs to default model IDs"
}
```

### Example Response

```json
{
  "providers": [
    {
      "id": "anthropic",
      "name": "Anthropic",
      "models": {
        "claude-3-sonnet-20240229": {
          "id": "claude-3-sonnet-20240229",
          "name": "Claude 3 Sonnet",
          "contextLength": 200000,
          "pricing": {
            "input": 3,
            "output": 15
          }
        },
        "claude-3-haiku-20240307": {
          "id": "claude-3-haiku-20240307",
          "name": "Claude 3 Haiku",
          "contextLength": 200000,
          "pricing": {
            "input": 0.25,
            "output": 1.25
          }
        }
      }
    },
    {
      "id": "openai",
      "name": "OpenAI",
      "models": {
        "gpt-4": {
          "id": "gpt-4",
          "name": "GPT-4",
          "contextLength": 8192,
          "pricing": {
            "input": 30,
            "output": 60
          }
        }
      }
    }
  ],
  "default": {
    "anthropic": "claude-3-sonnet-20240229",
    "openai": "gpt-4"
  }
}
```

### Implementation Details

- Providers are loaded from available integrations and configurations
- Default models are determined by provider-specific sorting logic
- Pricing information is provided where available
- Models include context length and capability information

### Usage Notes

- Configuration is loaded once at startup and cached
- Changes require application restart to take effect
- JSON with comments (JSONC) is supported
- Files are processed in order with later sources overriding earlier ones
- Agent and mode markdown files are automatically discovered and loaded
