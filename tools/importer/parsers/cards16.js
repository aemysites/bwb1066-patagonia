/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match the example exactly
  const headerRow = ['Cards (cards16)'];
  const rows = [headerRow];

  // Helper: Extract the best representative image from a card
  function getCardImage(card) {
    // Try .card__background > img, fallback to any img in card
    let img = card.querySelector('.card__background img');
    if (!img) {
      img = card.querySelector('img');
    }
    return img || '';
  }

  // Helper: Extract all relevant text content, preserving structure
  function getCardText(card) {
    const parts = [];
    // 1. Try to get card__title
    const title = card.querySelector('.card__title');
    if (title && title.textContent.trim()) {
      // Use the *existing* element for proper semantics
      parts.push(title);
    }
    // 2. Description (may contain <br> etc)
    const desc = card.querySelector('.card__description');
    if (desc && desc.textContent.trim()) {
      parts.push(desc);
    }
    // 3. Meta tags (e.g. Program, Material, etc)
    const meta = card.querySelector('.card__meta-tags');
    if (meta && meta.textContent.trim()) {
      parts.push(meta);
    }
    // 4. card__background-blurb (additional text blurb)
    const blurb = card.querySelector('.card__background-blurb');
    if (blurb && blurb.textContent.trim()) {
      parts.push(blurb);
    }
    // 5. CTA (Learn More, etc.)
    const cta = card.querySelector('a.card__meta-cta, a.btn');
    if (cta && cta.textContent.trim()) {
      parts.push(cta);
    }
    // Fallback: If no parts found, grab any p/div with text inside card content area
    if (parts.length === 0) {
      // Look for paragraph or divs with text
      card.querySelectorAll('p, div').forEach(el => {
        if (el.textContent.trim()) {
          parts.push(el);
        }
      });
    }
    // Only return if we really have content
    if (parts.length === 1) {
      return parts[0];
    } else if (parts.length > 1) {
      return parts;
    } else {
      return '';
    }
  }

  // Each card is a direct child with class 'card'
  const cards = element.querySelectorAll(':scope > .card');
  cards.forEach(card => {
    const img = getCardImage(card);
    const textCell = getCardText(card);
    // Add only if at least one visual or text content exists
    if (img || textCell) {
      rows.push([img, textCell]);
    }
  });

  // Create the block table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
