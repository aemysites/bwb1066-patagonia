/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row, from example
  const headerRow = ['Cards (cards50)'];

  // 2. Find cards
  const wrapper = element.querySelector('.swiper-wrapper');
  if (!wrapper) return;
  const slides = Array.from(wrapper.querySelectorAll(':scope > .swiper-slide'));
  const rows = [];

  slides.forEach((slide) => {
    // --- IMAGE: find first img inside slide ---
    let imgEl = slide.querySelector('img');

    // --- TEXT: collect all visible text content ---
    // Approach: For each card, grab all direct descendants except images, svg, etc.
    // Reference original DOM, never clone
    let textContentFragments = [];

    // 1. Look for <p class="product-tile__name"> or .product-tile__name (title)
    let titleEl = slide.querySelector('p.product-tile__name, .product-tile__name:not(:empty)');
    if (titleEl && titleEl.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      textContentFragments.push(strong);
    }

    // 2. Find .product-tile__colorway (color variation subtitle)
    let colorwayEl = slide.querySelector('.product-tile__colorway');
    if (colorwayEl && colorwayEl.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = colorwayEl.textContent.trim();
      textContentFragments.push(p);
    }

    // 3. Find price(s) - only grab visible price text
    let priceContainers = slide.querySelectorAll('.product-tile__price, .product-tile__mobile-meta');
    priceContainers.forEach(container => {
      // Ignore inner meta tags, keep only visible text
      let priceText = Array.from(container.childNodes)
        .filter(node => node.nodeType === 3 || (node.nodeType === 1 && node.tagName !== 'META'))
        .map(node => node.textContent.trim())
        .filter(Boolean)
        .join(' ');
      if (priceText) {
        const p = document.createElement('p');
        p.textContent = priceText;
        textContentFragments.push(p);
      }
    });

    // 4. Get main description (use .tile-body, .product-tile__meta, .marketing-tile__content)
    const descEl = slide.querySelector('.tile-body, .product-tile__meta, .marketing-tile__content');
    if (descEl && descEl.textContent.trim()) {
      // Only add if not already present
      const txt = descEl.textContent.trim();
      if (!textContentFragments.some(e => e.textContent && txt.includes(e.textContent))) {
        const p = document.createElement('p');
        p.textContent = txt;
        textContentFragments.push(p);
      }
    }

    // 5. CTA: Find CTA links or buttons (e.g. .marketing-tile__cta a)
    let ctaEl = slide.querySelector('.marketing-tile__cta a, .pdp-link a.btn');
    if (ctaEl) {
      textContentFragments.push(ctaEl);
    }

    // 6. If no content found, fallback to all visible text in slide
    if (textContentFragments.length === 0) {
      // Remove irrelevant elements
      Array.from(slide.querySelectorAll('img, svg, button, figure, meta, script, style')).forEach(el => el.remove());
      let txt = slide.textContent.trim();
      if (txt) {
        const p = document.createElement('p');
        p.textContent = txt;
        textContentFragments.push(p);
      }
    }

    // Combine all fragments for the cell, omitting empty ones
    textContentFragments = textContentFragments.filter(e => e && (e.textContent || e.tagName === 'A'));
    rows.push([imgEl || '', textContentFragments.length === 1 ? textContentFragments[0] : textContentFragments]);
  });

  // 3. Build and replace
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
