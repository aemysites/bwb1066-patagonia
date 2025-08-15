/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main wrapper for all cards
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;
  const slides = Array.from(swiperWrapper.children).filter(c => c.matches('.swiper-slide'));
  const cells = [['Cards (cards36)']];

  slides.forEach(slide => {
    // Skip placeholder/skeleton cards
    if (slide.querySelector('.product-tile.skeleton')) return;

    // --- IMAGE ---
    // 1. Find first meaningful image (real src, not 1x1)
    let image = null;
    let imgCandidates = slide.querySelectorAll('img');
    for (const img of imgCandidates) {
      if (
        img.src &&
        !/1x1\.png/.test(img.src) &&
        (img.width > 40 || img.height > 40)
      ) {
        image = img;
        break;
      }
    }
    // Fallback: meta[itemprop=image]
    if (!image) {
      const metaImg = slide.querySelector('meta[itemprop="image"]');
      if (metaImg && metaImg.content) {
        const alt = slide.querySelector('img')?.alt || slide.querySelector('a[title]')?.getAttribute('title') || '';
        const img = document.createElement('img');
        img.src = metaImg.content;
        img.alt = alt;
        image = img;
      }
    }
    if (!image) return;

    // --- TEXT ---
    // 2. Find the text block (title, description, cta)
    let textCell = document.createElement('div');

    // Title: look for heading first (product name, marketing headline, strong tag)
    let titleNode =
      slide.querySelector('p.product-tile__name') ||
      slide.querySelector('.product-tile__name') ||
      slide.querySelector('.marketing-tile__content h1, .marketing-tile__content h2, .marketing-tile__content h3') ||
      slide.querySelector('.marketing-tile__content strong') ||
      slide.querySelector('h1, h2, h3, h4, h5, h6, strong, b');
    if (titleNode && titleNode.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleNode.textContent.trim();
      textCell.appendChild(strong);
    }

    // Description: collect visible text not in title or CTA
    let description = '';
    // Try product-tile__mobile-meta for product cards
    const mobileMeta = slide.querySelector('.product-tile__mobile-meta');
    if (mobileMeta && mobileMeta.textContent.trim()) {
      description += mobileMeta.textContent.trim() + '\n';
    }
    // Try product-tile__meta (often contains price, colors, etc)
    const metaBlock = slide.querySelector('.product-tile__meta');
    if (metaBlock) {
      // Remove duplicate product names from meta if already in title
      const copy = metaBlock.cloneNode(true);
      copy.querySelectorAll('p.product-tile__name, .product-tile__name').forEach(n => n.remove());
      description += copy.textContent.trim() + '\n';
    }
    // Try marketing-tile__content for marketing tiles
    const marketingContent = slide.querySelector('.marketing-tile__content');
    if (marketingContent) {
      // Exclude CTA
      const copy = marketingContent.cloneNode(true);
      copy.querySelectorAll('.marketing-tile__cta, .marketing-tile__tile-link').forEach(n => n.remove());
      // Remove headline/strong from description
      copy.querySelectorAll('h1, h2, h3, strong, b').forEach(n => n.remove());
      description += copy.textContent.trim() + '\n';
    }
    // Fallback: collect all <p> not used for title or inside CTA
    if (!description.trim()) {
      slide.querySelectorAll('p').forEach(p => {
        if (
          (!titleNode || p !== titleNode) &&
          !p.closest('.marketing-tile__cta, .tile-quickadd, .pdp-link') &&
          p.textContent.trim()
        ) {
          description += p.textContent.trim() + '\n';
        }
      });
    }
    // Add description paragraph if present
    if (description.trim()) {
      const descP = document.createElement('p');
      descP.textContent = description.trim();
      textCell.appendChild(descP);
    }
    // CTA: look for most prominent button/link
    let cta =
      slide.querySelector('.marketing-tile__cta a, .marketing-tile__cta button') ||
      slide.querySelector('.pdp-link a, a.btn, button.btn, .product-tile__quickadd-container button');
    if (cta && cta.textContent.trim()) {
      textCell.appendChild(cta);
    }
    // Ensure textCell is not empty. If it is, fallback to all visible text
    if (!textCell.hasChildNodes()) {
      const txt = slide.textContent.trim();
      if (txt) {
        const p = document.createElement('p');
        p.textContent = txt;
        textCell.appendChild(p);
      }
    }
    cells.push([image, textCell]);
  });
  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
