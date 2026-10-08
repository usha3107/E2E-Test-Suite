import { type Page, type Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly shippingAddressInput: Locator;
  readonly paymentInfoInput: Locator;
  readonly confirmPurchaseButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.shippingAddressInput = page.locator('[data-testid="shipping-address"]');
    this.paymentInfoInput = page.locator('[data-testid="payment-info"]');
    this.confirmPurchaseButton = page.locator('[data-testid="confirm-purchase-button"]');
  }

  async goto() {
    await this.page.goto('/checkout');
  }

  async fillShippingAddress(address: string) {
    await this.shippingAddressInput.fill(address);
  }

  async fillPaymentInfo(paymentInfo: string) {
    await this.paymentInfoInput.fill(paymentInfo);
  }

  async confirmPurchase() {
    await this.confirmPurchaseButton.click();
  }

  async completeCheckout(address: string, paymentInfo: string) {
    await this.fillShippingAddress(address);
    await this.fillPaymentInfo(paymentInfo);
    await this.confirmPurchase();
  }
}
