/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const cells = [['Cards (cards2)']];

  // Find the container of cards
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  // Only process visible card slides
  const slides = swiperWrapper.querySelectorAll(':scope > .slider-product-tile, :scope > .marketing-tile');

  slides.forEach((slide) => {
    // 1. IMAGE: get the most relevant product image or tile image
    let imgEl = null;
    // Product: meta[itemprop=image] preferred, fallback to <img>
    const metaImg = slide.querySelector('meta[itemprop="image"]');
    if (metaImg && metaImg.content) {
      imgEl = document.createElement('img');
      imgEl.src = metaImg.content;
      const fallbackAlt = slide.querySelector('img');
      imgEl.alt = fallbackAlt && fallbackAlt.alt ? fallbackAlt.alt : '';
    } else {
      // For marketing tiles, fallback to first <img>
      const marketingImg = slide.querySelector('img');
      if (marketingImg && marketingImg.src) {
        imgEl = marketingImg;
      }
    }
    if (!imgEl) return;

    // 2. TEXT: include all content relevant to the card
    let textCell = null;
    // Product card: .product-tile__meta.tile-body contains all structured text (name, price, swatches, etc)
    const metaBody = slide.querySelector('.product-tile__meta.tile-body');
    if (metaBody && metaBody.textContent.trim()) {
      textCell = metaBody;
    } else {
      // Marketing tile: .marketing-tile__content contains all text and CTA
      const marketingContent = slide.querySelector('.marketing-tile__content');
      if (marketingContent && marketingContent.textContent.trim()) {
        textCell = marketingContent;
      } else {
        // Fallback: gather all <p>, <span>, <a>, <div> with visible text
        const textDiv = document.createElement('div');
        let found = false;
        slide.querySelectorAll('p,span,a,div').forEach((el) => {
          if (el.textContent && el.textContent.trim().length > 0) {
            textDiv.appendChild(el);
            found = true;
          }
        });
        if (found) textCell = textDiv;
      }
    }
    if (!textCell || !(textCell.textContent && textCell.textContent.trim().length > 0)) return;

    cells.push([imgEl, textCell]);
  });

  // Only replace if cards exist
  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
