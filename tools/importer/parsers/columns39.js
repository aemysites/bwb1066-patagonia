/* global WebImporter */
export default function parse(element, { document }) {
  // Block header
  const headerRow = ['Columns (columns39)'];

  // Find left and right columns
  const leftCol = element.querySelector('.page-pdp-2-col__left-column');
  const rightCol = element.querySelector('.page-pdp-2-col__right-column');

  // Compose table second row: reference the main left and right columns directly
  // This ensures we keep all gallery images, labels, and product details as structured HTML
  const row2 = [leftCol, rightCol];

  // Optionally add main description as a new row, spanning both columns
  const descriptionContainer = element.querySelector('.pdp__content-description');
  let rows = [headerRow, row2];
  if (descriptionContainer) {
    // Insert description in left cell, leave right cell empty for layout consistency
    rows.push([descriptionContainer, '']);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
