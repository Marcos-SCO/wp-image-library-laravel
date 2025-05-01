import { debounce } from "lodash";
import { getBaseUrl, getLaravelCsrfToken } from "../helpers/_dom";

// Function to handle image file selection and preview
function handleImageFileSelect(event) {
  const galleryMainContainer = document.querySelector('[data-js="gallery-main-container"].gallery-page');

  const fileInput = event.target;
  const file = fileInput.files[0];

  const isImageFile = file && file.type.startsWith('image/');

  // console.log(event);

  if (!isImageFile) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    // Find the image element in the modal and update its source
    const editImage =
      galleryMainContainer.querySelector('[data-js="edit-image"]');

    if (editImage) editImage.src = e.target.result; // Set the preview image source
  };

  reader.readAsDataURL(file);

}

function setupImageClickHandler() {
  const galleryMainContainer = document.querySelector('[data-js="gallery-main-container"].gallery-page');

  // Select all images that are editable
  const editForm =
    galleryMainContainer?.querySelector('[data-js="update-form"]');

  if (!editForm) return;

  editForm?.reset();

  const editImage = editForm.querySelector('[data-js="edit-image"]');
  if (!editImage) return;

  const fileInput =
    editForm.querySelector('[data-js="file-input"]');

  if (!fileInput) return;

  const fileInputListener = function (e) {
    handleImageFileSelect(e);
  };

  fileInput.removeEventListener('change', fileInputListener);
  fileInput.addEventListener('change', fileInputListener);

}

function setEditModalValues(data) {
  const galleryMainContainer = document.querySelector('[data-js="gallery-main-container"].active');

  const editForm =
    galleryMainContainer?.querySelector('[data-js="update-form"]');

  if (!editForm) return;

  editForm?.reset();

  const editImageId =
    editForm.querySelector('[data-js="edit-image-id"]');

  const editDescription =
    editForm.querySelector('[data-js="edit-description"]');

  const editAltText =
    editForm.querySelector('[data-js="edit-alt-text"]');

  const editImage = editForm.querySelector('[data-js="edit-image"]');

  editImage.src = '';

  // console.log(data);
  editImageId.value = data?.id;
  editDescription.value = data.description || '';
  editAltText.value = data.alt_text || '';
  editImage.src = data.file_path ? `/storage/${data.file_path}` : '';

}

function fetchEditModalItem(id) {

  const baseUrl = getBaseUrl();

  const csrfToken = getLaravelCsrfToken();
  if (!csrfToken) console.error('No csrf token was provided...');

  fetch(`${baseUrl}/gallery/${id}/show`, {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-TOKEN': csrfToken
    }
  })
    .then(response => response.json())
    .then(data => {

      // console.log(data);

      setupImageClickHandler();

      setEditModalValues(data);

      const galleryMainContainer = document.querySelector('[data-js="gallery-main-container"].active');

      const editModal =
        galleryMainContainer?.querySelector('[data-js="edit-modal"]');

      if (editModal) editModal.classList.add('active');

    })
    .catch(error => console.error('Error fetching edit data:', error));
}

const debouncedFetchEditModalItem = debounce((dataId) => {
  // console.log('Debounced fetch item files triggered:', dataId);
  fetchEditModalItem(dataId);
}, 300);

export function handleEditModal() {
  const galleryMainContainer = document.querySelector('[data-js="gallery-main-container"].active');

  if (!galleryMainContainer) return;

  // Remove previous listener if it exists
  if (galleryMainContainer._editClickHandler) {
    galleryMainContainer.removeEventListener('click', galleryMainContainer._editClickHandler);
  }

  // Define the new handler
  const editClickHandler = function (e) {
    const target = e.target;
    const targetAttribute = target?.getAttribute('data-js');
    const editBtn = targetAttribute === 'edit-btn';

    const dataId = target?.getAttribute('data-id');

    if (!editBtn) return;

    debouncedFetchEditModalItem(dataId);
  };

  // Store the handler and attach it
  galleryMainContainer._editClickHandler = editClickHandler;
  galleryMainContainer.addEventListener('click', editClickHandler);
}
