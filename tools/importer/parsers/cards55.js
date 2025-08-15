/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header, matching example exactly
  const cells = [['Cards (cards55)']];

  // 2. Find the row of slides (cards)
  const carousel = element.querySelector('.swiper-wrapper');
  if (!carousel) return;

  // 3. Each direct child of carousel is a card (product or marketing)
  const slides = Array.from(carousel.children).filter(child => child.classList.contains('slider-product-tile'));

  slides.forEach((slide) => {
    // ---- IMAGE CELL ----
    // Prefer first visible <img> inside the slide
    let img = slide.querySelector('img');
    if (!img) {
      // Fallback for marketing-tile image
      const mkImg = slide.querySelector('.marketing-tile__image img');
      if (mkImg) img = mkImg;
    }

    // ---- TEXT CELL ----
    // Use a <div> to contain all visible, relevant text content
    const textDiv = document.createElement('div');

    // Product card title
    const productName = slide.querySelector('.product-tile__name');
    if (productName) {
      const strong = document.createElement('strong');
      strong.textContent = productName.textContent.trim();
      textDiv.appendChild(strong);
      textDiv.appendChild(document.createElement('br'));
      // Product price (active color or first .product-tile__price)
      let priceElem = slide.querySelector('.color-price.active .price') || slide.querySelector('.product-tile__price .price') || slide.querySelector('.product-tile__mobile-meta .product-tile__price .price');
      if (priceElem && priceElem.textContent.trim()) {
        textDiv.appendChild(document.createTextNode(priceElem.textContent.replace(/\s+/g, ' ').trim()));
        textDiv.appendChild(document.createElement('br'));
      }
      // Colorway (if present)
      const colorwayElem = slide.querySelector('.product-tile__colorway');
      if (colorwayElem && colorwayElem.textContent.trim()) {
        textDiv.appendChild(document.createTextNode(colorwayElem.textContent.trim()));
        textDiv.appendChild(document.createElement('br'));
      }
      // Discount badge
      const percentBadge = slide.querySelector('.badge--percent-off');
      if (percentBadge && percentBadge.textContent.trim()) {
        textDiv.appendChild(document.createTextNode(percentBadge.textContent.replace(/\s+/g, ' ').trim()));
        textDiv.appendChild(document.createElement('br'));
      }
      // Best seller badge
      const bestBadge = slide.querySelector('.badge--best-seller');
      if (bestBadge && bestBadge.textContent.trim()) {
        textDiv.appendChild(document.createTextNode(bestBadge.textContent.replace(/\s+/g, ' ').trim()));
        textDiv.appendChild(document.createElement('br'));
      }
      // Swatches
      const swatches = slide.querySelector('.product-tile__pagination');
      if (swatches) {
        textDiv.appendChild(swatches);
        textDiv.appendChild(document.createElement('br'));
      }
      // CTA button (a.btn or button.btn or quick add)
      const cta = slide.querySelector('a.btn, button.btn, .tile-quickadd');
      if (cta) {
        textDiv.appendChild(cta);
        textDiv.appendChild(document.createElement('br'));
      }
    } else {
      // Marketing card (promo)
      // Get all visible text from .marketing-tile__content
      let marketingText = '';
      const marketingContent = slide.querySelector('.marketing-tile__content');
      if (marketingContent) {
        // Prefer direct text in .marketing-tile__content__bottom, etc.
        const bottom = marketingContent.querySelector('.marketing-tile__content__bottom');
        const top = marketingContent.querySelector('.marketing-tile__content__top');
        if (top && top.textContent.trim()) {
          marketingText += top.textContent.trim() + '\n';
        }
        if (bottom && bottom.textContent.trim()) {
          marketingText += bottom.textContent.trim() + '\n';
        }
        if (!marketingText.trim()) {
          marketingText = marketingContent.textContent.trim();
        }
      } else {
        marketingText = slide.textContent.trim();
      }
      if (marketingText) {
        textDiv.appendChild(document.createTextNode(marketingText.replace(/\s+/g,' ')));
        textDiv.appendChild(document.createElement('br'));
      }
      // CTA button in promo
      const cta = slide.querySelector('a.btn, button.btn, .marketing-tile__cta a');
      if (cta) {
        textDiv.appendChild(cta);
        textDiv.appendChild(document.createElement('br'));
      }
    }

    // Remove trailing <br>
    while (textDiv.lastChild && textDiv.lastChild.tagName === 'BR') {
      textDiv.removeChild(textDiv.lastChild);
    }

    // Fallback: If textDiv is still empty, use all visible text from slide
    if (!textDiv.textContent.trim()) {
      const allText = slide.textContent.trim();
      if (allText) {
        textDiv.appendChild(document.createTextNode(allText));
      }
    }

    // Only add row if we have at least image or text
    if (img || textDiv.textContent.trim()) {
      cells.push([img, textDiv]);
    }
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
