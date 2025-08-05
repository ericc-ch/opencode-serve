# opencode Documentation Site

A beautiful static site generator for Markdown documentation built with React, Bun, and Tailwind CSS. Transform your `docs/` folder into a professional documentation website with automatic navigation, syntax highlighting, and responsive design.

## ✨ Features

- 📝 **Markdown Support**: Full GitHub Flavored Markdown (GFM) support with tables, task lists, footnotes
- 🎨 **Syntax Highlighting**: Beautiful code highlighting with Prism.js (supports 100+ languages)
- 🎯 **Static Generation**: Fast, SEO-friendly static HTML pages (no JavaScript runtime needed)
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- 🔍 **Auto Navigation**: Automatic sidebar navigation generation from file structure
- ⚡ **Fast**: Built with Bun for optimal performance and instant rebuilds
- 🧪 **Tested**: Comprehensive Playwright integration tests
- 🎭 **shadcn/ui Ready**: Integrated with shadcn/ui components for consistent design

## 🚀 Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Build the Documentation Site

```bash
bun run build:docs
```

This command will:
- 🔍 Automatically discover all `.md` files in the `docs/` directory  
- 🎨 Process them with syntax highlighting and GFM features
- 📄 Generate static HTML pages with navigation
- 📁 Output everything to the `dist/` directory
- ✅ Generate **9 pages total** (1 homepage + 8 documentation pages)

### 3. Serve the Site Locally

```bash
bun run serve:docs
```

🌐 Visit `http://localhost:3000` to view your documentation site.

### 4. Run Integration Tests

```bash
bun test
```

Runs comprehensive Playwright tests covering navigation, rendering, and responsive design.

## 📁 Project Structure

```
├── docs/                    # 📝 Markdown documentation files
│   ├── api-reference.md     # Main API documentation  
│   ├── sessions.md          # Sessions API
│   ├── app.md              # App API
│   ├── config.md           # Config API
│   ├── events.md           # Events API
│   ├── find.md             # Find API
│   ├── file-mode-log.md    # File API
│   ├── schemas.md          # API Schemas
│   └── opencode-openapi.json # OpenAPI specification
├── src/
│   ├── ssg.tsx             # 🏗️ Static Site Generator core
│   ├── server.tsx          # 🌐 Development server
│   └── components/         # 🧩 React components (shadcn/ui)
├── tests/
│   └── docs.spec.ts        # 🧪 Playwright integration tests
├── dist/                   # 📦 Generated static site (deployable)
│   ├── index.html          # Homepage with doc cards
│   ├── api-reference/      # Individual doc pages
│   ├── sessions/
│   └── ...
└── playwright.config.ts    # ⚙️ Test configuration
```

## 🎯 How It Works

The SSG follows a simple 3-step process:

1. **🔍 Discovery**: Scans the `docs/` directory for `.md` files automatically
2. **⚙️ Processing**: Each Markdown file is enhanced with:
   - `react-markdown` for React-based rendering
   - `remark-gfm` for GitHub Flavored Markdown features
   - `react-syntax-highlighter` with Prism.js for beautiful code highlighting
3. **📦 Generation**: Creates static HTML pages featuring:
   - Fixed sidebar navigation with automatic links
   - Responsive Tailwind CSS layout
   - SEO-friendly meta tags and structure
   - Clean URLs (`/api-reference/` instead of `/api-reference.html`)

### ✨ Current Documentation

The SSG has successfully processed **8 documentation files**:

| File | Title | Generated URL |
|------|-------|---------------|
| `api-reference.md` | opencode API Reference | `/api-reference/` |
| `sessions.md` | Sessions API | `/sessions/` |
| `app.md` | App API | `/app/` |
| `config.md` | Config API | `/config/` |
| `events.md` | Events API | `/events/` |
| `find.md` | Find API | `/find/` |
| `file-mode-log.md` | File API | `/file-mode-log/` |
| `schemas.md` | API Schemas | `/schemas/` |

## 📝 Writing Documentation

### File Structure

Place your `.md` files in the `docs/` directory. The SSG will:
- Use the first `# Heading` as the page title
- Generate a URL slug from the filename
- Create navigation automatically

### Supported Markdown Features

- ✅ Headers (`# ## ###`)
- ✅ **Bold** and *italic* text  
- ✅ `inline code` and code blocks
- ✅ Tables
- ✅ Lists (ordered and unordered)
- ✅ Links and images
- ✅ Blockquotes
- ✅ Strikethrough (`~~text~~`)
- ✅ Task lists (`- [x] Done`)
- ✅ Footnotes

### Code Highlighting

The SSG supports syntax highlighting for 100+ programming languages. Specify the language for optimal highlighting:

````markdown
```javascript
const events = new EventSource("http://localhost:8080/event");
events.onmessage = (e) => console.log(JSON.parse(e.data));
```

```bash
curl -X POST http://localhost:8080/session \
  -H "Content-Type: application/json" \
  -d '{"providerID": "anthropic", "modelID": "claude-3-sonnet"}'
```

```typescript
interface SessionResponse {
  id: string;
  status: 'active' | 'inactive';
}
```
````

