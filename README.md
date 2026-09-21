# STYLE DOCK — eCommerce Website

A complete zero-build fashion storefront for **STYLE DOCK**. It is intentionally built with plain HTML/CSS/JavaScript so it can run directly on GitHub Pages without npm, Node, a database, or a build step.

## Included
- Amazon-style search + category navigation
- Men / Women / Kids categories
- Product grid with sorting and product detail modal
- Persistent shopping cart using browser localStorage
- Quantity controls and cart total
- WhatsApp checkout/order message to Style Dock: **8881717710**
- Google Maps store link
- Instagram link: **@the.styledock**
- Responsive mobile-first layout
- Style Dock branding and supplied logo assets
- GitHub Pages deployment workflow
- No unfinished TODO code required to launch the storefront

## Run locally
Just open `index.html` in a browser.

For a local development server, any static server works, for example:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Put it on GitHub
1. Create a new GitHub repository, e.g. `style-dock-shop`.
2. Upload every file in this folder, keeping the `assets/` folder.
3. In GitHub: **Settings → Pages → Source: GitHub Actions**.
4. The included `.github/workflows/deploy.yml` publishes the site automatically.

### Git CLI alternative
```bash
git init
git add .
git commit -m "Launch Style Dock storefront"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/style-dock-shop.git
git push -u origin main
```

## Product editing
All demo products are in `app.js` inside the `products` array. Each item has:
- `name`
- `cat`
- `gender`
- `price`
- `old`
- `badge`
- `new`
- `img`
- `desc`

Replace the demo image URLs with your real product image URLs when ready.

## Important production note
This version is a working storefront and WhatsApp ordering system. It does **not** claim real inventory, payment processing, customer accounts, or an admin dashboard because those require a backend/database and your actual payment/inventory credentials. The site is fully launchable as a catalog + cart + WhatsApp order flow right now.
