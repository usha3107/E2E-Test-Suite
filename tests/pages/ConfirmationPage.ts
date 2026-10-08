import { type Page, type Locator } from '@playwright/test';

export class ConfirmationPage {
  readonly page: Page;
  readonly orderConfirmationMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.orderConfirmationMessage = page.locator('[data-testid="order-confirmation-message"]');
  }

  async goto() {
    await this.page.goto('/confirmation');
  }
}
