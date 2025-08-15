/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match example exactly
  const headerRow = ['Cards (cards28)'];
  const rows = [headerRow];

  // Find all product cards (direct children)
  const cardNodes = Array.from(element.querySelectorAll(':scope > .slider-product-tile'));
  cardNodes.forEach(card => {
    // IMAGE: Pick the first <img> with non-empty alt and a .product-tile__image ancestor
    let imgEl = null;
    const imgContainers = card.querySelectorAll('.product-tile__image');
    for (const container of imgContainers) {
      const img = container.querySelector('img[alt]');
      if (img && img.getAttribute('alt') && img.getAttribute('alt').trim()) {
        imgEl = img;
        break;
      }
    }
    // Fallback: any <img> in the card
    if (!imgEl) {
      imgEl = card.querySelector('img');
    }

    // TEXT CELL: Compose all visible text (badges, name, price, swatches)
    const textCell = document.createElement('div');

    // 1. Badges (e.g. New, Exclusive)
    const badgeEls = Array.from(card.querySelectorAll('.badge:not(.d-none)'));
    badgeEls.forEach(badge => {
      const badgeText = badge.textContent.trim();
      if (badgeText) {
        const badgeSpan = document.createElement('span');
        badgeSpan.textContent = badgeText;
        badgeSpan.style.fontWeight = 'bold';
        textCell.appendChild(badgeSpan);
        textCell.appendChild(document.createElement('br'));
      }
    });

    // 2. Product name (strong)
    let nameEl = card.querySelector('.product-tile__name');
    if (nameEl) {
      // Reference the existing element if not already strong
      if (nameEl.tagName !== 'STRONG') {
        const strong = document.createElement('strong');
        strong.textContent = nameEl.textContent.trim();
        textCell.appendChild(strong);
      } else {
        textCell.appendChild(nameEl);
      }
      textCell.appendChild(document.createElement('br'));
    }

    // 3. Price (first .value[itemprop="price"])
    let priceEl = card.querySelector('.product-tile__price .value[itemprop="price"]');
    if (!priceEl) {
      // fallback for price inside .pdp-link
      priceEl = card.querySelector('.pdp-link .product-tile__price .value[itemprop="price"]');
    }
    if (priceEl) {
      // Reference existing element
      textCell.appendChild(priceEl);
      textCell.appendChild(document.createElement('br'));
    }

    // 4. Swatches (list of color names)
    const swatchBtns = Array.from(card.querySelectorAll('.product-tile__pagination .product-tile__bullet button[title]'));
    if (swatchBtns.length > 0) {
      const swatchNames = swatchBtns.map(b => b.title).filter(Boolean).join(', ');
      if (swatchNames) {
        const swatchSpan = document.createElement('span');
        swatchSpan.textContent = swatchNames;
        textCell.appendChild(swatchSpan);
        textCell.appendChild(document.createElement('br'));
      }
    }

    // Remove trailing <br>
    while (textCell.lastChild && textCell.lastChild.tagName === 'BR') {
      textCell.removeChild(textCell.lastChild);
    }

    // Only add row if there is at least image or text
    if (imgEl || textCell.childNodes.length) {
      rows.push([
        imgEl || '',
        textCell
      ]);
    }
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
