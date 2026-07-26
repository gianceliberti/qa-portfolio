import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/todo.page';

/**
 * UI end-to-end tests for the TodoMVC demo, driven through a Page Object.
 */
test.describe('TodoMVC - core flows', () => {
  let todo: TodoPage;

  test.beforeEach(async ({ page }) => {
    todo = new TodoPage(page);
    await todo.goto();
  });

  test('adds multiple todos and shows them in order', async () => {
    await todo.addTodo('Write test plan');
    await todo.addTodo('Automate smoke suite');

    await todo.expectVisibleTodos(['Write test plan', 'Automate smoke suite']);
    await expect(todo.todoCount).toHaveText('2 items left');
  });

  test('completing a todo decrements the active count', async () => {
    await todo.addTodo('Review release notes');
    await todo.addTodo('Run regression');

    await todo.completeTodo('Review release notes');

    await expect(todo.todoCount).toHaveText('1 item left');
  });

  test('persists todos across a page reload', async ({ page }) => {
    await todo.addTodo('Persisted item');

    await page.reload();

    await todo.expectVisibleTodos(['Persisted item']);
  });
});
