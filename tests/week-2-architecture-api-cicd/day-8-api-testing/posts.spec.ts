import { test, expect } from '@playwright/test';

/**
 * API tests against the public JSONPlaceholder service.
 * Demonstrates request/response validation, status codes and payload assertions.
 */
const BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('JSONPlaceholder API', () => {
  test('GET /posts/1 returns the expected shape', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/posts/1`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toMatchObject({
      id: 1,
      userId: expect.any(Number),
      title: expect.any(String),
      body: expect.any(String),
    });
  });

  test('GET /posts returns a non-empty collection', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/posts`);

    expect(response.ok()).toBeTruthy();

    const posts = await response.json();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
  });

  test('POST /posts creates a resource and echoes the payload', async ({ request }) => {
    const payload = { title: 'QA portfolio', body: 'created by test', userId: 99 };

    const response = await request.post(`${BASE_URL}/posts`, { data: payload });

    expect(response.status()).toBe(201);

    const created = await response.json();
    expect(created).toMatchObject(payload);
    expect(created.id).toBeDefined();
  });

  test('GET /posts/99999 returns 404 for a missing resource', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/posts/99999`);

    expect(response.status()).toBe(404);
  });
});
