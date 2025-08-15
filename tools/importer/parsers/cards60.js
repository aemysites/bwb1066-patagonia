/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards60) block header, exact match
  const headerRow = ['Cards (cards60)'];

  // Find all the card tiles (product or marketing)
  const cardNodes = Array.from(
    element.querySelectorAll(':scope > div > .swiper > .row > .slider-product-tile')
  );

  // Helper to get the main image for a card (prioritizing product images, but works for marketing)
  function getCardImage(card) {
    // Prefer first visible img in card
    const imgs = card.querySelectorAll('img[src]');
    for (const img of imgs) {
      if (
        img.src && // Not blank
        img.offsetWidth > 0 && img.offsetHeight > 0 // Is displayed
      ) {
        return img;
      }
    }
    // Fallback: first img w/ src
    return imgs[0] || null;
  }

  // Helper: collect all visible text content and semantic structure from a card
  function getCardText(card) {
    const container = document.createElement('div');
    // Title (prefer .product-tile__name or marketing-tile headline)
    let title = card.querySelector('.product-tile__name, .pdp-link .product-tile__name');
    if (!title) {
      // Try marketing headline
      const marketingHeadline = card.querySelector('.marketing-tile__content strong, .marketing-tile__content');
      if (marketingHeadline && marketingHeadline.textContent.trim()) {
        title = marketingHeadline;
      }
    }
    if (title && title.textContent.trim()) {
      // Use <strong> to match example style
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      container.appendChild(strong);
    }
    // Description (product meta, price, colorway, swatches, for product tile)
    let meta = card.querySelector('.product-tile__meta, .product-tile__meta-primary, .product-tile__meta .pdp-link');
    if (meta) {
      // Only append visible children with text
      Array.from(meta.children).forEach(child => {
        if (child.textContent.trim()) {
          // If child is a price or colorway, preserve formatting
          container.appendChild(child);
        }
      });
    }
    // For marketing tile, add content and CTA/links
    let marketingContent = card.querySelector('.marketing-tile__content');
    if (marketingContent && marketingContent.textContent.trim()) {
      // Don't duplicate title
      if (!container.textContent.includes(marketingContent.textContent.trim())) {
        container.appendChild(marketingContent);
      }
    }
    let ctaBtn = card.querySelector('.marketing-tile__cta a, .marketing-tile__content__bottom a');
    if (ctaBtn) {
      container.appendChild(ctaBtn);
    }
    // Also check for price under .product-tile__price (if not already included)
    let price = card.querySelector('.product-tile__price');
    if (price && !container.contains(price)) {
      container.appendChild(price);
    }
    // Also check for swatches (color dots), only if not already included
    let swatches = card.querySelector('.color-swatches .swatches');
    if (swatches && !container.contains(swatches)) {
      container.appendChild(swatches);
    }
    // As fallback, if still has no text, add any visible paragraph or span with text
    if (!container.textContent.trim()) {
      Array.from(card.querySelectorAll('p, span')).forEach(e => {
        if (e.textContent.trim()) {
          container.appendChild(e);
        }
      });
    }
    return container;
  }

  // Compose each card's row (image, text)
  const rows = cardNodes.map(card => {
    // Skip skeleton/empty tiles (no img and no text)
    const img = getCardImage(card);
    const text = getCardText(card);
    if (!img && !text.textContent.trim()) return null;
    return [img, text];
  }).filter(Boolean);

  // Full block table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
