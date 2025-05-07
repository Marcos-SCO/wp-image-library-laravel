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

function scrollToHtmlElement(element, offset = 50, container = window) {
    const isHtmlDom = element instanceof HTMLElement;
    const targetElement = isHtmlDom ? element : document.querySelector(element);
    if (!targetElement) return;

    const scrollContainer = container instanceof HTMLElement
        ? container : window;

    const containerTop = scrollContainer === window ? 0 : scrollContainer.getBoundingClientRect().top;
    const elementTop = targetElement.getBoundingClientRect().top;
    const scrollOffset = elementTop - containerTop + scrollContainer.scrollTop - offset;

    scrollContainer.scrollTo({
        top: scrollOffset,
        behavior: 'smooth'
    });
}

export {
    getBaseUrl,
    updateURL,
    getLaravelCsrfToken,
    scrollToHtmlElement,
}