/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Columns (columns30)'];

  // Get left and right columns for the first row
  const leftCol = element.querySelector('.page-pdp-2-col__left-column');
  const rightCol = element.querySelector('.page-pdp-2-col__right-column');

  // Defensive: If either column is missing, fallback to empty string
  const col1 = leftCol || '';
  const col2 = rightCol || '';

  // First content row: gallery and info column
  const contentRow1 = [col1, col2];

  // Find product description block
  const desc = element.querySelector('.page-pdp__content-inner.pdp__content-description');
  // Defensive: fallback to empty string if not found
  const descBlock = desc || '';

  // Find the certification/footprint icons block
  const iconsBlock = element.querySelector('.pdp-ser-wrapper');
  // Defensive: fallback to empty string if not found
  const icons = iconsBlock || '';

  // Second row: left col empty, right col contains description and icons (as an array)
  const contentRow2 = ['', [descBlock, icons].filter(Boolean)];

  // Compose table
  const cells = [
    headerRow,
    contentRow1,
    contentRow2,
  ];

  // Create the table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}