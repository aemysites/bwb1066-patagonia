/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: matches the example exactly
  const headerRow = ['Cards (cards52)'];
  const rows = [headerRow];

  // Find the wrapper that contains all cards
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  // Get all slides (cards)
  const slides = Array.from(swiperWrapper.children).filter(child => child.classList.contains('slider-product-tile'));

  slides.forEach(slide => {
    // PRODUCT CARDS
    const productTile = slide.querySelector('product-tile');
    if (productTile) {
      // -- IMAGE --
      let imgEl = null;
      // Get the first visible product image (the example shows only one image per card)
      let activeImage = productTile.querySelector('.product-tile__image.default.active img') || productTile.querySelector('.product-tile__image img');
      if (activeImage && activeImage.src && !/1x1\.png$/.test(activeImage.src)) {
        imgEl = activeImage;
      } else {
        // Try a fallback: meta[itemprop=image]
        let metaImg = productTile.querySelector('meta[itemprop=image]');
        if (metaImg && metaImg.content) {
          let img = document.createElement('img');
          img.src = metaImg.content;
          img.alt = productTile.querySelector('.product-tile__name')?.textContent.trim() || '';
          imgEl = img;
        }
      }
      // -- TEXT --
      let textCell = document.createElement('div');
      // Title
      let nameEl = productTile.querySelector('.product-tile__name');
      if (nameEl && nameEl.textContent.trim()) {
        let strong = document.createElement('strong');
        strong.textContent = nameEl.textContent.trim();
        textCell.appendChild(strong);
      }
      // Colorway (if present and not already in title)
      let colorwayEl = productTile.querySelector('.product-tile__colorway');
      if (colorwayEl && colorwayEl.textContent.trim()) {
        textCell.appendChild(document.createElement('br'));
        textCell.appendChild(document.createTextNode(colorwayEl.textContent.trim()));
      }
      // Price (lowest price for this tile)
      // Prefer the first .product-tile__price .value that matches the active color
      let price = '';
      // Try to find a .color-price.active .value under .product-tile__meta
      let activePriceEl = productTile.querySelector('.color-price.active .value');
      if (!activePriceEl) {
        // fallback: first .product-tile__meta .value
        activePriceEl = productTile.querySelector('.product-tile__meta .value');
      }
      if (!activePriceEl) {
        // fallback: .product-tile__mobile-meta .value
        activePriceEl = productTile.querySelector('.product-tile__mobile-meta .value');
      }
      if (!activePriceEl) {
        // fallback: .product-tile__price .value
        activePriceEl = productTile.querySelector('.product-tile__price .value');
      }
      if (activePriceEl && activePriceEl.textContent.trim()) {
        price = activePriceEl.textContent.trim();
        textCell.appendChild(document.createElement('br'));
        textCell.appendChild(document.createTextNode(price));
      }
      // Only push if we have at least image or text
      if (imgEl || textCell.textContent.trim()) {
        rows.push([
          imgEl || '',
          textCell
        ]);
      }
      return;
    }
    // MARKETING TILE (SALE CARD)
    const marketingTile = slide.querySelector('.marketing-tile');
    if (marketingTile) {
      // -- IMAGE --
      let imgEl = marketingTile.querySelector('img');
      // -- TEXT --
      let textCell = document.createElement('div');
      // Try to extract button/CTA
      let cta = marketingTile.querySelector('.marketing-tile__cta a.btn');
      if (cta) {
        textCell.appendChild(cta);
      }
      // Only push if we have at least an image or text
      if (imgEl || textCell.childNodes.length > 0) {
        rows.push([
          imgEl || '',
          textCell
        ]);
      }
      return;
    }
  });

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
