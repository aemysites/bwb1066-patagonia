/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards37) block expects: [header], [image, text], ...
  // 1. Find the UL containing product cards
  const gallery = element.querySelector('.product-gallery');
  if (!gallery) return;
  // 2. Each LI is a card
  const cards = Array.from(gallery.querySelectorAll(':scope > li'));
  const rows = [['Cards (cards37)']];
  cards.forEach(card => {
    // --- IMAGE CELL ---
    // Use the <img> inside <picture> if present
    let image = card.querySelector('picture img');
    // --- TEXT CELL ---
    // Gather all text from .pdp-asset-meta (if any), in a semantically meaningful way
    let textCellFragments = [];
    const meta = card.querySelector('.pdp-asset-meta');
    if (meta) {
      // Title (strong)
      const title = meta.querySelector('.asset-title');
      if (title && title.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        textCellFragments.push(strong);
      }
      // Other labels (such as position)
      const others = Array.from(meta.querySelectorAll('.pdp-asset-label:not(.asset-title)'));
      others.forEach(label => {
        if (label.textContent.trim()) {
          // Use a div for other text below title
          const div = document.createElement('div');
          div.textContent = label.textContent.trim();
          textCellFragments.push(div);
        }
      });
    }
    // Fallback: If there is no title and the image has alt text, use that as title
    if (textCellFragments.length === 0 && image && image.alt && image.alt.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = image.alt.trim();
      textCellFragments.push(strong);
    }
    // Fallback: If still no text, check for any remaining direct text nodes (rare)
    if (textCellFragments.length === 0) {
      const textNodes = Array.from(card.childNodes).filter(n => n.nodeType === 3 && n.textContent.trim());
      textNodes.forEach(tn => {
        const div = document.createElement('div');
        div.textContent = tn.textContent.trim();
        textCellFragments.push(div);
      });
    }
    if (textCellFragments.length === 0) textCellFragments = [''];
    // Compose the row: always [image, text-content]
    rows.push([
      image || '',
      textCellFragments.length === 1 ? textCellFragments[0] : textCellFragments
    ]);
  });
  // Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
