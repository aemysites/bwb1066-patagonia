/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified in the format
  const headerRow = ['Columns (columns44)'];

  // Defensive: get left and right columns
  const leftCol = element.querySelector('.page-pdp-2-col__left-column');
  const rightCol = element.querySelector('.page-pdp-2-col__right-column');

  // Defensive: If not found, use empty placeholders
  const leftCell = leftCol || document.createElement('div');
  const rightCell = rightCol || document.createElement('div');

  // First content row: 2 columns
  const row1 = [leftCell, rightCell];

  // There isn't a Section Metadata block in the example
  // The example does not include the long description as a full-width row,
  // so we do not add an extra row for it.
  // Only the left and right columns should be included as columns.

  const cells = [headerRow, row1];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
