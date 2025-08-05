import { test, expect } from '@playwright/test';

test.describe('Documentation Site', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/opencode Documentation/);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('opencode Documentation');
    
    // Check navigation sidebar
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('nav a')).toHaveCount(9); // Home + 8 docs
    
    // Check doc cards are present
    await expect(page.locator('.grid .border')).toHaveCount(8);
  });

  test('navigation works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Click on API Reference link
    await page.click('text=opencode API Reference');
    
    // Check we navigated to the right page
    await expect(page).toHaveURL('/api-reference/');
    await expect(page.locator('h1')).toContainText('opencode API Reference');
  });

  test('syntax highlighting works', async ({ page }) => {
    await page.goto('/api-reference/');
    
    // Look for code blocks with syntax highlighting
    const codeBlocks = page.locator('pre div[class*="language-"]');
    await expect(codeBlocks.first()).toBeVisible();
  });

  test('all documentation pages load', async ({ page }) => {
    const docs = [
      'sessions',
      'app', 
      'config',
      'file-mode-log',
      'find',
      'schemas',
      'api-reference',
      'events'
    ];

    for (const doc of docs) {
      await page.goto(`/${doc}/`);
      
      // Check page loads without errors
      await expect(page.locator('h1')).toBeVisible();
      
      // Check navigation is present
      await expect(page.locator('nav')).toBeVisible();
      
      // Check main content area
      await expect(page.locator('main')).toBeVisible();
    }
  });

  test('responsive design works', async ({ page }) => {
    await page.goto('/');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigation should still be visible (might need scrolling)
    await expect(page.locator('nav')).toBeVisible();
    
    // Content should be readable
    await expect(page.locator('main')).toBeVisible();
  });

  test('links and navigation work correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test home link in navigation
    await page.click('text=🏠 Home');
    await expect(page).toHaveURL('/');
    
    // Test doc navigation from homepage cards
    await page.click('text=Sessions API');
    await expect(page).toHaveURL('/sessions/');
    
    // Test navigation back to home from doc page
    await page.click('text=🏠 Home');
    await expect(page).toHaveURL('/');
  });

  test('content is properly styled', async ({ page }) => {
    await page.goto('/api-reference/');
    
    // Check Tailwind CSS is loaded
    const mainElement = page.locator('main');
    await expect(mainElement).toHaveClass(/ml-64/);
    
    // Check typography styles
    const heading = page.locator('h1').first();
    await expect(heading).toHaveClass(/text-3xl/);
  });
});