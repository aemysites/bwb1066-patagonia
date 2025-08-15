/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get clean image element from product-gallery li
  function getGalleryImg(asset) {
    const cardMedia = asset.querySelector('.card__media-wrapper');
    if (!cardMedia) return null;
    const picture = cardMedia.querySelector('picture');
    if (!picture) return null;
    let src = '';
    const source = picture.querySelector('source');
    if (source && source.srcset) {
      const srcsetArr = source.srcset.split(',').map(s => s.trim());
      if (srcsetArr.length) {
        src = srcsetArr[srcsetArr.length-1].split(' ')[0];
      }
    }
    if (!src) {
      const img = picture.querySelector('img');
      if (img && img.src) src = img.src;
    }
    if (!src) return null;
    const img = document.createElement('img');
    img.src = src;
    img.alt = picture.querySelector('img')?.alt || '';
    // Add image label/title if present
    const label = asset.querySelector('.asset-title');
    if (label) img.title = label.textContent.trim();
    return img;
  }
  // Helper: filter out template/hidden elements
  function isVisible(el) {
    if (!el) return false;
    if (el.tagName === 'TEMPLATE') return false;
    if (el.classList && el.classList.contains('d-none')) return false;
    return true;
  }
  // Compose left images (one per row)
  const leftCol = element.querySelector('.page-pdp-2-col__left-column');
  const gallery = leftCol?.querySelector('.product-gallery');
  const assets = gallery ? Array.from(gallery.querySelectorAll('li')).filter(getGalleryImg) : [];
  const images = assets.map(getGalleryImg);

  // Compose right content
  const rightCol = element.querySelector('.page-pdp-2-col__right-column');
  // Extract meaningful high-level content blocks in logical display order, removing extraneous (template, d-none) nodes
  const rightBlocks = [];
  // 1: Title/CTA/review/price block
  const introContent = rightCol?.querySelector('.pdp-intro__content');
  if (introContent && isVisible(introContent)) rightBlocks.push(introContent);
  // 2: Add to Bag block
  const buyContent = rightCol?.querySelector('.pdp-buy');
  if (buyContent && isVisible(buyContent)) rightBlocks.push(buyContent);
  // 3: Description block
  const description = element.querySelector('.pdp__content-description');
  if (description && isVisible(description)) rightBlocks.push(description);
  // 4: Accordion spec group
  const accordion = element.querySelector('.accordion-group--wrapper');
  if (accordion && isVisible(accordion)) rightBlocks.push(accordion);
  // 5: Certifications/badges
  const certWrapper = element.querySelector('.pdp-ser-wrapper');
  if (certWrapper && isVisible(certWrapper)) rightBlocks.push(certWrapper);

  // Pair: Each row after the header = [image, right content], as in the example
  const maxRows = Math.max(images.length, rightBlocks.length);
  const cells = [['Columns (columns1)']];
  for (let i = 0; i < maxRows; i++) {
    const left = images[i] || '';
    const right = rightBlocks[i] || '';
    cells.push([left, right]);
  }
  // Replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
