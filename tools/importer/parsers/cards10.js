/* global WebImporter */
export default function parse(element, { document }) {
  // Find the themed cards container
  const cardsContainer = element.querySelector('.container.pt-lg-5.themed.is-dark');
  if (!cardsContainer) return;
  const row = cardsContainer.querySelector('.row.pt-lg-5');
  if (!row) return;
  // Select all direct card columns
  const cardDivs = Array.from(row.querySelectorAll(':scope > div'));

  // Prepare the table rows
  const cells = [['Cards (cards10)']];

  cardDivs.forEach(cardDiv => {
    const img = cardDiv.querySelector('img');
    const p = cardDiv.querySelector('p');
    const link = cardDiv.querySelector('a');

    // Defensive: skip if no image or no paragraph
    if (!img || !p) return;

    // Build the text cell: paragraph plus optional link
    const textContent = [];
    if (p) textContent.push(p);
    if (link) textContent.push(link);

    cells.push([img, textContent]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
