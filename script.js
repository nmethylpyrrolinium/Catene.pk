// ========================================
// CATENE.PK - E-COMMERCE FUNCTIONALITY
// Enhanced UI/UX with Navigation Fix
// ========================================

// ========== PRODUCT DATABASE ==========
const products = [
    {
        id: 1,
        name: "Pearl Crescent",
        category: "phone-charms",
        price: 1500,
        rating: 5,
        reviews: 48,
        description: "Elegant pearl-adorned crescent charm with golden accents",
        badge: "New"
    },
    {
        id: 2,
        name: "Golden Geometric",
        category: "keychains",
        price: 1200,
        rating: 4.5,
        reviews: 32,
        description: "Modern geometric design with luxury gold finish",
        badge: ""
    },
    {
        id: 3,
        name: "Turquoise Tassel",
        category: "phone-charms",
        price: 1800,
        rating: 5,
        reviews: 56,
        description: "Vibrant turquoise with ornate tassel detailing",
        badge: "Best Seller"
    },
    {
        id: 4,
        name: "Persian Floral",
        category: "keychains",
        price: 1400,
        rating: 4,
        reviews: 24,
        description: "Intricate Persian floral pattern in premium material",
        badge: ""
    },
    {
        id: 5,
        name: "Diamond Star",
        category: "phone-charms",
        price: 2000,
        rating: 5,
        reviews: 72,
        description: "Sparkling star charm with cubic zirconia stones",
        badge: "Limited"
    },
    {
        id: 6,
        name: "Bronze Spiral",
        category: "keychains",
        price: 1300,
        rating: 4.5,
        reviews: 40,
        description: "Antique bronze spiral design with protective coating",
        badge: ""
    },
    {
        id: 7,
        name: "Emerald Lotus",
        category: "phone-charms",
        price: 1900,
        rating: 5,
        reviews: 61,
        description: "Stunning emerald-colored lotus with pearl center",
        badge: "New"
    },
    {
        id: 8,
        name: "Silver Arabesque",
        category: "keychains",
        price: 1600,
        rating: 4.5,
        reviews: 35,
        description: "Delicate silver arabesque pattern, lightweight",
        badge: ""
    },
    {
        id: 9,
        name: "Ruby Heart Charm",
        category: "phone-charms",
        price: 2200,
        rating: 5,
        reviews: 88,
        description: "Deep red ruby heart charm perfect for charm bracelets",
        badge: "Best Seller"
    },
    {
        id: 10,
        name: "Sapphire Moon",
        category: "keychains",
        price: 1700,
        rating: 4,
        reviews: 28,
        description: "Celestial moon design with sapphire-blue crystal",
        badge: ""
    },
    {
        id: 11,
        name: "Golden Filigree",
        category: "phone-charms",
        price: 1950,
        rating: 5,
        reviews: 52,
        description: "Intricate filigree goldwork with traditional craftsmanship",
        badge: ""
    },
    {
        id: 12,
        name: "Turquoise Hamsa",
        category: "keychains",
        price: 1450,
        rating: 4.5,
        reviews: 42,
        description: "Protective hamsa hand with turquoise center stone",
        badge: "New"
    }
];

// ========== CURRENCY CONVERSION RATES ==========
const exchangeRates = {
    PKR: 1,
    USD: 0.0036,
    EUR: 0.0033
};

const currencySymbols = {
    PKR: "PKR",
    USD: "$",
    EUR: "€"
};

// ========== GLOBAL VARIABLES ==========
let cart = [];
let currentCurrency = 'PKR';
let filteredProducts = [...products];

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    setupStorefrontExtras();
    loadCart();
    updateCartUI();
    detectUserLocation();
    setupScrollAnimations();
    setupPageTransitions();
    
    // Render products on shop page
    if (document.getElementById('productsGrid')) {
        renderShopProducts();
    }
    
    // Render featured products on homepage
    if (document.getElementById('featuredProducts')) {
        renderFeaturedProducts();
    }
    
    // Render cart on cart page
    if (document.getElementById('cartItemsContainer')) {
        renderCart();
    }
});

// ========== PAGE TRANSITIONS ==========
function setupPageTransitions() {
    // Add fade-in animation on page load
    document.body.style.animation = 'pageTransitionIn 0.8s ease';
    
    // Handle link clicks for smooth page transition
    document.querySelectorAll('a:not([href^="#"]):not([href^="javascript"])').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('cart') && !href.startsWith('shop') && !href.includes('index')) {
                return; // Allow external links
            }
            
            // For same-page links, smooth transition is handled by scroll-behavior
        });
    });
}

// ========== SCROLL ANIMATIONS ==========
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.featured, .about, .contact').forEach(section => {
        observer.observe(section);
    });
}

// ========== CART MANAGEMENT ==========

function loadCart() {
    try { const saved = localStorage.getItem('catene_cart'); const parsed = saved ? JSON.parse(saved) : [];
      cart = Array.isArray(parsed) ? parsed.filter(item => item && Number.isInteger(item.id) && Number.isFinite(item.price) && Number.isInteger(item.quantity) && item.quantity > 0) : [];
    } catch { cart = []; }
}

