# Catene.pk

A static storefront for Catene.pk, a keychain and phone charm shop based in Lahore, Pakistan.

## Pages and technology

This site uses plain HTML, CSS, and JavaScript so it can be hosted on GitHub Pages without a server or build step.

- `index.html`: introduction and featured products
- `shop.html`: catalog, search, category and price filters, and sorting
- `cart.html`: local shopping bag and an email order enquiry
- `style.css`: responsive styling; the existing Poppins, Great Vibes, teal (`#00777f`) and gold accents are retained
- `script.js`: catalog data, cart state, display currency, and birthday configuration

## Shopping behavior

The bag is stored in this browser's local storage. The existing sample catalog and PKR prices are maintained in `script.js`; verify products and prices against actual stock before accepting orders. USD and EUR display values use the fixed indicative rates in that file; they are display conversions only, are not live exchange rates, and checkout enquiries state the item subtotal in PKR.

There is no payment gateway or order service configured. “Ask about your order” opens an email draft addressed to maheenramzan13@gmail.com; the visitor must review and send it. Shipping, availability, and payment options must be confirmed by email. The site does not submit newsletter subscriptions.

## Birthday greeting

The reusable birthday settings are in one place near the bottom of `script.js`:

```js
const birthdayConfig = {
  day: null,
  month: null,
  firstCelebrationYear: 2027,
  timeZone: 'Asia/Karachi',
  message: 'Happy birthday! A little love from Catene.pk.'
};
```

After the date is confirmed, replace `null` for `day` (1–31) and `month` (1–12). The date is validated, including February 29. The greeting appears only on that Lahore calendar date from 2027 onward, while a visitor uses the site. A session guard prevents it from appearing repeatedly during the same visit. Until both values are set, birthday mode stays inactive.

## Interactive 3D Luna hero

The homepage hero loads a cleaner reference-matched Luna Persian-cat model as a glTF binary (GLB) in a Three.js scene. She has a fluffy white coat, open pale blue eyes, pink nose and embroidered lace collar. Neutral lighting and matte fur materials keep her coat bright. Luna floats above a teal-and-gold display with animated orbit rings and small gold particles. Visitors can drag to turn her, use the arrow keys or turn buttons, tap for a bounce, and pause or resume the idle animation.

The scene is loaded only when it approaches the viewport. While the model loads, a local portrait of Luna appears; if that image also fails, the CSS charm is the final fallback. If WebGL or the model cannot load, Luna’s portrait remains visible. The animation pauses when the scene is off-screen or the browser tab is hidden, and it respects reduced-motion preferences.

Three.js 0.186.1 and its GLTF loader are imported from jsDelivr; the GLB is served from the model-generation provider. Those two external services must remain available for the full 3D experience. The static site still has no build step. The small Luna button in the page corner remains an inline SVG greeting.

## Local verification

There is no package manifest, build script, or test setup in this repository. The pages can be previewed by opening `index.html`; GitHub Pages can serve the static files directly.

## License

MIT License
