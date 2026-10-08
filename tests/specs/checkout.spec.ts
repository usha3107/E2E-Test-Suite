import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ConfirmationPage } from '../pages/ConfirmationPage';

test.describe('E-Commerce Checkout Flow', () => {
  test('should allow a user to successfully purchase a product', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const confirmationPage = new ConfirmationPage(page);

    // 1. Login
    await loginPage.goto();
    await loginPage.login('testuser@example.com', 'password123');
    await expect(page).toHaveURL('/products');

    // 2. Add product to cart and navigate to cart
    await productsPage.addProductToCart('1');
    await productsPage.goToCart();
    await expect(page).toHaveURL('/cart');

    // 3. Proceed through checkout
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL('/checkout');

    // 4. Fill shipping & payment details and confirm purchase
    await checkoutPage.fillShippingAddress('123 Main St, Tech City');
    await checkoutPage.fillPaymentInfo('4111-2222-3333-4444');
    await checkoutPage.confirmPurchase();

    // 5. Verify confirmation page & order confirmation message
    await expect(page).toHaveURL('/confirmation');
    await expect(confirmationPage.orderConfirmationMessage).toBeVisible();
  });

  test('should display an error when checking out with an empty cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cartPage = new CartPage(page);

    // 1. Login
    await loginPage.goto();
    await loginPage.login('emptyuser@example.com', 'password123');
    await expect(page).toHaveURL('/products');

    // 2. Navigate directly to cart page without adding any products
    await cartPage.goto();
    await expect(page).toHaveURL('/cart');

    // 3. Attempt to click checkout
    await cartPage.proceedToCheckout();

    // 4. Assert error message visibility and remaining on /cart
    await expect(cartPage.emptyCartMessage).toBeVisible();
    await expect(page).toHaveURL('/cart');
  });

  test('should preserve cart contents after session expiry and re-login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // 1. Login and add product to cart
    await loginPage.goto();
    await loginPage.login('sessionuser@example.com', 'password123');
    await expect(page).toHaveURL('/products');
    await productsPage.addProductToCart('1');

    // 2. Simulate expired session by clearing cookies
    await page.context().clearCookies();

    // 3. Attempt to navigate to a protected page (/checkout)
    await checkoutPage.goto();

    // 4. Assert redirect to login page occurs
    await expect(page).toHaveURL(/\/login/);

    // 5. Log in again
    await loginPage.login('sessionuser@example.com', 'password123');

    // 6. Assert redirected back to cart, and previously added item is present
    await expect(page).toHaveURL('/cart');
    await expect(cartPage.getCartItem('1')).toBeVisible();
  });
});
