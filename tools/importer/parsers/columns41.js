/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Columns (columns41)'];

  // --- LEFT COLUMN: Product gallery (images/videos) ---
  let leftCol = '';
  const leftColDiv = element.querySelector('.page-pdp-2-col__left-column');
  if (leftColDiv) {
    const gallery = leftColDiv.querySelector('.js-product-gallery');
    if (gallery) leftCol = gallery;
  }

  // --- RIGHT COLUMN: All product info, title, price, CTA, description, etc. ---
  let rightCol = [];
  const rightColDiv = element.querySelector('.page-pdp-2-col__right-column');
  if (rightColDiv) {
    // Product intro
    const intro = rightColDiv.querySelector('.pdp-intro');
    if (intro) rightCol.push(intro);
    // Buy config (sizes/colors/add to bag)
    const buyConfig = rightColDiv.querySelector('.pdp-buy');
    if (buyConfig) rightCol.push(buyConfig);
    // Style/sku info
    const styleNo = rightColDiv.querySelector('.buy-config__title');
    if (styleNo) rightCol.push(styleNo);
    // Description
    const desc = element.querySelector('.pdp__content-description');
    if (desc) rightCol.push(desc);
    // Accordions (fit, specs, materials)
    const accordion = element.querySelector('.accordion-group--wrapper');
    if (accordion) rightCol.push(accordion);
    // Certifications
    const certs = element.querySelector('.pdp-ser-wrapper');
    if (certs) rightCol.push(certs);
    // Special message (if present)
    const specialMsg = rightColDiv.querySelector('.special-message');
    if (specialMsg) rightCol.push(specialMsg);
  }

  // Compose second row: 2 columns as per example
  const row2 = [leftCol, rightCol];

  // Build table
  const cells = [headerRow, row2];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
