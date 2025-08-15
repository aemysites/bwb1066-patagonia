/* global WebImporter */
export default function parse(element, { document }) {
  // Header must match example
  const cells = [['Cards (cards4)']];

  // Find all cards (product or marketing) in the carousel
  const cardNodes = Array.from(element.querySelectorAll(':scope .swiper-wrapper > .slider-product-tile'));
  cardNodes.forEach(card => {
    let imageEl = null;
    let textBlock = null;

    // PRODUCT CARD: .product-tile
    const productTile = card.querySelector('.product-tile');
    if (productTile) {
      // Prefer first non-placeholder product image
      imageEl = productTile.querySelector('img');
      // Try to use full content area for text
      textBlock = productTile.querySelector('.product-tile__meta');
      if (!textBlock) {
        // Compose from name, price, color
        textBlock = document.createElement('div');
        // Title
        let nameEl = productTile.querySelector('.product-tile__name');
        if (nameEl && nameEl.textContent.trim()) {
          const strong = document.createElement('strong');
          strong.textContent = nameEl.textContent.trim();
          textBlock.appendChild(strong);
        }
        // Price
        let priceEl = productTile.querySelector('.product-tile__price .value') || productTile.querySelector('.product-tile__price');
        if (priceEl && priceEl.textContent.trim()) {
          const div = document.createElement('div');
          div.textContent = priceEl.textContent.trim();
          textBlock.appendChild(div);
        }
        // Color name
        let colorEl = productTile.querySelector('.product-tile__colorway');
        if (colorEl && colorEl.textContent.trim()) {
          const colorDiv = document.createElement('div');
          colorDiv.textContent = colorEl.textContent.trim();
          textBlock.appendChild(colorDiv);
        }
      }
      // Add row, referencing elements only
      cells.push([
        imageEl || '',
        textBlock || ''
      ]);
      return;
    }

    // MARKETING TILE
    const marketingTile = card.querySelector('.marketing-tile');
    if (marketingTile) {
      imageEl = marketingTile.querySelector('img');
      textBlock = marketingTile.querySelector('.marketing-tile__content-wrapper') || marketingTile.querySelector('.marketing-tile__content') || '';
      cells.push([
        imageEl || '',
        textBlock || ''
      ]);
      return;
    }

    // SKELETON CARD (empty loading placeholders)
    textBlock = document.createElement('div');
    let nameEl = card.querySelector('.product-tile__name');
    if (nameEl && nameEl.textContent.trim() && nameEl.textContent.trim() !== '\u00A0') {
      const strong = document.createElement('strong');
      strong.textContent = nameEl.textContent.trim();
      textBlock.appendChild(strong);
    }
    let priceEl = card.querySelector('.product-tile__price .value') || card.querySelector('.product-tile__price');
    if (priceEl && priceEl.textContent.trim() && priceEl.textContent.trim() !== '\u00A0') {
      const div = document.createElement('div');
      div.textContent = priceEl.textContent.trim();
      textBlock.appendChild(div);
    }
    cells.push(['', textBlock.childNodes.length ? textBlock : '']);
  });

  // Create the block table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
