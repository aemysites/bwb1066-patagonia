/* global WebImporter */
export default function parse(element, { document }) {
  // Get the swiper-wrapper containing all the slides
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;
  // Get all visible product/marketing tiles
  const tileNodes = Array.from(swiperWrapper.children).filter(child => child.classList.contains('slider-product-tile'));
  if (!tileNodes.length) return;

  // Build the columns block header
  const headerRow = ['Columns (columns56)'];
  // Build columns row by referencing the main tile content for each tile
  const columnsRow = tileNodes.map(tile => {
    // Marketing tile (e.g. sale banner, not a product)
    const marketing = tile.querySelector('.marketing-tile');
    if (marketing) return marketing;
    // Product tile
    // The actual visible content for a product tile is the .lazyload-ajax element
    const lazyAjax = tile.querySelector('.lazyload-ajax');
    if (lazyAjax) return lazyAjax;
    // Fallback for skeleton/empty state
    const productTile = tile.querySelector('.product-tile');
    if (productTile) return productTile;
    // If nothing, just return the tile node (shouldn't happen for PLP)
    return tile;
  });

  // Build the table
  const cells = [headerRow, columnsRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
