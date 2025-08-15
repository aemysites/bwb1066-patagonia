/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to build one card per review block
  function extractCardsFromYotpo(element) {
    const widget = element.querySelector('#yotpo-reviews-container');
    if (!widget) return [];
    const reviews = Array.from(widget.querySelectorAll('.yotpo-review'));
    return reviews.map((review) => {
      const cardContent = [];
      // Reviewer name and verification
      const reviewerName = review.querySelector('.yotpo-reviewer-name');
      const verified = review.querySelector('.yotpo-reviewer-verified-buyer-text');
      if (reviewerName) {
        // Use a strong tag for semantic meaning
        const nameEl = document.createElement('strong');
        nameEl.textContent = reviewerName.textContent.trim();
        cardContent.push(nameEl);
        if (verified) {
          cardContent.push(document.createTextNode(' ' + verified.textContent.trim()));
        }
        cardContent.push(document.createElement('br'));
      }
      // Custom questions (labels + values)
      const customWrapper = review.querySelector('.yotpo-custom-questions-wrapper');
      if (customWrapper) {
        const labels = customWrapper.querySelectorAll('.yotpo-custom-questions-title');
        const values = customWrapper.querySelectorAll('.yotpo-custom-questions-value');
        for (let i = 0; i < Math.min(labels.length, values.length); i++) {
          const line = document.createElement('div');
          line.textContent = labels[i].textContent.trim() + ': ' + values[i].textContent.trim();
          cardContent.push(line);
        }
      }
      // Review title
      const heading = review.querySelector('.yotpo-review-title');
      if (heading) {
        const h3 = document.createElement('div');
        h3.style.fontWeight = 'bold';
        h3.textContent = heading.textContent.trim();
        cardContent.push(h3);
      }
      // Star rating (use text, not SVG)
      const stars = review.querySelector('.yotpo-review-star-rating');
      if (stars) {
        const starText = stars.getAttribute('aria-label') || stars.getAttribute('title');
        if (starText) {
          const starDiv = document.createElement('div');
          starDiv.textContent = starText.trim();
          cardContent.push(starDiv);
        }
      }
      // Review text
      const description = review.querySelector('.yotpo-read-more-text');
      if (description) {
        const descDiv = document.createElement('div');
        descDiv.textContent = description.textContent.trim();
        cardContent.push(descDiv);
      }
      // Fit slider label (e.g. Fit: True to Size)
      const fitBlock = review.querySelector('.yotpo-review-questions-mobile-panel');
      if (fitBlock) {
        const fitTitle = fitBlock.querySelector('.yotpo-custom-questions-range-question-title');
        const fitValue = fitBlock.querySelector('.yotpo-progress-bar-value-label');
        if (fitTitle && fitValue) {
          const fitDiv = document.createElement('div');
          fitDiv.textContent = fitTitle.textContent.trim() + ': ' + fitValue.textContent.trim();
          cardContent.push(fitDiv);
        }
      }
      // Published date
      const date = review.querySelector('.yotpo-date-format');
      if (date) {
        const dateDiv = document.createElement('div');
        dateDiv.textContent = date.textContent.trim();
        cardContent.push(dateDiv);
      }
      // Only return the card if it contains content
      if (!cardContent.length) return null;
      return [cardContent];
    }).filter(Boolean);
  }

  // Extract all cards
  const cards = extractCardsFromYotpo(element);
  if (!cards.length) return;
  // Structure: header row first, then one row per card
  const rows = [
    ['Cards'],
    ...cards
  ];
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
