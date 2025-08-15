/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row exactly as example
  const headerRow = ['Columns (columns46)'];

  // --- COLUMN 1: Product gallery ---
  let leftColContent = [];
  const leftCol = element.querySelector('.page-pdp-2-col__left-column');
  if (leftCol) {
    const gallery = leftCol.querySelector('ul.product-gallery');
    if (gallery) {
      // Include the entire gallery structure to preserve images + captions
      leftColContent.push(gallery);
    }
  }

  // --- COLUMN 2: All right panel content ---
  let rightColContent = [];
  const rightCol = element.querySelector('.page-pdp-2-col__right-column');
  if (rightCol) {
    // Include right column's content wrapper to ensure we get all headings, text, CTAs, and price
    rightColContent.push(...Array.from(rightCol.children));
  }

  // Check and add description block if present and not already in rightColContent
  const descriptionBlock = element.querySelector('.pdp__content-description');
  if (descriptionBlock && (!rightCol || !rightCol.contains(descriptionBlock))) {
    rightColContent.push(descriptionBlock);
  }

  // Check and add accordion wrapper if present and not already in rightColContent
  const accordionWrapper = element.querySelector('.accordion-group--wrapper');
  if (accordionWrapper && (!rightCol || !rightCol.contains(accordionWrapper))) {
    rightColContent.push(accordionWrapper);
  }

  // Compose the columns (one row with two columns)
  const contentRow = [leftColContent, rightColContent];

  // Build the block
  const cells = [
    headerRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
