/* global WebImporter */
export default function parse(element, { document }) {
  // Table Header exactly as example
  const headerRow = ['Hero'];

  // Extract background image from yotpo-widget-instance data-yotpo-image-url
  let imgEl = null;
  const yotpoDiv = element.querySelector('.yotpo-widget-instance');
  if (yotpoDiv && yotpoDiv.dataset.yotpoImageUrl) {
    imgEl = document.createElement('img');
    imgEl.src = yotpoDiv.dataset.yotpoImageUrl;
    imgEl.alt = yotpoDiv.dataset.yotpoName || '';
  }

  // Collect all blocks of text content relevant for Hero
  // Use .content-asset for main message (paragraph)
  // Use .yotpo-title-text, .yotpo-body-text for heading/subhead if present
  // Use Write a Review button as CTA if present
  const contentEls = [];

  // Add main message
  element.querySelectorAll('.content-asset').forEach((el) => {
    contentEls.push(el);
  });
  // Add prominent heading/subheading if present
  const titleEl = element.querySelector('.yotpo-title-text');
  if (titleEl) contentEls.push(titleEl);
  const bodyEl = element.querySelector('.yotpo-body-text');
  if (bodyEl) contentEls.push(bodyEl);

  // Add Write a Review button (actual button from DOM)
  const writeReviewBtn = element.querySelector('.write-review-button');
  if (writeReviewBtn) contentEls.push(writeReviewBtn);
  // Add possible CTA from empty state
  const emptyStateBtn = element.querySelector('.yotpo-new-review-btn');
  if (emptyStateBtn) contentEls.push(emptyStateBtn);

  // Ensure there is always some content in the cell
  // If nothing found, fallback to the entire section
  if (contentEls.length === 0) {
    contentEls.push(element);
  }

  // Compose table, each row is an array, cells MUST match example structure
  const cells = [
    headerRow,                 // ['Hero']
    [imgEl ? imgEl : ''],      // background image (may be empty string)
    [contentEls]               // array of all hero block text/buttons
  ];

  // Create table and replace element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
