/* global WebImporter */
export default function parse(element, { document }) {
  // Get all top-level columns
  const columnNodes = Array.from(element.querySelectorAll(':scope > ul > li.footer__sitemap__column'));
  if (!columnNodes.length) return;

  // Header row: single cell with block name
  const headerRow = ['Columns (columns47)'];

  // Second row: one cell per column, each referencing its main content
  const columnCells = columnNodes.map(col => {
    // For the newsletter signup column
    const emailCapture = col.querySelector('.email-capture-view');
    if (emailCapture) return emailCapture;
    // For help/info columns
    const contentAsset = col.querySelector('.content-asset');
    if (contentAsset) return contentAsset;
    // Fallback
    return col;
  });

  // Build the table
  const cells = [
    headerRow,
    columnCells
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
