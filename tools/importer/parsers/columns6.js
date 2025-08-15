/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified in the example
  const headerRow = ['Columns (columns6)'];

  // The left column (gallery of images)
  let leftColumnContent = [];
  const leftCol = element.querySelector('.page-pdp-2-col__left-column');
  if (leftCol) {
    // All product images (li.product-asset)
    const galleryList = leftCol.querySelector('ul.product-gallery');
    if (galleryList) {
      const galleryLis = Array.from(galleryList.querySelectorAll(':scope > li'));
      leftColumnContent = galleryLis;
    }
  }

  // The right column (product info, buy box, description, accordions, etc)
  let rightColumnContent = [];
  const rightCol = element.querySelector('.page-pdp-2-col__right-column');
  if (rightCol) {
    rightColumnContent.push(rightCol);
  }
  // Description
  const desc = element.querySelector('.pdp__content-description');
  if (desc) {
    rightColumnContent.push(desc);
  }
  // Accordions
  const accordions = element.querySelector('.accordion-group--wrapper');
  if (accordions) {
    rightColumnContent.push(accordions);
  }
  // Certifications
  const ser = element.querySelector('.pdp-ser-wrapper');
  if (ser) {
    rightColumnContent.push(ser);
  }
  // Special message
  const specialMsg = element.querySelector('.pdp-special-message-wrapper');
  if (specialMsg) {
    rightColumnContent.push(specialMsg);
  }

  // If both columns are empty, do nothing
  if (leftColumnContent.length === 0 && rightColumnContent.length === 0) return;

  // Construct the table: header, then single row with as many columns as are needed (here, 2)
  const cells = [
    headerRow,
    [leftColumnContent, rightColumnContent]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
