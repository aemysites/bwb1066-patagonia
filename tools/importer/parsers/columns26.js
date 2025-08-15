/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the main content area with columns
  const mainContent = element.querySelector('.page-pdp-2-col__main-content');
  if (!mainContent) return;

  // Left column: gallery
  const leftCol = mainContent.querySelector('.page-pdp-2-col__left-column');
  // Right column: details (intro, buy, etc)
  const rightCol = mainContent.querySelector('.page-pdp-2-col__right-column');

  // Defensive: if columns not found, fallback to original element
  if (!leftCol || !rightCol) return;

  // Reference the entire left and right columns for maximum resilience
  // (referencing the column wrappers - all content within)
  const leftContent = leftCol;
  const rightContent = rightCol;

  // Build the table as in the Columns (columns26) spec
  const cells = [
    ['Columns (columns26)'],
    [leftContent, rightContent],
  ];

  // Create the block table and replace the element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
