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
        description: "Elegant pearl-adorned crescent charm with golden accents",
        badge: "New"
    },
    {
        id: 2,
        name: "Golden Geometric",
        category: "keychains",
        price: 1200,
        description: "Modern geometric design with luxury gold finish",
        badge: ""
    },
    {
        id: 3,
        name: "Turquoise Tassel",
        category: "phone-charms",
        price: 1800,
        description: "Vibrant turquoise with ornate tassel detailing",
        badge: "Best Seller"
    },
    {
        id: 4,
        name: "Persian Floral",
        category: "keychains",
        price: 1400,
        description: "Intricate Persian floral pattern in premium material",
        badge: ""
    },
    {
        id: 5,
        name: "Diamond Star",
        category: "phone-charms",
        price: 2000,
        description: "Sparkling star charm with cubic zirconia stones",
        badge: "Limited"
    },
    {
        id: 6,
        name: "Bronze Spiral",
        category: "keychains",
        price: 1300,
        description: "Antique bronze spiral design with protective coating",
        badge: ""
    },
    {
        id: 7,
        name: "Emerald Lotus",
        category: "phone-charms",
        price: 1900,
        description: "Stunning emerald-colored lotus with pearl center",
        badge: "New"
    },
    {
        id: 8,
        name: "Silver Arabesque",
        category: "keychains",
        price: 1600,
        description: "Delicate silver arabesque pattern, lightweight",
        badge: ""
    },
    {
        id: 9,
        name: "Ruby Heart Charm",
        category: "phone-charms",
        price: 2200,
        description: "Deep red ruby heart charm perfect for charm bracelets",
        badge: "Best Seller"
    },
    {
        id: 10,
        name: "Sapphire Moon",
        category: "keychains",
        price: 1700,
        description: "Celestial moon design with sapphire-blue crystal",
        badge: ""
    },
    {
        id: 11,
        name: "Golden Filigree",
        category: "phone-charms",
        price: 1950,
        description: "Intricate filigree goldwork with traditional craftsmanship",
        badge: ""
    },
    {
        id: 12,
        name: "Turquoise Hamsa",
        category: "keychains",
        price: 1450,
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
    try {
      const saved = localStorage.getItem('catene_cart');
      const parsed = saved ? JSON.parse(saved) : [];
      cart = Array.isArray(parsed) ? parsed.filter(item => item && Number.isInteger(item.id) && Number.isInteger(item.quantity) && item.quantity > 0 && products.some(product => product.id === item.id))
        .map(item => ({ ...products.find(product => product.id === item.id), quantity: Math.min(item.quantity, 99) })) : [];
    } catch { cart = []; }
}

function saveCart() {
    try { localStorage.setItem('catene_cart', JSON.stringify(cart)); } catch { showNotification('This browser could not save your bag.', 'error'); }
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
    else filtered.sort((a,b)=>b.id-a.id);
    filteredProducts = filtered;
    const status = document.getElementById('searchStatus');
    if (status) status.textContent = normalized ? `Showing results for “${q.trim()}”` : '';
}

function filterProducts(e) {
    const changed = e?.target;
    const boxes = [...document.querySelectorAll('.filter-group input[type="checkbox"]')];
    const all = boxes.find(cb => cb.value === 'all');
    if (changed?.value === 'all' && changed.checked) boxes.filter(cb => cb !== all).forEach(cb => cb.checked = false);
    else if (changed?.value !== 'all' && changed?.checked) { if (all) all.checked = false; }
    const selected = boxes.some(cb => cb.checked && cb.value !== 'all');
    if (all && !selected && !boxes.some(cb => cb.checked)) all.checked = true;
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
    const lines = cart.map(item => `• ${item.name} × ${item.quantity} — PKR ${(item.price*item.quantity).toLocaleString()}`).join('\n');
    const body = `Hello Catene.pk,\n\nI’d like to ask about:\n${lines}\n\nItem subtotal: PKR ${getCartTotal().toLocaleString()}\nPlease confirm availability, delivery charges and payment options.`;
    const subject = encodeURIComponent('Catene.pk order enquiry');
    window.location.href = `mailto:maheenramzan13@gmail.com?subject=${subject}&body=${encodeURIComponent(body)}`;
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
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: birthdayConfig.timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
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
  setupCharmInteraction();
  setupLuna3D();
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
function toggleCharm() {
  const charm = document.getElementById('heroCharm');
  if (!charm) return;
  const turned = charm.classList.toggle('is-turned');
  charm.setAttribute('aria-pressed', String(turned));
}
function setupCharmInteraction() {
  const charm = document.getElementById('heroCharm');
  if (!charm || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  charm.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const bounds = charm.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    charm.style.setProperty('--tilt-x', `${-y * 18}deg`);
    charm.style.setProperty('--tilt-y', `${x * 24}deg`);
  });
  charm.addEventListener('pointerleave', () => {
    charm.style.setProperty('--tilt-x', '0deg');
    charm.style.setProperty('--tilt-y', '0deg');
  });
}

