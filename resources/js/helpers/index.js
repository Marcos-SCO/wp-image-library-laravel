import './_forms';
import './_classes';

function scrollToHtmlElement(element, offset = 50) {
  const isHtmlDom = element instanceof HTMLElement;

  const targetElement =
    isHtmlDom ? element : document.querySelector(element);

  if (!targetElement) return;

  const elementPosition =
    targetElement.getBoundingClientRect().top + window.scrollY;

  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

function debounce(func, wait) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function rtrim(str, ch) {
  let i = str.length - 1;

  while (ch === str.charAt(i) && i >= 0) i--

  return str.substring(0, i + 1);
}

// -----------------------------------------------