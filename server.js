const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Store user carts in-memory: email -> array of productIds
const carts = {};

// Auth middleware
function requireAuth(req, res, next) {
  const user = req.cookies.session_user;
  if (!user) {
    return res.redirect('/login');
  }
  req.user = user;
  if (!carts[user]) {
    carts[user] = [];
  }
  next();
}

// Routes
app.get('/', (req, res) => {
  if (req.cookies.session_user) {
    res.redirect('/products');
  } else {
    res.redirect('/login');
  }
});

app.get('/login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Login</title></head>
    <body>
      <h1>Login</h1>
      <form action="/login" method="POST">
        <div>
          <label>Email:</label>
          <input type="email" data-testid="login-email" name="email" required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" data-testid="login-password" name="password" required />
        </div>
        <button type="submit" data-testid="login-submit">Submit</button>
      </form>
    </body>
    </html>
  `);
});

app.post('/login', (req, res) => {
  const { email } = req.body;
  const userEmail = email || 'testuser@example.com';
  res.cookie('session_user', userEmail, { httpOnly: true });
  if (!carts[userEmail]) {
    carts[userEmail] = [];
  }
  if (carts[userEmail].length > 0) {
    res.redirect('/cart');
  } else {
    res.redirect('/products');
  }
});

app.get('/logout', (req, res) => {
  res.clearCookie('session_user');
  res.redirect('/login');
});

app.get('/products', requireAuth, (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Products</title></head>
    <body>
      <h1>Products</h1>
      <button data-testid="logout-button" onclick="location.href='/logout'">Logout</button>
      <a href="/cart" data-testid="cart-link">Cart</a>
      <hr />
      <div data-testid="product-item-1">
        <h3>Product 1 - Laptop</h3>
        <button data-testid="add-to-cart-1" onclick="addToCart('1')">Add to Cart</button>
      </div>
      <div data-testid="product-item-2">
        <h3>Product 2 - Phone</h3>
        <button data-testid="add-to-cart-2" onclick="addToCart('2')">Add to Cart</button>
      </div>
      <script>
        async function addToCart(productId) {
          await fetch('/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId })
          });
        }
      </script>
    </body>
    </html>
  `);
});

app.post('/api/cart/add', requireAuth, (req, res) => {
  const { productId } = req.body;
  if (productId && !carts[req.user].includes(productId)) {
    carts[req.user].push(productId);
  }
  res.json({ success: true, cart: carts[req.user] });
});

app.get('/cart', requireAuth, (req, res) => {
  const userCart = carts[req.user] || [];
  const itemsHtml = userCart.map(id => `
    <div data-testid="cart-item-${id}">
      <span>Item ${id}</span>
    </div>
  `).join('');

  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Cart</title></head>
    <body>
      <h1>Cart</h1>
      <div id="cart-container">
        ${userCart.length === 0 ? '<div data-testid="cart-empty-message">Your cart is empty</div>' : itemsHtml}
      </div>
      <button data-testid="checkout-button" onclick="handleCheckout()">Checkout</button>
      <script>
        const cartCount = ${userCart.length};
        function handleCheckout() {
          if (cartCount === 0) {
            document.getElementById('cart-container').innerHTML = '<div data-testid="cart-empty-message">Cart is empty! Cannot proceed to checkout.</div>';
          } else {
            window.location.href = '/checkout';
          }
        }
      </script>
    </body>
    </html>
  `);
});

app.get('/checkout', requireAuth, (req, res) => {
  const userCart = carts[req.user] || [];
  if (userCart.length === 0) {
    return res.redirect('/cart');
  }
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Checkout</title></head>
    <body>
      <h1>Checkout</h1>
      <form action="/checkout" method="POST">
        <div>
          <label>Shipping Address:</label>
          <input type="text" data-testid="shipping-address" name="address" required />
        </div>
        <div>
          <label>Payment Info:</label>
          <input type="text" data-testid="payment-info" name="payment" required />
        </div>
        <button type="submit" data-testid="confirm-purchase-button">Confirm Purchase</button>
      </form>
    </body>
    </html>
  `);
});

app.post('/checkout', requireAuth, (req, res) => {
  carts[req.user] = []; // Clear cart after purchase
  res.redirect('/confirmation');
});

app.get('/confirmation', requireAuth, (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Confirmation</title></head>
    <body>
      <h1>Order Confirmation</h1>
      <div data-testid="order-confirmation-message">Thank you for your order! Your purchase is confirmed.</div>
    </body>
    </html>
  `);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Target E-Commerce app running on http://localhost:${PORT}`);
  });
}

module.exports = app;
