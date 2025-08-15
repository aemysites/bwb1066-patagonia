/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main 2-col content section
  const mainContent = element.querySelector('.page-pdp-2-col__main-content');
  if (!mainContent) return;
  const leftCol = mainContent.querySelector('.page-pdp-2-col__left-column');
  const rightCol = mainContent.querySelector('.page-pdp-2-col__right-column');
  if (!leftCol || !rightCol) return;

  // 1. Extract Product Gallery (left column)
  // We'll build a div with all product images and their captions
  const gallery = leftCol.querySelector('.product-gallery');
  let leftColDiv = document.createElement('div');
  if (gallery) {
    // Only images (skip videos)
    const images = Array.from(gallery.querySelectorAll('.product-asset__image'));
    images.forEach(imgItem => {
      // Get picture
      const pic = imgItem.querySelector('picture');
      if (pic) leftColDiv.appendChild(pic);
      // Get caption
      const meta = imgItem.querySelector('.asset-title');
      if (meta && meta.textContent.trim() !== '') {
        const cap = document.createElement('div');
        cap.textContent = meta.textContent.trim();
        leftColDiv.appendChild(cap);
      }
    });
  }
  // Fallback in case no gallery found
  if (!leftColDiv.hasChildNodes()) leftColDiv = '';

  // 2. Extract Right Column Content (title, price, options, description, features...)
  // We'll reference the entire rightCol for resilience
  // However, we'll also get product description (below rightCol) and append it to the bottom of rightCol
  const rightColDiv = document.createElement('div');
  rightColDiv.appendChild(rightCol);
  // Find product description (it comes after mainContent)
  const desc = element.querySelector('.pdp__content-description');
  if (desc) {
    rightColDiv.appendChild(desc);
  }

  // 3. Build the table rows
  // The Columns block table header must match exactly (per requirements)
  const headerRow = ['Columns (columns31)'];
  const contentRow = [leftColDiv, rightColDiv];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  element.replaceWith(block);
}
