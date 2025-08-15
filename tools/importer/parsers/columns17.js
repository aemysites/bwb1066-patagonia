/* global WebImporter */
export default function parse(element, { document }) {
  // The header row should be a single cell with the correct text
  const headerRow = ['Columns (columns17)'];

  // Get the columns (<li class="footer__sitemap__column">)
  let columns = [];
  const sitemap = element.querySelector('.footer__sitemap ul');
  if (sitemap) {
    columns = Array.from(sitemap.children).filter(li => li.classList.contains('footer__sitemap__column'));
  }
  // Fallback if not found
  if (columns.length === 0) {
    columns = Array.from(element.querySelectorAll('.footer__sitemap__column'));
  }

  // For each column, gather the main content (all element children except script/style)
  const contentRow = columns.map((col) => {
    const nodes = Array.from(col.childNodes).filter(node => {
      return node.nodeType === 1 && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE';
    });
    if (nodes.length === 1) {
      return nodes[0];
    } else if (nodes.length > 1) {
      return nodes;
    } else {
      // fallback: if empty, just use the col itself
      return col;
    }
  });

  // Compose the block table (header row is a single cell, then one row with columns for content)
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
