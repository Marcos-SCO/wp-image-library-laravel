import { debounce, replace } from "lodash";
import { formGetParamsQueryStringUpdate, removeEmptyInputNamesFromForm } from "../../helpers/_forms";

import { fetchPaginationData } from "../_pagination";

function sendGetFormRequest(form) {

  const isHtmlDom = form instanceof HTMLElement;

  const formContainer =
    isHtmlDom ? form : document.querySelector(form);

  if (!formContainer) return;

  removeEmptyInputNamesFromForm(formContainer);

  const pageInput = formContainer.querySelector('[data-current-page]');

  const searchInput =
    formContainer.querySelector('[data-js="search-input"]');

  if (pageInput) pageInput.value = 1;

  if (searchInput) {
    // let lowercaseValue = searchInput?.value?.toLowerCase();

    // Replace all spaces (and potentially other unwanted characters)
    // searchInput.value = lowercaseValue.replace(/\s+/g, '-');
    // formGetParamsQueryStringUpdate(formContainer);
  }

  const formData = new FormData(formContainer);
  const searchParams = new URLSearchParams(formData).toString();
  const formAction = formContainer?.action;
  const fullUrl = `${formAction}?${searchParams}`;

  fetchPaginationData(fullUrl, 'Searching images...');
}

function formInputsChange(form, defaultFormSelect = '[data-js="gallery-main-container"].active [data-js="main-search-inputs-form"]') {
  // function formInputsChange(form, defaultFormSelect = '[data-js="main-search-inputs-form"]') {

  const isHtmlDom = form instanceof HTMLElement;

  const formContainer =
    isHtmlDom ? form : document.querySelector(defaultFormSelect);

  if (!formContainer) return;

  const formElements = formContainer.querySelectorAll(`input, select`);

  /* const debounceChange = debounce((element) => {
    // isFormChanged = true;
    console.log(`${element.name} was changed`);
 
    sendGetFormRequest(`[data-js="main-search-inputs-form"]`);
 
  }, 300); */

  const debounceSubmitForm = debounce((formContainer) => {
    sendGetFormRequest(formContainer);
  }, 300);

  formElements.forEach(function (element) {

    element.addEventListener('change', function () {
      // console.log(element);
      // debounceChange(element);
    });
  });

  // Remove previous submit listener if it exists
  if (formContainer._submitHandler) {
    formContainer.removeEventListener('submit', formContainer._submitHandler);
  }

  const submitHandler = function (e) {
    e.preventDefault();
    debounceSubmitForm(formContainer);
  };

  formContainer._submitHandler = submitHandler;
  formContainer.addEventListener('submit', submitHandler);

}

export { formInputsChange }