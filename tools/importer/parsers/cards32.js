/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const rows = [['Cards (cards32)']];
  // Find card containers
  const wrapper = element.querySelector('.swiper-wrapper');
  if (!wrapper) return;
  const slides = Array.from(wrapper.children).filter(slide => slide.classList.contains('swiper-slide'));

  slides.forEach(slide => {
    let imageCell = null;
    let textCell = document.createElement('div');
    textCell.style.display = 'flex';
    textCell.style.flexDirection = 'column';
    let foundText = false;

    // 1. IMAGE: Look for a visible product image or marketing image
    // Search first for .product-tile__image-wrap, then for marketing-tile__image-container, else for any <img>
    let imgWrap = slide.querySelector('.product-tile__image-wrap');
    if (imgWrap) {
      let img = imgWrap.querySelector('img[src]:not([src*="1x1.png"]), picture');
      if (img) imageCell = img;
    } else {
      let mktImgWrap = slide.querySelector('.marketing-tile__image-container');
      if (mktImgWrap) {
        let img = mktImgWrap.querySelector('img[src]:not([src*="1x1.png"]), picture');
        if (img) imageCell = img;
      }
    }
    // Fallback to any visible <img> in slide (not spinner placeholder)
    if (!imageCell) {
      let img = slide.querySelector('img[src]:not([src*="1x1.png"]), picture');
      if (img) imageCell = img;
    }
    // Fallback to null if no image found

    // 2. TEXT: Product Cards
    let meta = slide.querySelector('.product-tile__meta') || slide.querySelector('.product-tile__meta-primary') || null;
    if (meta) {
      // Title
      let titleNode = meta.querySelector('.product-tile__name');
      if (titleNode && titleNode.textContent.trim()) {
        let strong = document.createElement('strong');
        strong.textContent = titleNode.textContent.trim();
        textCell.appendChild(strong);
        foundText = true;
      }
      // Price: sale price and original price
      let priceNode = meta.querySelector('.color-price.active .sales .value, .sales .value, .text-sales-price .value');
      if (priceNode && priceNode.textContent.trim()) {
        let priceSpan = document.createElement('span');
        priceSpan.textContent = priceNode.textContent.trim();
        textCell.appendChild(priceSpan);
        foundText = true;
      }
      let origPriceNode = meta.querySelector('.color-price.active .strike-through .value del, .strike-through .value del');
      if (origPriceNode && origPriceNode.textContent.trim()) {
        let origSpan = document.createElement('span');
        origSpan.textContent = origPriceNode.textContent.trim();
        origSpan.style.textDecoration = 'line-through';
        textCell.appendChild(origSpan);
        foundText = true;
      }
      // Colorways (combine all colorway spans)
      let colorways = meta.querySelectorAll('.product-tile__colorway');
      colorways.forEach(cw => {
        if (cw.textContent.trim()) {
          let span = document.createElement('span');
          span.textContent = cw.textContent.trim();
          textCell.appendChild(span);
          foundText = true;
        }
      });
    }
    // 3. TEXT: Marketing Tile Cards
    let marketingTile = slide.querySelector('.marketing-tile');
    if (marketingTile) {
      // Title or sale text may be in the image alt or in a visible h tag or strong tag
      let mktImg = marketingTile.querySelector('img');
      if (mktImg && mktImg.alt && mktImg.alt.trim() && mktImg.alt.trim().toLowerCase() !== 'null') {
        let strong = document.createElement('strong');
        strong.textContent = mktImg.alt.trim();
        textCell.appendChild(strong);
        foundText = true;
      }
      // Sale message in text node
      let saleMsg = marketingTile.textContent.trim();
      if (saleMsg) {
        let saleSpan = document.createElement('span');
        saleSpan.textContent = saleMsg;
        textCell.appendChild(saleSpan);
        foundText = true;
      }
      // CTA button
      let cta = marketingTile.querySelector('.marketing-tile__cta a');
      if (cta) {
        textCell.appendChild(cta);
        foundText = true;
      }
    }
    // 4. Fallback: Try to collect most meaningful text from slide if nothing above (not whitespace)
    if (!foundText) {
      let fallbackText = slide.textContent.trim();
      if (fallbackText) {
        let p = document.createElement('p');
        p.textContent = fallbackText;
        textCell.appendChild(p);
      }
    }
    // Add row if either cell has content
    if (imageCell || textCell.textContent.trim()) {
      rows.push([imageCell, textCell]);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
