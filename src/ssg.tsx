import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readdirSync, statSync, readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'fs';
import { join, extname, basename } from 'path';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface DocFile {
  slug: string;
  title: string;
  content: string;
  filePath: string;
}

interface SiteConfig {
  title: string;
  description: string;
  baseUrl?: string;
}

class StaticSiteGenerator {
  private docs: DocFile[] = [];
  private config: SiteConfig;
  private docsDir: string;
  private outputDir: string;

  constructor(docsDir: string, outputDir: string, config: SiteConfig) {
    this.docsDir = docsDir;
    this.outputDir = outputDir;
    this.config = config;
  }

  // Discover all markdown files in docs directory
  private discoverDocs(): void {
    console.log('🔍 Discovering documentation files...');
    
    const files = readdirSync(this.docsDir);
    
    for (const file of files) {
      const filePath = join(this.docsDir, file);
      const stat = statSync(filePath);
      
      if (stat.isFile()) {
        if (extname(file) === '.md') {
          const content = readFileSync(filePath, 'utf-8');
          const title = this.extractTitle(content, file);
          const slug = basename(file, '.md');
          
          this.docs.push({
            slug,
            title,
            content,
            filePath
          });
          
          console.log(`  📄 Found: ${title} (${slug})`);
        } else if (extname(file) === '.json') {
          // Copy JSON files (like OpenAPI specs) to dist
          const destPath = join(this.outputDir, file);
          copyFileSync(filePath, destPath);
          console.log(`  📋 Copied: ${file}`);
        }
      }
    }
    
    console.log(`✅ Discovered ${this.docs.length} documentation files`);
  }

  // Extract title from markdown content
  private extractTitle(content: string, filename: string): string {
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch && titleMatch[1]) {
      return titleMatch[1].trim();
    }
    
    // Fallback to filename
    return basename(filename, '.md')
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Create navigation component
  private createNavigation(): React.ReactElement {
    return (
      <nav className="bg-white border-r border-gray-200 w-64 fixed left-0 top-0 h-full overflow-y-auto">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-6">{this.config.title}</h1>
          <ul className="space-y-2">
            <li>
              <a 
                href="/" 
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              >
                🏠 Home
              </a>
            </li>
            {this.docs.map(doc => (
              <li key={doc.slug}>
                <a 
                  href={`/${doc.slug}/`}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                >
                  {doc.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
  }

  // Create markdown component with syntax highlighting
  private createMarkdownRenderer(content: string): React.ReactElement {
    return (
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <SyntaxHighlighter
                PreTag="div"
                children={String(children).replace(/\n$/, '')}
                language={match[1]}
                style={oneDark}
                className="rounded-md"
              />
            ) : (
              <code {...rest} className={`${className} bg-gray-100 px-1 py-0.5 rounded text-sm`}>
                {children}
              </code>
            );
          },
          table(props) {
            return (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200" {...props} />
              </div>
            );
          },
          th(props) {
            return (
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />
            );
          },
          td(props) {
            return (
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" {...props} />
            );
          },
          h1(props) {
            return <h1 className="text-3xl font-bold text-gray-900 mb-6" {...props} />;
          },
          h2(props) {
            return <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4" {...props} />;
          },
          h3(props) {
            return <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3" {...props} />;
          },
          p(props) {
            return <p className="text-gray-700 mb-4 leading-relaxed" {...props} />;
          },
          ul(props) {
            return <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1" {...props} />;
          },
          ol(props) {
            return <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-1" {...props} />;
          },
          blockquote(props) {
            return (
              <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 text-gray-800" {...props} />
            );
          },
          a(props) {
            return <a className="text-blue-600 hover:text-blue-800 underline" {...props} />;
          }
        }}
      >
        {content}
      </Markdown>
    );
  }

  // Create page layout
  private createPageLayout(title: string, content: React.ReactElement): React.ReactElement {
    const navigation = this.createNavigation();
    
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{`${title} - ${this.config.title}`}</title>
          <meta name="description" content={this.config.description} />
          <script src="https://cdn.tailwindcss.com"></script>
          <style>{`
            /* Custom styles for syntax highlighting */
            .token.comment,
            .token.prolog,
            .token.doctype,
            .token.cdata {
              color: #636f88;
            }
          `}</style>
        </head>
        <body className="bg-gray-50">
          {navigation}
          <main className="ml-64 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm p-8">
                {content}
              </div>
            </div>
          </main>
        </body>
      </html>
    );
  }

  // Generate homepage
  private generateHomepage(): void {
    console.log('🏠 Generating homepage...');
    
    const homeContent = (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{this.config.title}</h1>
        <p className="text-gray-700 mb-8">{this.config.description}</p>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {this.docs.map(doc => (
            <div key={doc.slug} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                <a href={`/${doc.slug}/`} className="text-blue-600 hover:text-blue-800">
                  {doc.title}
                </a>
              </h3>
              <p className="text-gray-600 text-sm">
                {doc.content.split('\n').find(line => line.trim() && !line.startsWith('#'))?.substring(0, 150) || 'Documentation page'}...
              </p>
            </div>
          ))}
        </div>
      </div>
    );
    
    const html = this.createPageLayout(this.config.title, homeContent);
    const htmlString = '<!DOCTYPE html>\n' + renderToStaticMarkup(html);
    
    writeFileSync(join(this.outputDir, 'index.html'), htmlString);
    console.log('✅ Homepage generated');
  }

  // Generate individual doc pages
  private generateDocPages(): void {
    console.log('📖 Generating documentation pages...');
    
    for (const doc of this.docs) {
      console.log(`  📄 Generating: ${doc.title}`);
      
      const markdownContent = this.createMarkdownRenderer(doc.content);
      const html = this.createPageLayout(doc.title, markdownContent);
      const htmlString = '<!DOCTYPE html>\n' + renderToStaticMarkup(html);
      
      // Create directory for the doc
      const docDir = join(this.outputDir, doc.slug);
      mkdirSync(docDir, { recursive: true });
      
      // Write the HTML file
      writeFileSync(join(docDir, 'index.html'), htmlString);
    }
    
    console.log('✅ All documentation pages generated');
  }

  // Main build method
  public build(): void {
    console.log('🚀 Starting static site generation...');
    
    // Create output directory
    mkdirSync(this.outputDir, { recursive: true });
    
    // Discover and process docs
    this.discoverDocs();
    
    // Generate pages
    this.generateHomepage();
    this.generateDocPages();
    
    console.log(`✅ Site generated successfully in: ${this.outputDir}`);
    console.log(`📊 Generated ${this.docs.length + 1} pages total`);
  }
}

// Run the SSG
const ssg = new StaticSiteGenerator(
  'docs',
  'dist',
  {
    title: 'opencode Documentation',
    description: 'Comprehensive documentation for the opencode AI-powered development environment.'
  }
);

ssg.build();