let luna3DState = null;
function setupLuna3D() {
  const stage = document.getElementById('luna3dStage');
  if (!stage) return;
  const begin = () => {
    if (luna3DState?.loading || luna3DState?.ready) return;
    luna3DState = { loading: true, ready: false, paused: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false, visible: true, targetYaw: 0, targetPitch: 0, frame: 0 };
    loadLuna3D(stage).catch(error => {
      console.warn('Luna 3D scene could not load; keeping the illustrated fallback.', error);
      luna3DState.loading = false;
      stage.parentElement?.classList.remove('is-ready');
      const status = document.getElementById('luna3dStatus');
      if (status) status.textContent = 'Luna’s 3D view could not load, but her portrait is still here.';
    });
  };
  if (!('IntersectionObserver' in window)) { begin(); return; }
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); begin(); }
  }, { rootMargin: '180px 0px', threshold: 0.01 });
  observer.observe(stage);
}
async function loadLuna3D(stage) {
  const status = document.getElementById('luna3dStatus');
  const modelUrl = stage.dataset.modelUrl;
  if (!modelUrl) throw new Error('3D model URL is missing');
  if (status) status.textContent = 'Lighting Luna’s little world…';
  const [THREE, loaderModule] = await Promise.all([
    import('three'),
    import('three/addons/loaders/GLTFLoader.js')
  ]);
  const { GLTFLoader } = loaderModule;
  const canvas = document.getElementById('luna3dCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.toneMappingExposure = 1;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
  camera.position.set(0, 1.35, 4.55);
  camera.lookAt(0, 0.95, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x9aaca9, 2.6));
  const keyLight = new THREE.DirectionalLight(0xfffdf8, 2.2);
  keyLight.position.set(-3, 5, 4);
  scene.add(keyLight);
  const tealRim = new THREE.PointLight(0x91e0da, 5.5, 8, 2);
  tealRim.position.set(2.8, 2.4, -1.8);
  scene.add(tealRim);
  const warmFill = new THREE.PointLight(0xfff2e8, 2.8, 7, 2);
  warmFill.position.set(-2, 1.3, 2.2);
  scene.add(warmFill);

  const gold = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.84, roughness: 0.25 });
  const teal = new THREE.MeshStandardMaterial({ color: 0x075e63, metalness: 0.55, roughness: 0.3 });
  const paleTeal = new THREE.MeshStandardMaterial({ color: 0x65c2bc, metalness: 0.55, roughness: 0.24, transparent: true, opacity: 0.52 });
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.91, 1.02, 0.16, 96), teal);
  plinth.position.y = 0.02;
  scene.add(plinth);
  const plinthTop = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.035, 96), gold);
  plinthTop.position.y = 0.11;
  scene.add(plinthTop);
  const plinthInlay = new THREE.Mesh(new THREE.CylinderGeometry(0.83, 0.83, 0.022, 96), teal);
  plinthInlay.position.y = 0.139;
  scene.add(plinthInlay);
  const halo = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.012, 12, 128), paleTeal);
  halo.position.set(0, 0.95, -1.65);
  halo.rotation.x = 1.12;
  scene.add(halo);
  const haloGold = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.009, 10, 128), gold);
  haloGold.material = gold.clone();
  haloGold.material.transparent = true;
  haloGold.material.opacity = 0.62;
  haloGold.position.set(0, 0.84, -1.85);
  haloGold.rotation.x = 0.96;
  scene.add(haloGold);

  const modelRoot = new THREE.Group();
  scene.add(modelRoot);
  const gltf = await new GLTFLoader().loadAsync(modelUrl);
  const model = gltf.scene;
  model.traverse(part => {
    if (!part.isMesh) return;
    part.castShadow = false;
    part.receiveShadow = false;
    const tuneMaterial = source => {
      const material = source.clone();
      if (material.color) material.color.set(0xffffff);
      if ('metalness' in material) material.metalness = 0;
      if ('roughness' in material) material.roughness = Math.max(material.roughness || 0, 0.88);
      return material;
    };
    part.material = Array.isArray(part.material) ? part.material.map(tuneMaterial) : tuneMaterial(part.material);
  });
  const initialBounds = new THREE.Box3().setFromObject(model);
  const initialSize = initialBounds.getSize(new THREE.Vector3());
  const longest = Math.max(initialSize.x, initialSize.y, initialSize.z) || 1;
  model.scale.setScalar(2.05 / longest);
  const bounds = new THREE.Box3().setFromObject(model);
  const center = bounds.getCenter(new THREE.Vector3());
  model.position.x -= center.x;
  model.position.z -= center.z;
  model.position.y += 0.15 - bounds.min.y;
  modelRoot.add(model);
  const baseY = modelRoot.position.y;

  const sparkles = [];
  for (let i = 0; i < 14; i++) {
    const sparkle = new THREE.Mesh(new THREE.SphereGeometry(i % 4 === 0 ? 0.035 : 0.022, 10, 10), gold);
    sparkle.userData = { angle: (i / 14) * Math.PI * 2, radius: 1.18 + (i % 3) * 0.1, lift: 0.55 + (i % 5) * 0.31, phase: i * 0.8 };
    sparkles.push(sparkle);
    scene.add(sparkle);
  }

  const state = luna3DState;
  Object.assign(state, { ready: true, loading: false, THREE, renderer, scene, camera, modelRoot, halo, haloGold, sparkles, baseY, targetYaw: 0, targetPitch: 0, frame: 0 });
  const world = stage.parentElement;
  world?.classList.add('is-ready');
  if (status) status.textContent = 'Meet Luna Tuna — your little 3D Persian cat.';
  world?.querySelectorAll('.luna-world-controls button').forEach(button => button.disabled = false);
  const motionButton = document.getElementById('luna3dMotionButton');
  if (motionButton) {
    motionButton.setAttribute('aria-pressed', String(!state.paused));
    motionButton.textContent = state.paused ? 'Resume Luna' : 'Pause Luna';
  }

  const resize = () => {
    if (!state.ready) return;
    const width = Math.max(1, stage.clientWidth), height = Math.max(1, stage.clientHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    renderLuna3D();
  };
  state.resizeObserver = new ResizeObserver(resize);
  state.resizeObserver.observe(stage);
  resize();

  let pointer = null;
  stage.addEventListener('pointerdown', event => {
    if (event.target.closest('.luna-world-controls')) return;
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, lastX: event.clientX, lastY: event.clientY, moved: false };
    stage.setPointerCapture?.(event.pointerId);
  });
  stage.addEventListener('pointermove', event => {
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.lastX, dy = event.clientY - pointer.lastY;
    if (Math.abs(event.clientX - pointer.x) + Math.abs(event.clientY - pointer.y) > 5) pointer.moved = true;
    state.targetYaw += dx * 0.009;
    state.targetPitch = Math.max(-0.34, Math.min(0.34, state.targetPitch + dy * 0.004));
    pointer.lastX = event.clientX; pointer.lastY = event.clientY;
    renderLuna3D();
  });
  stage.addEventListener('pointerup', event => {
    if (!pointer || pointer.id !== event.pointerId) return;
    if (!pointer.moved && !state.paused) state.reactionUntil = performance.now() + 900;
    pointer = null;
    renderLuna3D();
  });
  stage.addEventListener('pointercancel', () => { pointer = null; });
  stage.addEventListener('keydown', event => {
    const step = 0.24;
    if (event.key === 'ArrowLeft') state.targetYaw -= step;
    else if (event.key === 'ArrowRight') state.targetYaw += step;
    else if (event.key === 'ArrowUp') state.targetPitch = Math.min(0.34, state.targetPitch + step);
    else if (event.key === 'ArrowDown') state.targetPitch = Math.max(-0.34, state.targetPitch - step);
    else return;
    event.preventDefault();
    renderLuna3D();
  });
  state.visibilityObserver = new IntersectionObserver(entries => {
    state.visible = entries.some(entry => entry.isIntersecting);
    if (state.visible && !document.hidden && !state.paused) startLuna3DLoop();
    else stopLuna3DLoop();
  }, { threshold: 0.01 });
  state.visibilityObserver.observe(stage);
  state.visibilityListener = () => {
    if (document.hidden) stopLuna3DLoop();
    else if (state.visible && !state.paused) startLuna3DLoop();
    else renderLuna3D();
  };
  document.addEventListener('visibilitychange', state.visibilityListener);
  if (!state.paused) startLuna3DLoop();
  else renderLuna3D();
}
function renderLuna3D() {
  const state = luna3DState;
  if (state?.ready) state.renderer.render(state.scene, state.camera);
}
function startLuna3DLoop() {
  const state = luna3DState;
  if (!state?.ready || state.paused || !state.visible || document.hidden || state.frame) return;
  const THREE = state.THREE;
  const tick = time => {
    state.frame = 0;
    if (!state.visible || document.hidden || state.paused) return;
    const seconds = time * 0.001;
    const reaction = state.reactionUntil && performance.now() < state.reactionUntil
      ? Math.sin((1 - (state.reactionUntil - performance.now()) / 900) * Math.PI) * 0.13 : 0;
    state.modelRoot.rotation.y = state.targetYaw + Math.sin(seconds * 0.34) * 0.18;
    state.modelRoot.rotation.x = state.targetPitch + Math.sin(seconds * 0.47) * 0.025;
    state.modelRoot.rotation.z = Math.sin(seconds * 0.58) * 0.035 + reaction * 0.42;
    state.modelRoot.scale.setScalar(1 + Math.sin(seconds * 1.8) * 0.012);
    state.modelRoot.position.y = state.baseY + Math.sin(seconds * 1.3) * 0.035 + reaction;
    state.halo.rotation.z = seconds * 0.13;
    state.haloGold.rotation.z = -seconds * 0.1;
    state.sparkles.forEach(sparkle => {
      const data = sparkle.userData;
      const angle = data.angle + seconds * 0.16;
      sparkle.position.set(Math.cos(angle) * data.radius, data.lift + Math.sin(seconds + data.phase) * 0.06, Math.sin(angle) * data.radius);
    });
    state.renderer.render(state.scene, state.camera);
    state.frame = requestAnimationFrame(tick);
  };
  state.frame = requestAnimationFrame(tick);
}
function stopLuna3DLoop() {
  if (!luna3DState?.frame) return;
  cancelAnimationFrame(luna3DState.frame);
  luna3DState.frame = 0;
}
function rotateLuna3D(angle) {
  if (!luna3DState?.ready) return;
  luna3DState.targetYaw += angle;
  renderLuna3D();
}
function toggleLuna3DMotion() {
  const state = luna3DState;
  if (!state?.ready) return;
  state.paused = !state.paused;
  const button = document.getElementById('luna3dMotionButton');
  if (button) {
    button.setAttribute('aria-pressed', String(!state.paused));
    button.textContent = state.paused ? 'Resume Luna' : 'Pause Luna';
  }
  if (state.paused) { stopLuna3DLoop(); renderLuna3D(); }
  else startLuna3DLoop();
}
