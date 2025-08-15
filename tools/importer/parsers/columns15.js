/* global WebImporter */
export default function parse(element, { document }) {
  // Correct header: single cell, block name exactly as required
  const headerRow = ['Columns (columns15)'];

  // Extract left and right content
  let leftCell = element.querySelector('aside');
  let rightCell = element.querySelector('div.content__column-right');

  // Fallbacks if primary selectors fail
  if (!leftCell || !rightCell) {
    const children = element.querySelectorAll(':scope > *');
    leftCell = children[0] || document.createElement('div');
    rightCell = children[1] || document.createElement('div');
  }

  // Table rows: header is a single cell, content row has two cells
  const cells = [
    headerRow,            // Single cell header row
    [leftCell, rightCell] // Content row with two columns
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
