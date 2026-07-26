import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Page Object for the TodoMVC demo app.
 * Encapsulates locators and actions so specs stay readable and stable.
 */
export class TodoPage {
  readonly page: Page;
  readonly newTodoInput: Locator;
  readonly todoItems: Locator;
  readonly todoCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.todoItems = page.getByTestId('todo-item');
    this.todoCount = page.getByTestId('todo-count');
  }

  async goto(): Promise<void> {
    await this.page.goto('https://demo.playwright.dev/todomvc');
  }

  async addTodo(text: string): Promise<void> {
    await this.newTodoInput.fill(text);
    await this.newTodoInput.press('Enter');
  }

  async completeTodo(text: string): Promise<void> {
    await this.todoItems
      .filter({ hasText: text })
      .getByRole('checkbox')
      .check();
  }

  async expectVisibleTodos(expected: string[]): Promise<void> {
    await expect(this.todoItems).toHaveText(expected);
  }
}
