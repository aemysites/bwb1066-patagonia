/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match the example exactly
  const headerRow = ['Cards (cards49)'];
  const cells = [headerRow];

  // Find all product cards in the slider
  const cardWrappers = Array.from(element.querySelectorAll(':scope > div.slider-product-tile'));

  cardWrappers.forEach(card => {
    // -------- IMAGE CELL --------
    let imageEl = null;
    // Use the first meta[itemprop=image] for the main image (Patagonia always provides these with absolute URLs)
    const metaImg = card.querySelector('meta[itemprop=image]');
    if (metaImg && metaImg.content) {
      imageEl = document.createElement('img');
      imageEl.src = metaImg.content;
      // Try to get a meaningful alt from the inner image or meta's alt/title
      let altText = '';
      const innerImg = card.querySelector('img');
      if (innerImg && innerImg.alt) {
        altText = innerImg.alt;
      } else if (metaImg.getAttribute('alt')) {
        altText = metaImg.getAttribute('alt');
      } else if (metaImg.getAttribute('title')) {
        altText = metaImg.getAttribute('title');
      }
      imageEl.alt = altText;
    }

    // -------- TEXT CELL --------
    const textCellContent = [];

    // Title
    let titleEl = card.querySelector('.product-tile__name');
    if (!titleEl) {
      // fallback if needed
      const altTitleEl = card.querySelector('.pdp-link p');
      if (altTitleEl) titleEl = altTitleEl;
    }
    if (titleEl && titleEl.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      textCellContent.push(strong);
    }

    // Price: try all possible locations and aggregate all text
    let priceText = '';
    // Try desktop price
    const priceDesktop = card.querySelector('.color-price.active .price');
    if (priceDesktop) {
      priceText = priceDesktop.textContent.replace(/\s+/g, ' ').trim();
    } else {
      // Try mobile meta price
      const priceMobile = card.querySelector('.product-tile__mobile-meta .price');
      if (priceMobile) {
        priceText = priceMobile.textContent.replace(/\s+/g, ' ').trim();
      }
    }
    if (priceText) {
      const priceDiv = document.createElement('div');
      priceDiv.textContent = priceText;
      textCellContent.push(priceDiv);
    }

    // Color swatches
    const swatchButtons = Array.from(card.querySelectorAll('.product-tile__pagination .product-tile__bullet button.cta-circle--swatch'));
    if (swatchButtons.length) {
      const swatchContainer = document.createElement('div');
      swatchContainer.style.display = 'flex';
      swatchContainer.style.gap = '0.33em';
      swatchButtons.forEach(btn => {
        const circle = document.createElement('span');
        circle.style.display = 'inline-block';
        circle.style.width = '16px';
        circle.style.height = '16px';
        circle.style.borderRadius = '50%';
        // The background color is in the button's style
        if (btn.style.backgroundColor) {
          circle.style.background = btn.style.backgroundColor;
        }
        // Use the swatch's title for accessibility
        circle.title = btn.getAttribute('title') || '';
        circle.style.border = '1px solid #ccc';
        swatchContainer.appendChild(circle);
      });
      textCellContent.push(swatchContainer);
    }

    // --- Add the row ---
    // Fallback for missing image/text
    cells.push([
      imageEl || document.createTextNode(''),
      textCellContent.length ? textCellContent : document.createTextNode('')
    ]);
  });

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
