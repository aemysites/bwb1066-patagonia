/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match example exactly
  const headerRow = ['Columns (columns48)'];
  
  // Find page main content (the 2-col section)
  const mainContent = element.querySelector('.page-pdp-2-col__main-content');
  
  // LEFT COLUMN: Product gallery (images + visible captions as text)
  let leftCell = null;
  if (mainContent) {
    const leftCol = mainContent.querySelector('.page-pdp-2-col__left-column');
    if (leftCol) {
      const gallery = leftCol.querySelector('.js-product-gallery');
      if (gallery) {
        const galleryDiv = document.createElement('div');
        // Collect all li:not(.hide)
        const items = Array.from(gallery.querySelectorAll('li.product-asset:not(.hide)'));
        items.forEach(item => {
          // Add picture (images)
          const picture = item.querySelector('picture');
          if (picture) galleryDiv.appendChild(picture);
          // Add visible text from .pdp-asset-meta as <p> elements
          const meta = item.querySelector('.pdp-asset-meta');
          if (meta) {
            // Only take direct children that are visible and contain text
            Array.from(meta.children).forEach(c => {
              const text = c.textContent.trim();
              if (text) {
                const p = document.createElement('p');
                p.textContent = text;
                galleryDiv.appendChild(p);
              }
            });
          }
        });
        // Only if there's something there
        if (galleryDiv.childNodes.length > 0) {
          leftCell = galleryDiv;
        }
      }
    }
  }

  // RIGHT COLUMN: All relevant hero info, variant selectors, and all related text
  let rightCell = null;
  if (mainContent) {
    const rightCol = mainContent.querySelector('.page-pdp-2-col__right-column');
    if (rightCol) {
      const rightDiv = document.createElement('div');
      // Add all direct children (hero info, selectors, price, buttons)
      Array.from(rightCol.children).forEach(child => {
        // If the element is not empty, append it
        if ((child.innerHTML && child.innerHTML.trim()) || child.textContent.trim()) {
          rightDiv.appendChild(child);
        }
      });
      // Add the product description (if not already present)
      const desc = element.querySelector('.pdp__content-description');
      if (desc && !rightDiv.contains(desc)) {
        rightDiv.appendChild(desc);
      }
      // Add style number/code (if present and not already present)
      const styleBlock = element.querySelector('.buy-config__title');
      if (styleBlock && !rightDiv.contains(styleBlock)) {
        rightDiv.appendChild(styleBlock);
      }
      // Add all text from .accordion-group--wrapper (Fit, Specs, Materials) - product details
      const acc = element.querySelector('.accordion-group--wrapper');
      if (acc && !rightDiv.contains(acc)) {
        rightDiv.appendChild(acc);
      }
      // Add certifications/footprint badges (if present)
      const serCert = element.querySelector('.pdp-ser-wrapper');
      if (serCert && !rightDiv.contains(serCert)) {
        rightDiv.appendChild(serCert);
      }
      // Add any special message (if present)
      const specialMsg = element.querySelector('.pdp-special-message-wrapper');
      if (specialMsg && (!specialMsg.matches(':empty'))) {
        rightDiv.appendChild(specialMsg);
      }
      // Only set rightCell if there's content
      if (rightDiv.childNodes.length > 0) {
        rightCell = rightDiv;
      }
    }
  }

  // Compose columns block
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [leftCell, rightCell]
  ], document);

  element.replaceWith(table);
}
