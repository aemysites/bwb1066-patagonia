/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure we get the correct columns container
  const columnsContainer = element.querySelector('section.page-pdp-2-col__main-content');
  if (!columnsContainer) return;

  // Get the left and right columns
  const leftCol = columnsContainer.querySelector('.page-pdp-2-col__left-column');
  const rightCol = columnsContainer.querySelector('.page-pdp-2-col__right-column');
  if (!leftCol || !rightCol) return;

  // Left column: include all gallery images and all visible text under the gallery
  // Take all direct children of leftCol to ensure nothing is missed
  const leftColChildren = Array.from(leftCol.children).filter(child => {
    // Remove navigation controls (arrows, etc) -- not relevant to content
    return !(child.classList.contains('product-gallery-controls') || child.classList.contains('product-gallery-controls-js'));
  });
  // If leftColChildren is empty, fallback to leftCol itself
  const leftCell = leftColChildren.length > 0 ? leftColChildren : [leftCol];

  // Right column: include all content (text, buttons, price info, etc.)
  // Reference the rightCol element directly
  const rightCell = [rightCol];

  // Compose the block table
  const cells = [
    ['Columns (columns9)'],
    [leftCell, rightCell]
  ];

  // Create table and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
