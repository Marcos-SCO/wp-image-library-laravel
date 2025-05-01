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

export function uploadFiles(files) {

  let isLoading = false;
  if (isLoading) return;

  isLoading = true;

  const uploadForm = document.querySelector('[data-js="upload-form"]');
  const formData = new FormData(uploadForm);

  // Add files to FormData
  Array.from(files).forEach(file => formData.append('images[]', file));

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

      const galleryContainer = document.querySelector('[data-js="gallery-container"]');

      if (!galleryContainer) console.error('No Gallery container element...');

      // Handle success case
      if (dataSuccess) {

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = data.view_itens;

        // Prepend new elements to the existing gallery container
        while (tempDiv.firstChild) {
          galleryContainer.insertBefore(tempDiv.firstChild, galleryContainer.firstChild);
        }

        // Reinitialize event listeners
        initEventListeners();
      }

      // Handle error case (validation or upload failure)
      if (dataErrors) displayFeedbackErrors(dataErrors);

    })
    .catch(error => {
      console.error('Error uploading files:', error);

      // Display generic error message
      errorContainer.innerHTML = '<p>Error while trying to send files, try again.</p>';

    })
    .finally(() => {

      isLoading = false;

      // Reset the form after the upload is completed
      uploadForm.reset();
    });
}
