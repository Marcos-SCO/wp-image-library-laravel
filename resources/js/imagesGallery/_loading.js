function triggerLoadingAnimationFor(element, loadingTextMessage = 'Loading...') {
    if (!element) return;

    const isHtmlDom = element instanceof HTMLElement;

    const targetItem = isHtmlDom ? element : document.querySelector(element);

    targetItem?.classList.add('page-loading');

    if (targetItem.querySelector('[data-js="loader"]')) return;

    const loader = document.createElement('div');
    loader.setAttribute('data-js', 'loader');
    loader.className = 'loader';
    loader.innerHTML = '<span>' + loadingTextMessage + '</span>';

    targetItem?.appendChild(loader);
}

function removeLoadingAnimationFor(element) {
    if (!element) return;

    const isHtmlDom = element instanceof HTMLElement;

    const targetItem = isHtmlDom ? element : document.querySelector(element);

    targetItem?.classList.remove('page-loading');

    const loader = targetItem?.querySelector('[data-js="loader"]');
    if (loader) loader.remove();

}

export {
    triggerLoadingAnimationFor,
    removeLoadingAnimationFor,
}