function saveCart() {
    localStorage.setItem('catene_cart', JSON.stringify(cart));
    updateCartUI();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    showNotification(`✓ ${product.name} added to cart!`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
}

function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart();
            renderCart();
        }
    }
}

function updateCartUI() {
    const cartCounts = document.querySelectorAll('#cartCount');
    if (cartCounts.length > 0) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCounts.forEach(badge => {
            badge.textContent = totalItems;
        });
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// ========== CURRENCY MANAGEMENT ==========

function changeCurrency() {
    const select = document.getElementById('currencySelect'); if (!select || !['PKR','USD','EUR'].includes(select.value)) return;
    currentCurrency = select.value; localStorage.setItem('catene_currency', currentCurrency);
    if (document.getElementById('productsGrid')) renderShopProducts();
    if (document.getElementById('featuredProducts')) renderFeaturedProducts();
    if (document.getElementById('cartItemsContainer')) renderCart();
}

function formatPrice(amount) {
    const converted = amount * exchangeRates[currentCurrency];
    const symbol = currencySymbols[currentCurrency];
    
    if (currentCurrency === 'PKR') {
        return `${converted.toFixed(0)} ${symbol}`;
    } else {
        return `${symbol}${converted.toFixed(2)}`;
    }
}

function detectUserLocation() {
    const savedCurrency = localStorage.getItem('catene_currency');
    currentCurrency = ['PKR','USD','EUR'].includes(savedCurrency) ? savedCurrency : 'PKR';
    document.querySelectorAll('#currencySelect').forEach(select => select.value = currentCurrency);
}

// ========== PRODUCT RENDERING ==========

function renderFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    const featuredProducts = products.slice(0, 6);
    container.innerHTML = featuredProducts.map((product, index) => 
        createProductCard(product, index)
    ).join('');
}

function renderShopProducts() {
    const container = document.getElementById('productsGrid');
    if (!container) return;
    
    applyFilters();
    
    if (filteredProducts.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888;">No products found.</p>';
        return;
    }
    
    container.innerHTML = filteredProducts.map((product, index) => 
        createProductCard(product, index)
    ).join('');
}

function createProductCard(product, index) {
    const delay = index * 0.04;
    const categoryLabel = product.category === 'phone-charms' ? 'Phone charm' : 'Keychain';
    return `
      <article class="product-card" style="animation-delay: ${delay}s">
        <div class="product-image" aria-hidden="true"><span class="product-art">${product.category === 'keychains' ? '⌁' : '✳'}</span></div>
        <div class="product-info">
          <p class="product-category">${categoryLabel}</p><h3 class="product-name">${product.name}</h3>
          <p class="product-price">${formatPrice(product.price)}</p><p class="product-description">${product.description}</p>
          <div class="product-actions"><button class="btn-add-cart" type="button" onclick="addToCart(${product.id})">Add to bag</button></div>
        </div>
      </article>`;
}

function createStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    return stars;
}

// ========== FILTERING AND SORTING ==========

function applyFilters() {
    let filtered = [...products];
    const checkboxes = [...document.querySelectorAll('.filter-group input[type="checkbox"]')];
    const selected = checkboxes.filter(cb => cb.checked && cb.value !== 'all').map(cb => cb.value);
    if (selected.length) filtered = filtered.filter(p => selected.includes(p.category));
    const q = new URLSearchParams(location.search).get('q') || document.getElementById('siteSearch')?.value || '';
    const normalized = q.trim().toLocaleLowerCase();
    if (normalized) filtered = filtered.filter(p => [p.name,p.category,p.description].some(value => value.toLocaleLowerCase().includes(normalized)));
    const range = document.getElementById('priceRange');
    if (range) { const max = Number(range.value); const label = document.getElementById('priceValue'); if (label) label.textContent = max.toLocaleString(); filtered = filtered.filter(p => p.price <= max); }
    const sort = document.getElementById('sortSelect')?.value;
    if (sort === 'price-low') filtered.sort((a,b)=>a.price-b.price);
    else if (sort === 'price-high') filtered.sort((a,b)=>b.price-a.price);
    else if (sort === 'rating') filtered.sort((a,b)=>b.rating-a.rating);
    else filtered.sort((a,b)=>b.id-a.id);
    filteredProducts = filtered;
    const status = document.getElementById('searchStatus');
    if (status) status.textContent = normalized ? `Showing results for “${q.trim()}”` : '';
}

function filterProducts() {
    renderShopProducts();
}

// ========== CART PAGE RENDERING ==========