**Supported languages include**: JavaScript, TypeScript, Python, Bash, JSON, YAML, SQL, Go, Rust, and many more.

## 🎨 Styling

The site uses Tailwind CSS for styling with:
- Clean, professional design
- Dark syntax highlighting theme
- Responsive layout
- Accessibility-friendly colors

## 🛠 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `bun run build:docs` | 🏗️ Generate the complete static site |
| `bun run serve:docs` | 🌐 Serve the site locally on port 3000 |
| `bun test` | 🧪 Run comprehensive Playwright tests |
| `bun run dev` | ⚡ Development mode for the main app |

### Customization Options

#### 🎨 Site Configuration

Edit the main configuration in `src/ssg.tsx`:

```typescript
const ssg = new StaticSiteGenerator(
  'docs',                    // Source directory
  'dist',                    // Output directory  
  {
    title: 'opencode Documentation',           // Site title
    description: 'Comprehensive documentation for opencode'  // SEO description
  }
);
```

#### 🎭 Styling & Theme

**Tailwind CSS Classes**: Modify styling directly in `src/ssg.tsx`:
- Navigation: `bg-white border-r border-gray-200 w-64 fixed`
- Content: `bg-white rounded-lg shadow-sm p-8`
- Typography: `text-3xl font-bold text-gray-900`

**Syntax Highlighting Theme**: Change the imported theme:
```typescript
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
// Or try: vs, tomorrow, okaidia, funky, etc.
```

**Custom CSS**: Add styles in the `<style>` section of the layout component.

## 🧪 Testing

The project includes a comprehensive Playwright test suite that validates:

- ✅ **Homepage functionality**: Navigation cards, titles, descriptions
- ✅ **Individual page rendering**: All 8 documentation pages load correctly  
- ✅ **Navigation system**: Sidebar links work, home button functions
- ✅ **Syntax highlighting**: Code blocks render with proper styling
- ✅ **Responsive design**: Mobile and desktop layouts work
- ✅ **SEO elements**: Meta tags, titles, and structure are correct
- ✅ **Link integrity**: All internal links function properly

### Running Tests

```bash
# Run all tests
bun test

# Run tests in headed mode (see browser)
bunx playwright test --headed

# Run specific test file
bunx playwright test tests/docs.spec.ts
```

## 📦 Technology Stack

### Core Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19 | UI framework for component rendering |
| `react-markdown` | ^10.1.0 | Markdown to React component conversion |
| `remark-gfm` | ^4.0.1 | GitHub Flavored Markdown support |
| `react-syntax-highlighter` | ^15.6.1 | Prism.js code highlighting for React |

### Development & Build Tools
| Package | Purpose |
|---------|---------|
| `bun` | Runtime, package manager, and build tool |
| `playwright` | End-to-end testing framework |
| `tailwindcss` | Utility-first CSS framework |
| `@types/react-syntax-highlighter` | TypeScript definitions |

### UI & Styling
- **Tailwind CSS**: Utility-first styling with responsive design
- **shadcn/ui**: Pre-built accessible components
- **Prism.js**: Syntax highlighting with oneDark theme
- **Custom components**: Button, Card, Form, Input, Label, Select

## 🚢 Deployment

The `dist/` directory contains fully static files ready for deployment to any hosting service:

### 🔥 Recommended Hosting Options

| Platform | Setup | Benefits |
|----------|--------|----------|
| **Netlify** | Drag & drop `dist/` folder | ✅ Instant deploy, CDN, branch previews |
| **Vercel** | Connect GitHub repo | ✅ Git integration, edge functions, analytics |
| **GitHub Pages** | Upload to `gh-pages` branch | ✅ Free, git-integrated, custom domains |
| **Cloudflare Pages** | Connect repository | ✅ Global CDN, fast builds, edge workers |

### 📁 Deployment Files

The generated `dist/` directory structure:
```
dist/
├── index.html              # Homepage with navigation cards
├── api-reference/
│   └── index.html         # Clean URLs (no .html extension needed)
├── sessions/
│   └── index.html
└── ... (all other doc pages)
```

### ⚡ Performance Features

- **Static HTML**: No JavaScript runtime required
- **Clean URLs**: SEO-friendly paths like `/api-reference/`
- **Optimized CSS**: Tailwind CSS loaded via CDN
- **Fast Loading**: Minimal HTML with embedded styles

## 📄 License

MIT License - see LICENSE file for details.

---

## 🎯 Results Summary

✅ **Successfully generated a complete documentation site with:**

- 🏠 **1 Homepage** with navigation cards for all documentation
- 📄 **8 Documentation pages** rendered from Markdown with full GFM support
- 🎨 **Beautiful syntax highlighting** for code blocks in multiple languages  
- 📱 **Responsive design** that works on all devices
- 🧪 **Comprehensive test suite** covering all functionality
- ⚡ **Fast static generation** with Bun and React
- 🔍 **SEO-optimized** HTML with proper meta tags and structure

**📊 Total Output**: 9 HTML pages ready for deployment

**🚀 Ready to deploy**: Upload the `dist/` folder to any static hosting service!

---

**Built with ❤️ using Bun, React, Tailwind CSS, and shadcn/ui**
