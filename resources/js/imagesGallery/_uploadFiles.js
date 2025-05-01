import { getLaravelCsrfToken } from "../helpers/_dom";

function displayFeedbackErrors(dataErrors) {

  const errorContainer = document.querySelector('[data-js="upload-error"]');

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

  console.log(errorContainer);

  console.error('Error sending files:', dataErrors);
}


function createLoadingCard() {
  const card = document.createElement('div');
  card.classList.add('gallery-card', 'loading-card');
  card.setAttribute('data-js', 'upload-loading-card');

  card.innerHTML = `
    <div class="gallery-item loading-thumbnail">
      
      <span>Uploading...</span>
    </div>
  `;

  return card;
}


export function uploadFiles(files) {

  let isLoading = false;
  if (isLoading) return;

  isLoading = true;

  const uploadForm = document.querySelector('[data-js="upload-form"]');
  const formData = new FormData(uploadForm);
  const galleryContainer = document.querySelector('[data-js="gallery-container"]');
  const errorContainer = document.querySelector('[data-js="upload-error"]');

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

      // Remove loading cards regardless of outcome
      loadingCards.forEach(card => card.remove());

      // Handle success case
      if (dataSuccess) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = data.view_itens;

        // Prepend new elements to the existing gallery container
        while (tempDiv.firstChild) {
          galleryContainer.insertBefore(tempDiv.firstChild, galleryContainer.firstChild);
        }

        initEventListeners();
      }

      if (dataErrors) {
        if (loadingCard.parentNode) {
          loadingCard.parentNode.removeChild(loadingCard);
        }
        displayFeedbackErrors(dataErrors);
      }

    })
    .catch(error => {
      console.error('Error uploading files:', error);

      if (errorContainer) {
        errorContainer.innerHTML = '<p>Error while trying to send files, try again.</p>';
      }

      if (loadingCard.parentNode) {
        loadingCard.parentNode.removeChild(loadingCard);
      }
    })
    .finally(() => {
      isLoading = false;
      uploadForm.reset();
    });
}
