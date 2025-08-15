/* global WebImporter */
export default function parse(element, { document }) {
  // Correct header row, exactly as required
  const headerRow = ['Cards (cards45)'];

  // Find all direct card containers
  const slides = Array.from(element.querySelectorAll(':scope .swiper > .row > .slider-product-tile'));
  const cardRows = [];

  slides.forEach((slide) => {
    // Find the first image inside each card, or blank if none
    let img = slide.querySelector('img');

    // Compose a text cell by collecting all relevant visible text content
    // Prefer referencing existing block elements where possible
    const textCell = document.createElement('div');

    // 1. Try to grab product name/title
    let title =
      slide.querySelector('.product-tile__name, p.product-tile__name') ||
      slide.querySelector('.marketing-tile__content h1, .marketing-tile__content h2, .marketing-tile__content h3, .marketing-tile__content h4, .marketing-tile__content h5, .marketing-tile__content h6');
    if (title && title.textContent.trim()) {
      const titleEl = document.createElement('strong');
      titleEl.textContent = title.textContent.trim();
      textCell.appendChild(titleEl);
    }

    // 2. Grab main description blocks
    // Look for marketing content, product meta, and visible description paragraphs
    let descBlocks = [];
    descBlocks = descBlocks.concat(Array.from(slide.querySelectorAll('.marketing-tile__desc, .marketing-tile__content__bottom, .product-tile__mobile-meta, .product-tile__meta, .product-tile__meta-primary, .tile-body')));
    descBlocks.forEach(block => {
      // Filter duplicated title and empty blocks
      const blockText = block.textContent.trim();
      if (blockText && (!title || !blockText.includes(title.textContent.trim()))) {
        // Reference the block directly if it's not completely empty
        textCell.appendChild(block);
      }
    });

    // 3. Add all visible price elements
    let priceEls = Array.from(slide.querySelectorAll('.product-tile__price, .price'));
    priceEls.forEach(price => {
      const pTxt = price.textContent.replace(/\s{2,}/g, ' ').trim();
      if (pTxt && !textCell.textContent.includes(pTxt)) {
        textCell.appendChild(price);
      }
    });

    // 4. Add colorway/variant if present
    const colorway = slide.querySelector('.product-tile__colorway');
    if (colorway && colorway.textContent.trim() && !textCell.textContent.includes(colorway.textContent.trim())) {
      textCell.appendChild(colorway);
    }

    // 5. Add any links/buttons with a visible label as CTAs, avoiding duplicates
    let linkLabels = new Set();
    Array.from(slide.querySelectorAll('a,button')).forEach(el => {
      const label = (el.textContent || '').trim();
      if (label && !linkLabels.has(label) && !textCell.textContent.includes(label)) {
        linkLabels.add(label);
        // Reference the original element directly
        textCell.appendChild(el);
      }
    });

    // 6. Fallback: if textCell is empty, include all text from the slide
    if (!textCell.textContent.trim()) {
      const fallbackText = slide.textContent.replace(/\s+/g, ' ').trim();
      if (fallbackText) {
        textCell.textContent = fallbackText;
      }
    }

    // Compose [image, textCell] for block
    cardRows.push([img || '', textCell]);
  });

  // Build and replace with block table
  const cells = [headerRow, ...cardRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
