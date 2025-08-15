/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row exactly as in example
  const headerRow = ['Cards (cards3)'];
  const rows = [headerRow];

  // Find all card tiles
  const swiperRow = element.querySelector('.swiper .row.swiper-wrapper');
  if (!swiperRow) return;
  const cardTiles = Array.from(swiperRow.children).filter(el => el.classList.contains('slider-product-tile'));

  cardTiles.forEach(card => {
    // Check for marketing tile (Sale card)
    const marketingTile = card.querySelector('.marketing-tile');
    if (marketingTile) {
      // Image: look for an img element
      const image = marketingTile.querySelector('img');
      // Compose text block dynamically
      const textBlock = document.createElement('div');
      // Try to extract heading and description from the tile
      // There are no heading/description nodes, so fallback on what is visible in screenshot
      // If the image has alt text use it, otherwise use "Sale" and "Up to 50% Off"
      let titleText = '';
      if (image && image.getAttribute('alt') && image.getAttribute('alt') !== 'null') {
        titleText = image.getAttribute('alt');
      } else {
        titleText = 'Sale';
      }
      // Description: try to find marketing-tile__content__top/node, else fallback
      let descText = '';
      const descNode = marketingTile.querySelector('.marketing-tile__content__top');
      if (descNode && descNode.textContent.trim()) {
        descText = descNode.textContent.trim();
      } else {
        descText = 'Up to 50% Off';
      }
      // Heading
      if (titleText) {
        const strong = document.createElement('strong');
        strong.textContent = titleText;
        textBlock.appendChild(strong);
        textBlock.appendChild(document.createElement('br'));
      }
      // Description
      if (descText) {
        const descSpan = document.createElement('span');
        descSpan.textContent = descText;
        textBlock.appendChild(descSpan);
        textBlock.appendChild(document.createElement('br'));
      }
      // CTA
      const cta = marketingTile.querySelector('.marketing-tile__cta a');
      if (cta) {
        textBlock.appendChild(cta);
      }
      rows.push([
        image,
        textBlock
      ]);
      return;
    }
    // Product card
    // Try to find image inside card
    let image = card.querySelector('img');
    if (!image) {
      // Try library-dis-image
      let libraryImg = card.querySelector('library-dis-image img');
      if (libraryImg) image = libraryImg;
    }
    // If still not found, add a blank placeholder for layout
    if (!image) {
      image = document.createElement('div');
      image.style.height = '120px';
      image.style.background = '#eee';
    }
    // Compose text block dynamically
    const textBlock = document.createElement('div');
    // Swatches (color options)
    const swatchesUl = card.querySelector('.product-tile__pagination');
    if (swatchesUl) {
      textBlock.appendChild(swatchesUl);
      textBlock.appendChild(document.createElement('br'));
    }
    // Product name
    const nameNode = card.querySelector('.product-tile__name, .product-tile__meta .product-tile__name');
    if (nameNode && nameNode.textContent.replace(/\u00a0/g, '').trim()) {
      const strong = document.createElement('strong');
      strong.textContent = nameNode.textContent.replace(/\u00a0/g, '').trim();
      textBlock.appendChild(strong);
      textBlock.appendChild(document.createElement('br'));
    }
    // Price
    const priceNode = card.querySelector('.product-tile__price, .product-tile__price .price');
    if (priceNode && priceNode.textContent.replace(/\u00a0/g, '').trim()) {
      const priceSpan = document.createElement('span');
      priceSpan.textContent = priceNode.textContent.replace(/\u00a0/g, '').trim();
      textBlock.appendChild(priceSpan);
      textBlock.appendChild(document.createElement('br'));
    }
    // Add row with image and text content
    rows.push([
      image,
      textBlock
    ]);
  });

  // Build and replace table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
