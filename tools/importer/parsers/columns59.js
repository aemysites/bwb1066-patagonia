/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the first 4 product images/cards from the gallery for the 2x2 grid
  function getGridCards() {
    const gallery = element.querySelector('.page-pdp-2-col__left-column .product-gallery');
    if (!gallery) return [document.createElement('div'), document.createElement('div'), document.createElement('div'), document.createElement('div')];
    const assetLis = Array.from(gallery.querySelectorAll(':scope > li.product-asset'));
    // Ensure at least 4 elements
    while (assetLis.length < 4) assetLis.push(document.createElement('div'));
    // Each cell is the card inside the li (or li itself if no card)
    return assetLis.slice(0, 4).map(li => li.querySelector('.card') || li);
  }

  // Get the right column content (the buy panel)
  function getRightPanel() {
    return element.querySelector('.page-pdp-2-col__right-column') || document.createElement('div');
  }

  const [cell00, cell01, cell10, cell11] = getGridCards();
  const rightPanel = getRightPanel();

  // Compose the table as:
  // [ header ]
  // [ card1 , card2 ]
  // [ card3 , rightPanel ]
  const headerRow = ['Columns (columns59)'];
  const row1 = [cell00, cell01];
  const row2 = [cell10, rightPanel];

  const cells = [
    headerRow,
    row1,
    row2,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
