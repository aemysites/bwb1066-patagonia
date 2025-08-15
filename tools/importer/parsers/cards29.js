/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: For a card element, return [image, textCell]
  function parseCard(cardEl) {
    // Image: find the first img descendant
    const img = cardEl.querySelector('img');

    // Text: find the block of content containing product/card info
    // Prefer: .product-tile__meta, .marketing-tile__content, .marketing-tile__content-wrapper
    let textParent = cardEl.querySelector('.product-tile__meta') ||
                    cardEl.querySelector('.marketing-tile__content') ||
                    cardEl.querySelector('.marketing-tile__content-wrapper');
    // Fallback: main card element minus imagery and buttons
    if (!textParent) {
      textParent = cardEl;
    }

    // Remove irrelevant elements (swatches, wishlist, quickadd, compare, images, buttons) but reference, do not clone
    // We want to reference the element but exclude visually irrelevant children.
    // We'll temporarily hide them and restore after table creation.
    const removeSelectors = [
      '.product-tile__image-wrap',
      '.product-tile__image-container',
      '.product-tile__image',
      '.product-tile__cover',
      '.product-tile__mobile-meta',
      '.marketing-tile__image-wrap',
      '.marketing-tile__image-container',
      '.marketing-tile__image',
      '.swatches',
      '.color-swatches',
      '.product-tile__quickadd-container',
      '.product-tile__wishlist-container',
      '.product-tile__quickadd-container--mobile',
      '.compare',
      'button',
      'svg',
      '.viewed-badge',
      '.badge',
      '.tile-body-footer'
    ];
    const hiddenEls = [];
    removeSelectors.forEach(sel => {
      textParent.querySelectorAll(sel).forEach(el => {
        hiddenEls.push({ el, oldDisplay: el.style.display });
        el.style.display = 'none';
      });
    });
    // Remove empty tags
    Array.from(textParent.querySelectorAll('span, div, p')).forEach(el => {
      if (!el.textContent.trim()) {
        hiddenEls.push({el, oldDisplay: el.style.display});
        el.style.display = 'none';
      }
    });

    // Prepare text cell: reference the actual element for resilience
    const textCell = textParent;
    return [img, textCell];

    // Restore hidden elements (not strictly needed; DOMUtils.createTable doesn't mutate source)
    // hiddenEls.forEach(({el, oldDisplay}) => el.style.display = oldDisplay);
  }

  // Find all real product/marketing card slides (ignore skeleton/empty)
  const wrapper = element.querySelector('.row.swiper-wrapper');
  if (!wrapper) return;
  const cardEls = Array.from(wrapper.children)
    .filter(cardEl => !cardEl.querySelector('.product-tile.skeleton'));

  // Always use the exact header from example
  const cells = [['Cards (cards29)']];
  cardEls.forEach(cardEl => {
    const [img, textCell] = parseCard(cardEl);
    if (img || (textCell && textCell.textContent.trim())) {
      cells.push([img, textCell]);
    }
  });

  // Create and replace only if we have actual cards
  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