function renderCart() {
    const container = document.getElementById('cartItemsContainer');
    if (!container) return;
    if (!cart.length) {
      container.innerHTML = '<div class="cart-empty"><span class="empty-bag" aria-hidden="true">♡</span><h3>Your bag is waiting</h3><p>Browse keychains and phone charms to get started.</p><a href="shop.html" class="btn-primary">Explore the shop</a></div>';
      updateCartSummary(); return;
    }
    container.innerHTML = cart.map(item => `
      <article class="cart-item"><div class="cart-item-image" aria-hidden="true"><span>${item.category === 'keychains' ? '⌁' : '✳'}</span></div>
      <div class="cart-item-details"><h3>${item.name}</h3><p>${item.category === 'phone-charms' ? 'Phone charm' : 'Keychain'}</p><div class="cart-item-price">${formatPrice(item.price)}</div>
       <div class="quantity-control"><button type="button" aria-label="Remove one ${item.name}" onclick="updateQuantity(${item.id},${item.quantity-1})">−</button><span aria-live="polite">${item.quantity}</span><button type="button" aria-label="Add one ${item.name}" onclick="updateQuantity(${item.id},${item.quantity+1})">+</button></div></div>
      <div class="cart-item-actions"><p>${formatPrice(item.price*item.quantity)}</p><button class="remove-btn" type="button" onclick="removeFromCart(${item.id})" aria-label="Remove ${item.name}">Remove</button></div></article>`).join('');
    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = getCartTotal();
    const subtotalEl = document.getElementById('subtotal'), shippingEl = document.getElementById('shipping'), taxEl = document.getElementById('tax'), totalEl = document.getElementById('total');
    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (shippingEl) shippingEl.textContent = 'Confirm by email';
    if (taxEl) taxEl?.closest('.summary-row')?.remove();
    if (totalEl) totalEl.textContent = formatPrice(subtotal);
}

// ========== CHECKOUT & PROMO ==========

function checkout() {
    if (!cart.length) { showNotification('Your bag is empty. Add an item first.', 'error'); return; }
    const lines = cart.map(item => `• ${item.name} × ${item.quantity} — PKR ${(item.price*item.quantity).toLocaleString()}`).join('%0D%0A');
    const body = `Hello Catene.pk,%0D%0A%0D%0AI’d like to ask about:%0D%0A${lines}%0D%0A%0D%0AItem subtotal: PKR ${getCartTotal().toLocaleString()}%0D%0APlease confirm availability, delivery charges and payment options.`;
    window.location.href = `mailto:maheenramzan13@gmail.com?subject=Catene.pk%20order%20enquiry&body=${body}`;
}

function applyPromo() {}

// ========== UTILITIES ==========

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 14px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1001;
        animation: slideIn 0.3s ease;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
        max-width: 300px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function toggleWishlist() {}

function handleNewsletter(e) { e.preventDefault(); showNotification('Email updates are not set up yet. Please contact us by email.', 'error'); }

// Add animation styles dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .btn-wishlist.active i {
        color: #e74c3c !important;
    }
`;
document.head.appendChild(style);
/* Birthday greeting configuration: edit only this object after confirming the date.
   month uses 1–12. day and month intentionally remain unset. */
const birthdayConfig = { day: null, month: null, firstCelebrationYear: 2027, timeZone: 'Asia/Karachi', message: 'Happy birthday! A little love from Catene.pk.' };
function isValidBirthday(day, month) {
  if (!Number.isInteger(day) || !Number.isInteger(month) || month < 1 || month > 12 || day < 1) return false;
  return day <= new Date(Date.UTC(2000, month, 0)).getUTCDate();
}
function getLahoreDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Karachi', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  const part = key => Number(parts.find(item => item.type === key)?.value);
  return { year: part('year'), month: part('month'), day: part('day') };
}
function maybeShowBirthdayGreeting(now = new Date()) {
  const { day, month, firstCelebrationYear } = birthdayConfig;
  if (!isValidBirthday(day, month)) return false;
  const local = getLahoreDate(now);
  if (local.year < firstCelebrationYear || local.day !== day || local.month !== month) return false;
  const key = `catene_birthday_seen_${local.year}`;
  if (sessionStorage.getItem(key)) return false;
  const toast = document.getElementById('birthdayGreeting');
  if (!toast) return false;
  toast.textContent = birthdayConfig.message;
  toast.hidden = false;
  sessionStorage.setItem(key, '1');
  return true;
}
function setupStorefrontExtras() {
  const query = new URLSearchParams(location.search).get('q');
  if (query) { const field = document.getElementById('siteSearch'); if (field) field.value = query; }
  maybeShowBirthdayGreeting();
}
function toggleSearch() {
  const panel = document.getElementById('searchPanel'), button = document.querySelector('.search-btn');
  if (!panel) return;
  panel.hidden = !panel.hidden; button?.setAttribute('aria-expanded', String(!panel.hidden));
  if (!panel.hidden) document.getElementById('siteSearch')?.focus();
}
function toggleMenu() {
  const nav = document.getElementById('siteNav'), button = document.querySelector('.menu-toggle');
  if (!nav) return;
  const open = nav.classList.toggle('is-open'); button?.setAttribute('aria-expanded', String(open));
  button?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
function toggleLuna() {
  const note = document.getElementById('lunaNote');
  if (note) note.hidden = !note.hidden;
}