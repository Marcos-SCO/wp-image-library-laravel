function customDebounce(func, wait) {
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

function formGetParamsQueryStringUpdate(form) {
  const isHtmlDom = form instanceof HTMLElement;

  const formElement =
    isHtmlDom ? form : document.querySelector(form);

  if (!formElement) return;

  const formData = new FormData(formElement);

  const params = [];

  // Date input names or attributes
  const inputNames = new Set([
    'search'
  ]);

  for (let [key, value] of formData.entries()) {

    if (value.trim() == '') continue;

    if (inputNames.has(key)) value = value.replace(/\//g, '-');

    params.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  }

  // Construct the query string
  const queryString = '?' + params.join('&');

  window.history.replaceState(null, null, queryString);
}


function removeEmptyInputNamesFromForm(form) {
  const isHtmlDom = form instanceof HTMLElement;

  const formElement =
    isHtmlDom ? form : document.querySelector(form);

  const inputs = formElement.querySelectorAll('input[name], select[name]');

  const removedNames = [];

  if (!inputs) return;

  inputs.forEach(input => {
    if (input.value.trim() === '') {

      removedNames.push({ element: input, name: input.name });

      input.removeAttribute('name');
    }
  });

  // Restore the names after form submission to maintain the form structure
  setTimeout(() => {
    removedNames.forEach(item => {
      item.element.setAttribute('name', item.name);
    });
  }, 0);
}

function resetForm(form) {
  const isHtmlDom = form instanceof HTMLElement;

  const formElement =
    isHtmlDom ? form : document.querySelector(form);

  if (!formElement) return;

  const formInputs = formElement.querySelectorAll('input');
  const formSelects = formElement.querySelectorAll('select');
  const formTextArea = formElement.querySelectorAll('textarea');

  if (formInputs) formInputs.forEach(input => input.value = '');
  if (formSelects) formSelects.forEach(select => select.selectedIndex = 0);
  if (formTextArea) formTextArea.forEach(textarea => textarea.value = 0);
}

function preventEmptyInputsFromSubmitForm(form) {

  const isHtmlDom = form instanceof HTMLElement;

  const formElement =
    isHtmlDom ? form : document.querySelector(form);

  formElement.addEventListener('submit', function (event) {

    removeEmptyInputNamesFromForm(formElement);

  });

}

export {
  removeEmptyInputNamesFromForm,
  preventEmptyInputsFromSubmitForm,
  resetForm,
  formGetParamsQueryStringUpdate,
}