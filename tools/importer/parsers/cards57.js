/* global WebImporter */
export default function parse(element, { document }) {
  // Table header, exact match required
  const headerRow = ['Cards (cards57)'];
  const rows = [];

  // Find the wrapper containing the actual card tiles
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  // Get all card slides (ignore nav buttons etc.)
  const cardEls = swiperWrapper.querySelectorAll(':scope > .slider-product-tile');

  cardEls.forEach(cardEl => {
    // --- IMAGE/ICON cell ---
    let image = null;
    // Try: first <img> with valid src
    let imgEl = cardEl.querySelector('img');
    if (imgEl && imgEl.src && !imgEl.src.endsWith('1x1.png')) {
      image = imgEl;
    } else {
      // Fallback: meta[itemprop=image]
      const metaImg = cardEl.querySelector('meta[itemprop="image"]');
      if (metaImg && metaImg.content) {
        const img = document.createElement('img');
        img.src = metaImg.content;
        image = img;
      }
    }

    // --- TEXT cell ---
    // Flexible collection of all visible text content (title, description, price, cta, etc)
    let textContent = document.createElement('div');
    let added = false;

    // Marketing Tile special handling
    const marketingTile = cardEl.querySelector('.marketing-tile__content');
    if (marketingTile) {
      // Collect all child nodes for full content (no markdown, only html)
      Array.from(marketingTile.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = node.textContent.trim();
          textContent.appendChild(p);
          added = true;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          textContent.appendChild(node); // Reference existing element
          added = true;
        }
      });
      // Add CTA if present
      const cta = cardEl.querySelector('.marketing-tile__cta a, .marketing-tile__tile-link');
      if (cta && cta.href) {
        textContent.appendChild(cta); // Reference existing element
        added = true;
      }
    } else {
      // Product tile: Title
      let titleEl = cardEl.querySelector('.product-tile__name');
      if (titleEl && titleEl.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = titleEl.textContent.trim();
        textContent.appendChild(strong);
        added = true;
      }
      // Colorway
      let colorwayEl = cardEl.querySelector('.product-tile__colorway');
      if (colorwayEl && colorwayEl.textContent.trim()) {
        const colorDiv = document.createElement('div');
        colorDiv.textContent = colorwayEl.textContent.trim();
        textContent.appendChild(colorDiv);
        added = true;
      }
      // Price (collect all price variants)
      let priceEls = cardEl.querySelectorAll('.product-tile__price .value, .color-price.active .value, .sales .value');
      let priceSeen = false;
      priceEls.forEach(priceEl => {
        if (priceEl.textContent.trim()) {
          const priceDiv = document.createElement('div');
          priceDiv.textContent = priceEl.textContent.trim();
          textContent.appendChild(priceDiv);
          priceSeen = true;
          added = true;
        }
      });
      // Swatch color names
      const swatches = cardEl.querySelectorAll('.product-tile__pagination .product-tile__bullet button');
      if (swatches.length > 0) {
        let swatchNames = [];
        swatches.forEach(btn => {
          if (btn.title) swatchNames.push(btn.title);
        });
        if (swatchNames.length) {
          const swatchDiv = document.createElement('div');
          swatchDiv.textContent = swatchNames.join(', ');
          textContent.appendChild(swatchDiv);
          added = true;
        }
      }
      // Best Seller badge
      let badgeEl = cardEl.querySelector('.badge--best-seller');
      if (badgeEl && badgeEl.textContent.trim()) {
        const badgeDiv = document.createElement('div');
        badgeDiv.textContent = badgeEl.textContent.trim();
        textContent.appendChild(badgeDiv);
        added = true;
      }
      // CTA (Quick Add/Shop)
      let ctaBtn = cardEl.querySelector('.tile-quickadd-btn, .mobile-tile-quickadd-btn');
      if (ctaBtn) {
        textContent.appendChild(ctaBtn);
        added = true;
      }
      let ctaLink = cardEl.querySelector('a.btn');
      if (ctaLink) {
        textContent.appendChild(ctaLink);
        added = true;
      }
    }
    // Fallback: gather all card text (if nothing else)
    if (!added) {
      const cardText = cardEl.innerText || cardEl.textContent;
      if (cardText && cardText.trim()) {
        const p = document.createElement('p');
        p.textContent = cardText.trim();
        textContent.appendChild(p);
        added = true;
      }
    }

    // Only add row if at least image or text
    if (image || added) {
      rows.push([image, textContent]);
    }
  });

  // Compose table with header and card rows
  if (rows.length) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      ...rows
    ], document);
    element.replaceWith(table);
  }
}
