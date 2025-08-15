/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row: matches example exactly
  const headerRow = ['Columns (columns42)'];

  // 2. Get all immediate .slider-product-tile elements (that are actual tiles)
  const productTiles = Array.from(element.querySelectorAll(':scope > .swiper > .row > .slider-product-tile'));

  // 3. Only include visible tiles (skip skeletons/loading)
  const columns = [];
  productTiles.forEach(tile => {
    // Skeleton tiles (placeholders) contain .product-tile.skeleton
    if (tile.querySelector('.product-tile.skeleton')) return;
    // Marketing tile (centered sale/ad block)
    const marketingTile = tile.querySelector('.marketing-tile');
    if (marketingTile) {
      columns.push(marketingTile);
      return;
    }
    // Actual product cards
    columns.push(tile);
  });

  // 4. Handle empty columns gracefully
  if (columns.length === 0) return;

  // 5. Compose table data: header, then columns as single row
  const tableData = [headerRow, columns];

  // 6. Create columns block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // 7. Replace the original element with the block table
  element.replaceWith(block);
}
