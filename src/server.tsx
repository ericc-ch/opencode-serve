import { resolve } from 'path';
import { existsSync } from 'fs';

const server = Bun.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);
    let filePath = url.pathname;
    
    // Log requests for debugging
    console.log(`📥 Request: ${filePath}`);
    
    // Reject invalid paths containing colons (like file:// or absolute paths)
    if (filePath.includes(':') || filePath.includes('\\')) {
      console.log(`❌ Rejected invalid path: ${filePath}`);
      return new Response('Bad Request', { status: 400 });
    }
    
    // Normalize the path to prevent directory traversal attacks
    filePath = filePath.replace(/\.\./g, '').replace(/\/+/g, '/');
    
    // Handle root path
    if (filePath === '/') {
      filePath = '/index.html';
    }
    
    // Handle directory paths (e.g., /api-reference/ -> /api-reference/index.html)
    else if (filePath.endsWith('/')) {
      filePath = filePath + 'index.html';
    }
    
    // Handle paths without extension (e.g., /api-reference -> /api-reference/index.html)
    else if (!filePath.includes('.')) {
      filePath = filePath + '/index.html';
    }
    
    // Handle specific opencode-openapi.json request
    if (filePath.includes('opencode-openapi.json')) {
      filePath = '/opencode-openapi.json';
    }
    
    // Ensure filePath starts with /
    if (!filePath.startsWith('/')) {
      filePath = '/' + filePath;
    }
    
    const fullPath = resolve('./dist' + filePath);
    
    // Security check: ensure the path is within the dist directory
    const distDir = resolve('./dist');
    if (!fullPath.startsWith(distDir)) {
      console.log(`🚫 Security: Path outside dist directory: ${fullPath}`);
      return new Response('Forbidden', { status: 403 });
    }
    
    try {
      if (!existsSync(fullPath)) {
        console.log(`📄 File not found: ${fullPath}`);
        // Try to serve a 404 page if it exists, otherwise return simple 404
        const notFoundPath = resolve('./dist/404.html');
        if (existsSync(notFoundPath)) {
          const file = Bun.file(notFoundPath);
          return new Response(file, { status: 404 });
        }
        return new Response('Not Found', { status: 404 });
      }
      
      const file = Bun.file(fullPath);
      
      // Set appropriate content type
      let contentType = 'text/html';
      if (fullPath.endsWith('.json')) {
        contentType = 'application/json';
      } else if (fullPath.endsWith('.css')) {
        contentType = 'text/css';
      } else if (fullPath.endsWith('.js')) {
        contentType = 'application/javascript';
      }
      
      console.log(`✅ Serving: ${fullPath}`);
      return new Response(file, {
        headers: {
          'Content-Type': contentType,
        },
      });
    } catch (error) {
      console.error('❌ Server error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
});

console.log(`📚 Documentation server running on http://localhost:${server.port}`);
console.log('📖 Open http://localhost:3000 to view the documentation');