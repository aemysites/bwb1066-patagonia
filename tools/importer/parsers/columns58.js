/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Create a <figure> for the nth product-gallery image
  function getGalleryFigure(idx) {
    const gallery = element.querySelector('.product-gallery');
    if (!gallery) return '';
    const items = Array.from(gallery.querySelectorAll('li.product-asset'));
    const li = items[idx];
    if (!li) return '';
    const picture = li.querySelector('picture');
    if (!picture) return '';
    const figure = document.createElement('figure');
    figure.appendChild(picture.cloneNode(true));
    const captionSource = li.querySelector('.asset-title');
    if (captionSource) {
      const figcaption = document.createElement('figcaption');
      figcaption.textContent = captionSource.textContent.trim();
      figure.appendChild(figcaption);
    }
    return figure;
  }

  // Helper: Only the visible product description paragraph
  function getProductDescription() {
    let desc = element.querySelector('.pdp__content-copy p[itemprop="description"]');
    if (desc) return desc.cloneNode(true);
    desc = element.querySelector('.pdp__content-copy p');
    if (desc) return desc.cloneNode(true);
    return '';
  }

  // Compose the table strictly as per the markdown/example
  const headerRow = ['Columns (columns58)'];
  // Row 1: Only a figure for the first image (left), right cell is empty string exactly as in the example
  const row1 = [getGalleryFigure(0), ''];
  // Row 2: Only a figure for the second image (left), description (right)
  const row2 = [getGalleryFigure(1), getProductDescription()];

  const cells = [headerRow, row1, row2];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
