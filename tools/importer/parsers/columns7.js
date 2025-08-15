/* global WebImporter */
export default function parse(element, { document }) {
  // Helper function to get all top-level filter elements (direct children of top panel)
  function getTopPanelColumns(topPanel) {
    const columns = [];
    // Score filter (dropdown)
    const scoreFilter = topPanel.querySelector('.yotpo-score-filter');
    if (scoreFilter) columns.push(scoreFilter);
    // Media filter (button)
    const mediaFilter = topPanel.querySelector('.yotpo-media-filter');
    if (mediaFilter) columns.push(mediaFilter);
    return columns;
  }

  // Helper to get all custom questions filters (labels inside .yotpo-custom-questions-filter)
  function getCustomQuestionsColumns(inner) {
    const filters = Array.from(inner.querySelectorAll('.yotpo-custom-questions-filter'));
    return filters.map(q => q.querySelector('label')).filter(Boolean);
  }

  // Helper to get smart topics (the panel as a column)
  function getSmartTopicsColumn(inner) {
    const topicsPanel = inner.querySelector('.yotpo-smart-topics-panel');
    if (topicsPanel) return topicsPanel;
    return null;
  }

  // Helper to get the sort column
  function getSortColumn(inner) {
    const rightPanel = inner.querySelector('.yotpo-filters-right-panel');
    if (!rightPanel) return null;
    const sortLabel = rightPanel.querySelector('label');
    if (sortLabel) return sortLabel;
    return null;
  }

  // Find the main columns block structure
  const container = element.querySelector('.yotpo-filters-container');
  if (!container) return;
  const inner = container.querySelector('.yotpo-filters-container-inner');
  if (!inner) return;
  const topPanel = inner.querySelector('.yotpo-filters-top-panel');

  // Header row: exactly one column per spec
  const headerRow = ['Columns (columns7)'];

  // Content row: each filter/element as a column
  let columns = [];
  if (topPanel) {
    columns = columns.concat(getTopPanelColumns(topPanel));
  }
  columns = columns.concat(getCustomQuestionsColumns(inner));
  const topicsCol = getSmartTopicsColumn(inner);
  if (topicsCol) columns.push(topicsCol);
  const sortCol = getSortColumn(inner);
  if (sortCol) columns.push(sortCol);

  if (columns.length === 0) return;

  // Build the table: header row (single column), then a row with all columns
  const cells = [
    headerRow,
    columns
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
