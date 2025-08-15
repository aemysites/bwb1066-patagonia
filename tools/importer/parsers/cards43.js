/* global WebImporter */
export default function parse(element, { document }) {
  // Table header - must match exactly
  const cells = [['Cards (cards43)']];

  // Get all immediate product and promo slides
  const slides = Array.from(element.querySelectorAll('.swiper-wrapper > .slider-product-tile'));

  slides.forEach(slide => {
    // PRODUCT CARD: with <product-tile>
    const productTile = slide.querySelector('product-tile');
    if (productTile) {
      // IMAGE: Find the first non-placeholder img with alt
      let imgEl = null;
      const imgs = productTile.querySelectorAll('img');
      for (const img of imgs) {
        if (img.alt && img.alt.trim() && !img.src.endsWith('/1x1.png')) {
          imgEl = img;
          break;
        }
      }
      if (!imgEl && imgs.length) imgEl = imgs[0];

      // TEXT CELL: Collect all visible text content
      const textContent = document.createElement('div');
      // Title - from .product-tile__name
      const title = productTile.querySelector('.product-tile__name');
      if (title && title.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        textContent.appendChild(strong);
      }
      // Colorway (all, not just current)
      const colorways = Array.from(productTile.querySelectorAll('.product-tile__colorway'))
        .map(el => el.textContent.trim())
        .filter(Boolean);
      if (colorways.length) {
        const colorDiv = document.createElement('div');
        colorDiv.textContent = colorways.join(', ');
        textContent.appendChild(colorDiv);
      }
      // Price (all visible sale/originals)
      // Prefer .color-price.active > .price, else any .product-tile__price > .price
      let prices = [];
      const activePrices = productTile.querySelectorAll('.color-price.active .price');
      if (activePrices.length) {
        activePrices.forEach(priceNode => {
          prices.push(priceNode.textContent.replace(/\s+/g, ' ').trim());
        });
      } else {
        const regularPrices = productTile.querySelectorAll('.product-tile__price .price');
        regularPrices.forEach(priceNode => {
          prices.push(priceNode.textContent.replace(/\s+/g, ' ').trim());
        });
      }
      if (prices.length) {
        const priceDiv = document.createElement('div');
        priceDiv.textContent = prices.join(' | ');
        textContent.appendChild(priceDiv);
      }
      // Swatches (color chips, show as colored circles)
      const swatches = productTile.querySelectorAll('.product-tile__pagination .product-tile__colors');
      if (swatches.length) {
        const swatchDiv = document.createElement('div');
        swatches.forEach(btn => {
          const chip = document.createElement('span');
          chip.title = btn.title || '';
          chip.style.display = 'inline-block';
          chip.style.width = '14px';
          chip.style.height = '14px';
          chip.style.borderRadius = '50%';
          chip.style.margin = '0 2px';
          chip.style.backgroundColor = btn.style.backgroundColor || '#eee';
          chip.style.border = '1px solid #ccc';
          swatchDiv.appendChild(chip);
        });
        textContent.appendChild(swatchDiv);
      }
      // Compose and push the card row
      cells.push([imgEl, textContent]);
      return;
    }
    // MARKETING CARD: with .marketing-tile
    const marketingTile = slide.querySelector('.marketing-tile');
    if (marketingTile) {
      // IMAGE: First img
      const imgEl = marketingTile.querySelector('img');
      // TEXT: Grab headline, subtitle, and button if present
      const textContent = document.createElement('div');
      // Headline (try big text, fallback to hardcoded 'Sale')
      let headline = '';
      // Use first big text node in marketing-tile__content
      const marketingHead = marketingTile.querySelector('.marketing-tile__content strong, .marketing-tile__content span, .marketing-tile__content div');
      if (marketingHead && marketingHead.textContent.trim()) {
        headline = marketingHead.textContent.trim();
      }
      if (!headline) headline = 'Sale';
      const strong = document.createElement('strong');
      strong.textContent = headline;
      textContent.appendChild(strong);
      // Subtitle/Promo
      let subtitle = '';
      const promoSub = marketingTile.querySelector('.marketing-tile__content__top, .marketing-tile__content__bottom');
      if (promoSub && promoSub.textContent.trim()) subtitle = promoSub.textContent.trim();
      if (subtitle) {
        const subSpan = document.createElement('div');
        subSpan.textContent = subtitle;
        textContent.appendChild(subSpan);
      }
      // CTA Button
      const cta = marketingTile.querySelector('.marketing-tile__cta a');
      if (cta) textContent.appendChild(cta);
      // Push card row
      cells.push([imgEl, textContent]);
      return;
    }
    // If skeleton/placeholder, skip
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace element
  element.replaceWith(block);
}
