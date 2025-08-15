/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row must match the example exactly
  const cells = [['Cards (cards38)']];

  // Find all cards/slides in the swiper-wrapper
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;
  const slides = Array.from(swiperWrapper.querySelectorAll(':scope > .slider-product-tile'));

  slides.forEach((slide) => {
    // --- IMAGE CELL ---
    let imageElem = '';
    // Find first usable image (not placeholder)
    let img = slide.querySelector('img[src]:not([src*="1x1.png"]):not([src=""]), library-dis-image img, .marketing-tile__image img');
    if (img) {
      const pic = img.closest('picture');
      imageElem = pic || img;
    }

    // --- TEXT CELL ---
    let textContent = [];
    // Title: look for name/title inside card
    let titleEl = slide.querySelector('.product-tile__name p, .product-tile__name span, .product-tile__name, .marketing-tile__tile-link, .marketing-tile__cta span');
    let title = '';
    if (titleEl && titleEl.textContent.trim() && titleEl.textContent.trim() !== '\u00a0') {
      title = titleEl.textContent.trim();
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title;
        textContent.push(strong);
      }
    }

    // Description: find price, colorway, and any paragraph/description
    let desc = [];
    // Colorway
    let colorwayEl = slide.querySelector('.product-tile__colorway');
    if (colorwayEl && colorwayEl.textContent.trim()) desc.push(colorwayEl.textContent.trim());
    // Prices
    let saleEl = slide.querySelector('.product-tile__price .sales .value, .product-tile__price .sales.text-sales-price .value');
    if (saleEl && saleEl.textContent.trim()) desc.push(saleEl.textContent.trim());
    let strikeEl = slide.querySelector('.product-tile__price .strike-through .value del');
    if (strikeEl && strikeEl.textContent.trim()) desc.push(strikeEl.textContent.trim());
    // Marketing/other promo description
    let promoEls = slide.querySelectorAll('.marketing-tile__content__top, .marketing-tile__content__bottom');
    promoEls.forEach((el) => {
      if (el.textContent.trim()) desc.push(el.textContent.trim());
    });
    // If not enough, fallback to visible paragraphs and spans in main content
    if (desc.length === 0) {
      let descEl = slide.querySelector('.product-tile__meta, .marketing-tile__content, .product-tile__inner');
      if (descEl && descEl.textContent.trim() && descEl.textContent.trim() !== '\u00a0') {
        desc.push(descEl.textContent.trim().replace(/\s+/g, ' '));
      }
    }
    if (desc.length > 0) {
      const p = document.createElement('p');
      p.textContent = desc.join(' ').replace(/  +/g, ' ');
      textContent.push(p);
    }

    // CTA: look for button or link (Shop, Quick Add, etc.)
    let ctaEl = slide.querySelector('.marketing-tile__cta a, .btn.btn-sm.btn-light, .tile-quickadd, .mobile-tile-quickadd-btn');
    if (ctaEl && ctaEl.textContent.trim()) {
      textContent.push(ctaEl);
    }

    // If no text extracted, fallback to all visible text in slide
    if (textContent.length === 0) {
      let fallbackText = slide.textContent.replace(/\s+/g, ' ').trim();
      if (fallbackText) {
        const p = document.createElement('p');
        p.textContent = fallbackText;
        textContent.push(p);
      }
    }

    // Reference elements directly (do not clone)
    cells.push([
      imageElem,
      textContent.length === 1 ? textContent[0] : textContent
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
