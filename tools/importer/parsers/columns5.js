/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main PDP section containing columns
  const mainSection = element.querySelector('.page-pdp-2-col__main-content') || element;
  // Get left and right columns
  const leftColumn = mainSection.querySelector('.page-pdp-2-col__left-column');
  const rightColumn = mainSection.querySelector('.page-pdp-2-col__right-column');

  // Helper to get all product-gallery images (li items)
  let images = [];
  if (leftColumn) {
    const gallery = leftColumn.querySelector('ul.product-gallery');
    if (gallery) {
      images = Array.from(gallery.querySelectorAll('li'));
    }
  }

  // Product info block (includes title, pricing, ctas, etc.)
  let productInfoBlock = null;
  if (rightColumn) {
    productInfoBlock = rightColumn.querySelector('.column-wrapper') || rightColumn;
  }

  // Get description/content area. Prefer pdp__content-description inside mainSection.
  let descriptionBlock = mainSection.querySelector('.pdp__content-description') || mainSection.querySelector('.page-pdp__content-inner');

  // Fallback in case leftColumn/rightColumn not found: use whatever is present
  // Split images into two groups for top and bottom rows (following visual layout)
  let topImages = [];
  let bottomImages = [];
  if (images.length > 0) {
    // If 8 or more, split as 4 and rest; if 4, split as 2 and 2
    if (images.length >= 8) {
      topImages = images.slice(0, 4);
      bottomImages = images.slice(4);
    } else if (images.length > 4) {
      topImages = images.slice(0, Math.ceil(images.length / 2));
      bottomImages = images.slice(Math.ceil(images.length / 2));
    } else if (images.length === 4) {
      topImages = images.slice(0, 2);
      bottomImages = images.slice(2);
    } else {
      // If less than 4, all on top row, bottom row blank
      topImages = images;
      bottomImages = [];
    }
  }

  // Ensure we only include non-empty cells
  const leftTopCell = topImages.length ? topImages : '';
  const rightTopCell = productInfoBlock || '';
  const leftBottomCell = bottomImages.length ? bottomImages : '';
  const rightBottomCell = descriptionBlock || '';

  // Table header must match example: 'Columns (columns5)'
  const headerRow = ['Columns (columns5)'];
  const row1 = [leftTopCell, rightTopCell];
  const row2 = [leftBottomCell, rightBottomCell];
  const cells = [headerRow, row1, row2];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
