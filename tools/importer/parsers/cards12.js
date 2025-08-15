/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as required by the block spec
  const headerRow = ['Cards (cards12)'];

  // Helper to extract main image (from meta[itemprop="image"], using the first one in each card)
  function extractImage(card) {
    let img = null;
    const metaImg = card.querySelector('meta[itemprop="image"]');
    if (metaImg && metaImg.content) {
      img = document.createElement('img');
      img.src = metaImg.content;
      // Try to get alt text from the closest img or product-tile-image alt
      const imgTag = card.querySelector('img.product-tile__cover-image');
      img.alt = (imgTag && imgTag.alt) ? imgTag.alt : '';
    } else {
      // fallback to any visible <img> with non-empty src
      const imgTag = card.querySelector('img.product-tile__cover-image');
      if (imgTag && imgTag.src && !imgTag.src.endsWith('1x1.png')) {
        img = imgTag;
      }
    }
    return img;
  }

  // Helper to extract ALL meaningful text and elements from card
  function extractTextContent(card) {
    const cellContent = [];
    // Title (bold)
    const title = card.querySelector('.product-tile__name');
    if (title && title.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      cellContent.push(strong);
    }
    // Price(s) (strike-through and sale)
    // Capture all prices in the visible .price blocks
    const priceBlocks = card.querySelectorAll('.product-tile__price .price, .color-price.active .price, .price');
    priceBlocks.forEach((block) => {
      // Only add if not empty
      if (block.textContent.trim()) {
        // Reference the actual .price element from the DOM
        cellContent.push(block);
      }
    });
    // Colorway (text, eg. "Pitch Blue w/Endless Blue (PBLE)")
    const colorway = card.querySelector('.product-tile__colorway');
    if (colorway && colorway.textContent.trim()) {
      cellContent.push(colorway);
    }
    // Swatches (if present)
    const swatches = card.querySelector('.product-tile__pagination');
    if (swatches) {
      // Reference the swatches <ul> directly
      cellContent.push(swatches);
    }
    // Any <p> elements inside the card that are not the title
    Array.from(card.querySelectorAll('p')).forEach(p => {
      if ((!title || p !== title) && p.textContent.trim()) {
        cellContent.push(p);
      }
    });
    // Any directly nested text nodes in .product-tile__meta not already captured
    const meta = card.querySelector('.product-tile__meta');
    if (meta) {
      Array.from(meta.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          // Wrap in <div> for structure
          const extraDiv = document.createElement('div');
          extraDiv.textContent = node.textContent.trim();
          cellContent.push(extraDiv);
        }
      });
    }
    // Fallback: if cellContent is still empty, add all text content as a string
    if (cellContent.length === 0) {
      const fallbackText = card.textContent.trim();
      if (fallbackText) cellContent.push(fallbackText);
    }
    return cellContent;
  }

  // Extract all product cards
  const cards = Array.from(element.querySelectorAll(':scope > div.slider-product-tile'));
  const rows = cards.map(card => [
    extractImage(card),
    extractTextContent(card)
  ]);

  // Final table: header row + one row per card
  const block = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
  element.replaceWith(block);
}
