import { initEventListeners } from ".";
import { getLaravelCsrfToken } from "../helpers/_dom";
import { swalErrorModal, swalYourNotAllowedModal } from "./_sweAlertTemplates";

function emptyFeedbackErrors(element) {
  const isHtmlDom = element instanceof HTMLElement;

  const errorContainer = isHtmlDom ? element : document.querySelector(element);

  if (!errorContainer) return;
  errorContainer.innerHTML = ``;
}

function displayFeedbackErrors(dataErrors) {
  const mainActiveContainer = document.querySelector('[data-js="gallery-main-container"].active');
  if (!mainActiveContainer) return;

  const errorContainer = mainActiveContainer.querySelector('[data-js="upload-error"]');

  if (!errorContainer) return;
  errorContainer.innerHTML = ``;

  let errorMessage = `<ul>`;
  for (const [field, messages] of Object.entries(dataErrors)) {
    messages.forEach(message => {
      errorMessage += `<li>${message}</li>`;
    });
  }
  errorMessage += `</ul>`;

  errorContainer.innerHTML = errorMessage;

  console.error('Error sending files:', dataErrors);
}


function createLoadingCard() {
  const card = document.createElement('div');
  card.classList.add('gallery-item', 'loading-card', 'loading');
  card.setAttribute('data-js', 'upload-loading-card');

  card.innerHTML = `
  <div class="image-wrapper">
      <div class="image-loader"></div>
      <span>Uploading...</span>
  </div>`;

  return card;
}


export function uploadFiles(files) {

  let isLoading = false;
  if (isLoading) return;

  isLoading = true;

  const mainActiveContainer = document.querySelector('[data-js="gallery-main-container"].active');
  if (!mainActiveContainer) return;

  const uploadForm =
    mainActiveContainer.querySelector('[data-js="upload-form"]');

  const formData = new FormData(uploadForm);

  const galleryContainer =
    mainActiveContainer.querySelector('[data-js="gallery-container"]');

  const errorContainer =
    mainActiveContainer.querySelector('[data-js="upload-error"]');

  if (!galleryContainer) console.error('No gallery container element...');

  // Add files to FormData
  Array.from(files).forEach(file => formData.append('images[]', file));

  const loadingCards = [];

  Array.from(files).forEach(() => {
    const loadingCard = createLoadingCard();
    loadingCards.push(loadingCard);
    galleryContainer.insertBefore(loadingCard, galleryContainer.firstChild);
  });

  const csrfToken = getLaravelCsrfToken();
  if (!csrfToken) console.error('No csrf token was provided...');

  emptyFeedbackErrors('[data-js="gallery-main-container"].active [data-js="upload-error"]');

  let responseMessage = 'Must authenticate';
  let isLoggedUser = false;

  fetch(uploadForm.action, {
    method: 'POST',
    body: formData,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-TOKEN': csrfToken
    }
  })
    .then(response => response.json())
    .then(data => {

      const dataSuccess = data?.success;
      const dataErrors = data?.errors;
      isLoggedUser = data?.isLoggedUser;

      responseMessage = data?.message;

      console.log(data);

      if (dataErrors) {
        displayFeedbackErrors(dataErrors);

        swalErrorModal(responseMessage, 'Unable to upload!');
        return;
      }

      if (!dataSuccess && isLoggedUser) {
        console.log('Error:', data);

        swalErrorModal(responseMessage, 'Unable to upload!');
        return;
      }

      if (!isLoggedUser) {
        swalYourNotAllowedModal(responseMessage);
        return;
      }

      // Handle success case
      if (dataSuccess) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = data.view_items;

        // Prepend new elements to the existing gallery container
        while (tempDiv.firstChild) {
          galleryContainer.insertBefore(tempDiv.firstChild, galleryContainer.firstChild);
        }

        initEventListeners();
      }

      // Remove gallery items from current page if number is greater than 12
      if (dataSuccess && isLoggedUser) {
        Array.from(files).forEach(() => {
          if (galleryContainer.children.length > 12) {

            galleryContainer.removeChild(galleryContainer.lastElementChild);
          }
        });
      }

    })
    .catch(error => {
      console.error('Error uploading files:', error);

      if (errorContainer) {
        errorContainer.innerHTML = '<p>Error while trying to send files, try again.</p>';
      }

      swalErrorModal('Error while trying to send files, try again', 'Unable to upload item!');

      return;
    })
    .finally(() => {
      isLoading = false;

      // Remove loading cards regardless of outcome
      loadingCards.forEach(card => card.remove());

      uploadForm.reset();

    });
}
