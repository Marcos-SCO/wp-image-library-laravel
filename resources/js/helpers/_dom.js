function getBaseUrl() {
    const baseUrl = document.querySelector('[data-base-url]')
        ?.getAttribute('data-base-url');

    return baseUrl;
}

// Function to update the URL in the browser's address bar
function updateURL(url) {
    history.pushState(null, '', url);
}

function getLaravelCsrfToken() {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');

    return csrfToken;
}

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

export {
    getBaseUrl,
    updateURL,
    getLaravelCsrfToken,
    scrollToHtmlElement,
}