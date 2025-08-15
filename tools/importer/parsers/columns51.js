/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as required
  const headerRow = ['Columns (columns51)'];

  // --- LEFT COLUMN: Only the first two visible pack/model images ---
  let leftCellContent = [];
  const mainContent = element.querySelector('.page-pdp-2-col__main-content');
  if (mainContent) {
    const leftCol = mainContent.querySelector('.page-pdp-2-col__left-column');
    if (leftCol) {
      const gallery = leftCol.querySelector('ul.product-gallery');
      if (gallery) {
        // We want only the first two visible images: the packshot and the model photo
        // On the site, these are the first li:not(.hide):not(.js-alt-asset) for primary image, and the first li.js-alt-asset for model
        // Select first 'packshot'
        const mainImgLi = gallery.querySelector('li.product-asset.product-asset__image.js-asset.selected-color:not(.hide)');
        // Select first alt asset for the model
        const modelImgLi = gallery.querySelector('li.product-asset.product-asset__image.js-alt-asset');
        if (mainImgLi) leftCellContent.push(mainImgLi);
        if (modelImgLi) leftCellContent.push(modelImgLi);
      }
    }
  }

  // --- RIGHT COLUMN: Only main product info box (title, price, reviews, color/size, buy button), and short description, style number, and accordions ---
  let rightCellContent = [];
  if (mainContent) {
    // 1. Main product info column
    const rightCol = mainContent.querySelector('.page-pdp-2-col__right-column');
    if (rightCol) {
      const columnWrapper = rightCol.querySelector('.column-wrapper');
      if (columnWrapper) rightCellContent.push(columnWrapper);
    }
    // 2. Short description
    const description = element.querySelector('.pdp__content-description');
    if (description) rightCellContent.push(description);
    // 3. Style number block
    const styleNo = element.querySelector('.buy-config__title');
    if (styleNo) rightCellContent.push(styleNo);
    // 4. Accordions (Fit, Specs, Materials)
    const accordions = element.querySelector('.accordion-group--wrapper');
    if (accordions) rightCellContent.push(accordions);
    // 5. Certifications (if present visually in the right column)
    const certs = element.querySelector('.pdp-ser-wrapper');
    if (certs) rightCellContent.push(certs);
  }

  const cells = [
    headerRow,
    [leftCellContent, rightCellContent]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
