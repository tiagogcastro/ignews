import { expect, test } from '@playwright/test';

test.describe('public pages', () => {
  test('home shows hero with plan price', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /react/i })).toBeVisible();
    await expect(page.getByText('Subscribe now')).toBeVisible();
    await expect(page.getByText(/\$\d+\.\d{2} month/)).toBeVisible();
  });

  test('posts list renders cms content', async ({ page }) => {
    await page.goto('/posts');
    await expect(page.getByText('Server Components in practice')).toBeVisible();
    const postLinks = page.locator('main a');
    await expect(postLinks).toHaveCount(3);
  });

  test('preview truncates content for anonymous visitors', async ({ page }) => {
    await page.goto('/posts/preview/react-server-components-in-2026');
    await expect(page.getByText('Wanna continue reading?')).toBeVisible();
    const article = page.locator('article');
    await expect(article.locator('ul')).toHaveCount(0);
  });

  test('full post redirects anonymous visitors home', async ({ page }) => {
    await page.goto('/posts/react-server-components-in-2026');
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe('api contracts', () => {
  test('subscribe requires authentication', async ({ request }) => {
    const response = await request.post('/api/subscribe');
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error.message).toBe('Authentication required');
  });

  test('webhook rejects unsigned payloads', async ({ request }) => {
    const response = await request.post('/api/webhooks', { data: {} });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBeTruthy();
  });

  test('subscribe rejects non post methods', async ({ request }) => {
    const response = await request.get('/api/subscribe');
    expect(response.status()).toBe(405);
  });
});

test.describe('subscriber flow with dev login', () => {
  test('dev login unlocks full posts and paywall disappears', async ({ page }) => {    await page.goto('/');
    await page.getByRole('button', { name: /sign in/i }).click();

    await page.waitForURL(/api\/auth\/signin/);
    await page.getByLabel(/email/i).fill('alice@example.com');
    await page.getByRole('button', { name: /sign in with development/i }).click();

    await page.waitForURL('/');
    await expect(page.getByRole('button', { name: /Dev User/i })).toBeVisible();

    await page.goto('/posts');
    await expect(page.getByText('Server Components in practice')).toBeVisible();

    await page.getByText('Server Components in practice').click();
    await expect(page).toHaveURL(/\/posts\/react-server-components-in-2026/);
    await expect(page.locator('article ul li').first()).toBeVisible();
    await expect(page.getByText('Wanna continue reading?')).toHaveCount(0);
  });

  test('subscribe button completes the sandbox checkout for a visitor', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /sign in/i }).click();

    await page.waitForURL(/api\/auth\/signin/);
    await page.getByLabel(/email/i).fill('carol@example.com');
    await page.getByRole('button', { name: /sign in with development/i }).click();
    await page.waitForURL('/');

    await page.getByRole('button', { name: /subscribe now/i }).click();
    await page.waitForURL(/\/posts$/);
    await expect(page.getByText('Server Components in practice')).toBeVisible();
  });
});
