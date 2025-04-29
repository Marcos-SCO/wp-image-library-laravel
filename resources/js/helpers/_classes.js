function removeClassFromSelectors(elementSelector, classElement) {
  const elementsSelector = document.querySelectorAll(elementSelector);
  if (!elementsSelector) return;

  Array.from(elementsSelector).forEach((element) =>
    element.classList.remove(classElement)
  );
}

function removeClassFromElement(element, classToAdd = '') {
  if (!element) return;

  element.classList.remove(classToAdd);
}

function removeClassToElements(elements, classToAdd) {
  elements.forEach(element => {
    removeClassFromElement(element, classToAdd);
  });
}

function addClassToElement(element, classToAdd = '') {
  if (!element) return;

  element.classList.add(classToAdd);
}

function addClassToElements(elements, classToAdd) {
  elements.map(element => {
    addClassToElement(element, classToAdd);
  });
}

function toggleClassToElement(element, classToAdd = '') {
  if (!element) return;

  element.classList.toggle(classToAdd);
}

function toggleClassToElements(elements, classToAdd) {
  elements.map(element => {
    toggleClassToElement(element, classToAdd);
  });
}

module.exports = {
  removeClassFromSelectors,
  removeClassFromElement,
  removeClassToElements,
  addClassToElement,
  addClassToElements,
  toggleClassToElement,
  toggleClassToElements,
}