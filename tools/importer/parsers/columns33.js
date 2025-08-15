/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content section for the columns block
  const mainSection = element.querySelector('.page-pdp-2-col__main-content');
  if (!mainSection) return;

  // Get left and right columns
  const leftCol = mainSection.querySelector('.page-pdp-2-col__left-column');
  const rightCol = mainSection.querySelector('.page-pdp-2-col__right-column');

  // Extract only the relevant content from left and right columns
  let leftContent = null;
  let rightContent = null;

  // For left column: use the product gallery if present
  if (leftCol) {
    const gallery = leftCol.querySelector('ul.product-gallery');
    leftContent = gallery ? gallery : leftCol;
  }

  // For right column: use the main info panel
  if (rightCol) {
    const info = rightCol.querySelector('.column-wrapper');
    rightContent = info ? info : rightCol;
  }

  // If missing for some reason, fall back to empty string for safety
  if (!leftContent) leftContent = document.createElement('div');
  if (!rightContent) rightContent = document.createElement('div');

  // Table header (MUST match exactly)
  const headerRow = ['Columns (columns33)'];
  // Content row: columns side by side
  const contentRow = [leftContent, rightContent];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the section with the table block
  mainSection.replaceWith(block);
}
