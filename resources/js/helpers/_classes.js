function removeClassFromSelectors(elementSelector, classElement) {
  const elementsSelector = document.querySelectorAll(elementSelector);
  if (!elementsSelector) return;

  Array.from(elementsSelector).forEach((element) =>
    element.classList.remove(classElement)
  );
}

function removeClassFromElement(element, classToAdd = '') {
  if (!element) return;
  const isHtmlDom = element instanceof HTMLElement;

  const elementItem = isHtmlDom ? element : document.querySelector(element);

  elementItem?.classList.remove(classToAdd);
}

function removeClassToElements(elements, classToAdd) {
  elements.forEach(element => {
    removeClassFromElement(element, classToAdd);
  });
}

function addClassToElement(element, classToAdd = '') {
  if (!element) return;

  const isHtmlDom = element instanceof HTMLElement;

  const elementItem = isHtmlDom ? element : document.querySelector(element);

  elementItem?.classList.add(classToAdd);
}

function addClassToElements(elements, classToAdd) {
  elements.map(element => {
    addClassToElement(element, classToAdd);
  });
}

function toggleClassToElement(element, classToAdd = '') {
  if (!element) return;

  const isHtmlDom = element instanceof HTMLElement;

  const elementItem = isHtmlDom ? element : document.querySelector(element);

  elementItem?.classList.toggle(classToAdd);
}

function toggleClassToElements(elements, classToAdd) {
  elements.map(element => {
    toggleClassToElement(element, classToAdd);
  });
}

export {
  removeClassFromSelectors,
  removeClassFromElement,
  removeClassToElements,
  addClassToElement,
  addClassToElements,
  toggleClassToElement,
  toggleClassToElements,
}