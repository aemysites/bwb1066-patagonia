/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches exactly
  const headerRow = ['Cards (cards27)'];
  const cells = [headerRow];

  // Get swiper slides representing cards
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;
  const slides = Array.from(swiperWrapper.children).filter(child => child.classList.contains('slider-product-tile'));

  slides.forEach((slide) => {
    // Marketing tile: special case (Sale card)
    const marketing = slide.querySelector('.marketing-tile');
    if (marketing) {
      // Image
      const img = marketing.querySelector('img') || null;
      // Try to get a text heading from the image alt or content
      let titleText = '';
      if (img && img.alt && img.alt.trim() && img.alt !== 'null') {
        titleText = img.alt.trim();
      } else {
        // Try to get visible text from the tile (e.g. Sale Up to 50% Off)
        let visibleSpan = marketing.querySelector('.marketing-tile__content span');
        if (visibleSpan && visibleSpan.textContent.trim()) {
          titleText = visibleSpan.textContent.trim();
        }
      }
      if (!titleText) {
        // Fallback to default
        titleText = 'Sale Up to 50% Off';
      }
      const titleEl = document.createElement('strong');
      titleEl.textContent = titleText;
      // Description: search for a subtitle or additional text
      let description = '';
      const contentWrapper = marketing.querySelector('.marketing-tile__content');
      if (contentWrapper) {
        // Get all text nodes inside, except for CTA and the span
        const textNodes = Array.from(contentWrapper.childNodes).filter(n => n.nodeType === 3 && n.textContent.trim());
        description = textNodes.map(n => n.textContent.trim()).join(' ');
      }
      let descriptionEl = null;
      if (description) {
        descriptionEl = document.createElement('p');
        descriptionEl.textContent = description;
      }
      // CTA button (Shop)
      const cta = marketing.querySelector('.marketing-tile__cta a');
      const rightCell = [];
      rightCell.push(titleEl);
      if (descriptionEl) rightCell.push(descriptionEl);
      if (cta) rightCell.push(cta);
      cells.push([img, rightCell]);
      return;
    }

    // Product card
    const productTile = slide.querySelector('.product-tile');
    if (!productTile) return;
    // --- Image ---
    let imgCell = null;
    // Find active product image, exclude placeholders
    const imgDivs = slide.querySelectorAll('.product-tile__image');
    let foundImage = false;
    for (const imgDiv of imgDivs) {
      const img = imgDiv.querySelector('img');
      if (img && img.src && !img.src.endsWith('1x1.png')) {
        imgCell = img;
        foundImage = true;
        break;
      }
    }
    if (!foundImage) {
      // fallback: first non-placeholder img in slide
      const imgs = slide.querySelectorAll('img');
      for (const img of imgs) {
        if (img.src && !img.src.endsWith('1x1.png')) {
          imgCell = img;
          break;
        }
      }
    }
    // --- Text ---
    // Title: .product-tile__name inside .pdp-link or anywhere
    let titleEl = null;
    const nameEl = productTile.querySelector('.pdp-link .product-tile__name') || productTile.querySelector('.product-tile__name');
    if (nameEl && nameEl.textContent.trim()) {
      titleEl = document.createElement('strong');
      titleEl.textContent = nameEl.textContent.trim();
    }
    // Price: Try color-price.active first, else .product-tile__mobile-meta
    let priceEl = null;
    const colorPriceActive = productTile.querySelector('.color-price.active .value');
    if (colorPriceActive) {
      priceEl = document.createElement('span');
      priceEl.textContent = colorPriceActive.textContent.trim();
    } else {
      // Look for sales price with strike-through
      const salePrice = productTile.querySelector('.color-price.active .sales.text-sales-price .value');
      const strikePrice = productTile.querySelector('.color-price.active del');
      if (salePrice && strikePrice) {
        priceEl = document.createElement('span');
        priceEl.innerHTML = strikePrice.outerHTML + ' ' + salePrice.textContent.trim();
      }
    }
    if (!priceEl) {
      // Fallback mobile price
      const mobilePrice = slide.querySelector('.product-tile__mobile-meta .value');
      if (mobilePrice) {
        priceEl = document.createElement('span');
        priceEl.textContent = mobilePrice.textContent.trim();
      }
    }
    // Swatches (color dots)
    let swatchUl = productTile.querySelector('.product-tile__pagination');
    // Description: Only use a simple structure since source doesn't have long text
    // Compose right cell: swatchUl, titleEl, priceEl
    const rightCell = [];
    if (swatchUl) rightCell.push(swatchUl);
    if (titleEl) rightCell.push(titleEl);
    if (priceEl) rightCell.push(priceEl);
    cells.push([imgCell, rightCell]);
  });

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
