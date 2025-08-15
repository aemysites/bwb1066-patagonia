/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matching example exactly
  const cells = [['Cards (cards54)']];

  // Select each direct card/block
  const cardEls = Array.from(element.querySelectorAll(':scope > div'));

  cardEls.forEach(cardEl => {
    // Find the image (deep search inside this card block)
    let img = cardEl.querySelector('img');
    // If there's no image, skip this card
    if (!img) return;

    // Find the element containing all textual info (e.g., name & price, etc.)
    let meta = cardEl.querySelector('.product-tile__meta') || cardEl;

    // Reference the actual element from the document (not a clone) for the text cell
    // If .product-tile__meta exists, we put it as the text cell
    // If not, fallback to the entire cardEl
    const textCell = meta;

    // Add a row for this card
    cells.push([img, textCell]);
  });

  // Create and replace with the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
