/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Columns (columns35)'];

  // Get the columns of content
  // The left column: gallery (images)
  const leftCol = element.querySelector('.page-pdp-2-col__left-column');
  // The right column: main detail, buy config, price, description, accordions
  const rightCol = element.querySelector('.page-pdp-2-col__right-column');

  // Compose first row: left and right columns, which matches the example layout
  const firstRow = [leftCol, rightCol];

  // The example has multiple rows, but for this HTML, the left and right columns are composite blocks,
  // each containing nested lists, images, headings, and interactive elements. All content is included.

  // Compose final cells structure for the block
  const cells = [headerRow, firstRow];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(table);
}
