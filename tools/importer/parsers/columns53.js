/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure main content exists
  const mainContent = element.querySelector('.page-pdp-2-col__main-content');
  if (!mainContent) return;
  // Find left and right column
  const leftCol = mainContent.querySelector('.page-pdp-2-col__left-column');
  const rightCol = mainContent.querySelector('.page-pdp-2-col__right-column');

  // Cells for columns block: [left, right]
  const headerRow = ['Columns (columns53)'];
  // If either column doesn't exist, fallback to empty div so table is valid
  const leftCell = leftCol || document.createElement('div');
  const rightCell = rightCol || document.createElement('div');
  const contentRow = [leftCell, rightCell];

  // Create and replace
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
