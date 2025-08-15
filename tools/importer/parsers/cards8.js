/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct card tiles (product cards and marketing tiles)
  const wrapper = element.querySelector('.swiper-wrapper');
  if (!wrapper) return;
  const cardNodes = Array.from(wrapper.children).filter(el =>
    el.classList.contains('slider-product-tile')
  );

  // Helper: extract image element (reference only, never clone)
  function getCardImage(card) {
    // Marketing tile
    const marketingImg = card.querySelector('.marketing-tile img');
    if (marketingImg) return marketingImg;
    // Product card: get first visible image in product-tile__image-wrap or anywhere
    let img = card.querySelector('.product-tile__image-wrap img');
    if (!img) img = card.querySelector('img');
    return img || '';
  }

  // Helper: extract text for card (reference block of content, not just a string)
  function getCardText(card) {
    // Marketing tile: use .marketing-tile__content (contains all meaningful text and CTA)
    const marketing = card.querySelector('.marketing-tile');
    if (marketing) {
      let content = marketing.querySelector('.marketing-tile__content');
      if (content) return content;
      // fallback: entire marketing tile if content block not found
      return marketing;
    }
    // Product tile: find .product-tile__meta (contains title, price, swatches, etc.)
    let meta = card.querySelector('.product-tile__meta');
    if (meta) return meta;
    // fallback: get all content if meta block not found
    let content = card.querySelector('.product-tile__content');
    if (content) return content;
    // fallback: just card
    return card;
  }

  // Compose the table
  const headerRow = ['Cards (cards8)'];
  const rows = cardNodes.map(card => {
    const img = getCardImage(card);
    const txt = getCardText(card);
    return [img || '', txt || ''];
  });
  const tableArr = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableArr, document);
  element.replaceWith(block);
}
