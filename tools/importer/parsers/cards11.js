/* global WebImporter */
export default function parse(element, { document }) {
  // Find the 'materials' tab-pane (the currently active card grid)
  const tabMaterials = element.querySelector('.tab-pane#materials');
  if (!tabMaterials) return;
  const swiper = tabMaterials.querySelector('.slider-cards__container .swiper');
  if (!swiper) return;
  const cards = swiper.querySelectorAll('.swiper-wrapper > .card');
  if (!cards.length) return;

  const headerRow = ['Cards (cards11)'];
  const rows = [];

  cards.forEach((card) => {
    // --------- IMAGE ---------
    // Prefer .card__background img (main card image), otherwise first img in card
    let img = card.querySelector('.card__background img');
    if (!img) {
      img = card.querySelector('img');
    }

    // --------- TEXT CONTENT ---------
    // Collect ALL text content in one cell, referencing existing elements
    const textContent = [];
    // Card Title
    const titleSpan = card.querySelector('.card__title span');
    if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textContent.push(strong);
    }
    // Card Description (p)
    const desc = card.querySelector('.card__description');
    if (desc) {
      textContent.push(desc);
    }
    // Card Tag/Program/Material
    const tagSpan = card.querySelector('.card__meta-tags span');
    if (tagSpan) {
      const div = document.createElement('div');
      div.textContent = tagSpan.textContent.trim();
      div.style.fontWeight = 'bold';
      textContent.push(div);
    }
    // Card Blurb (extra info)
    const backgroundBlurb = card.querySelector('.card__background-blurb');
    if (backgroundBlurb) {
      // Put the blurb into a <p> element for clarity
      const p = document.createElement('p');
      p.innerHTML = backgroundBlurb.innerHTML;
      textContent.push(p);
    }
    // CTA Button (Learn More)
    const ctaBtn = card.querySelector('.btn.card__meta-cta');
    if (ctaBtn) {
      const a = document.createElement('a');
      a.href = ctaBtn.getAttribute('href');
      a.textContent = ctaBtn.textContent.trim();
      textContent.push(a);
    }
    // If nothing found, include all .card__content children (as fallback to avoid missing text)
    if (textContent.length === 0) {
      const cardContent = card.querySelector('.card__content');
      if (cardContent) {
        Array.from(cardContent.childNodes).forEach((node) => {
          if (node.nodeType === 1 || node.nodeType === 3) {
            textContent.push(node);
          }
        });
      }
    }
    rows.push([
      img,
      textContent.length > 1 ? textContent : textContent[0]
    ]);
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
