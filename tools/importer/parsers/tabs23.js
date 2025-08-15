/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: always a single cell as in the example
  const headerRow = ['Tabs'];

  // Find the navigation wrapper containing the tabs
  const navWrapper = element.querySelector('.navigation-subnav-tabs__links-wrapper');
  let tabLabels = [];
  if (navWrapper) {
    const ul = navWrapper.querySelector('ul.nav');
    if (ul) {
      const navItems = ul.querySelectorAll('li.nav-item');
      navItems.forEach(li => {
        const a = li.querySelector('a.nav-link');
        if (a) {
          const h3 = a.querySelector('h3.h9');
          if (h3 && h3.textContent.trim()) {
            tabLabels.push(h3.textContent.trim());
          } else if (a.textContent.trim()) {
            tabLabels.push(a.textContent.trim());
          }
        }
      });
    }
  }

  // For tab navigation, we always want two columns: tab label, tab content (even if empty)
  // This matches the example structure precisely
  const rows = tabLabels.map(label => [label, '']);

  // The cells array: header row is a single cell, then each tab row is two cells
  const cells = [headerRow, ...rows];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
