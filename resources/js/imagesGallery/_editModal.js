import { debounce } from "lodash";
import { getBaseUrl, getLaravelCsrfToken } from "../helpers/_dom";
import { removeLoadingAnimationFor, triggerLoadingAnimationFor } from "./_loading";
import { fileToBase64 } from "../helpers/_files";
import { updateImgInFormdata } from "./_updateForm";

/* function fetchEditModalItem(id) {

  const baseUrl = getBaseUrl();

  const csrfToken = getLaravelCsrfToken();
  if (!csrfToken) console.error('No csrf token was provided...');

  const galleryMainContainer = document.querySelector('[data-js="gallery-main-container"].active');

  triggerLoadingAnimationFor(galleryMainContainer);

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

      const editModal =
        galleryMainContainer?.querySelector('[data-js="edit-modal"]');

      if (editModal) editModal.classList.add('active');

    })
    .catch(error => console.error('Error fetching edit data:', error))
    .finally(() => {
      removeLoadingAnimationFor(galleryMainContainer);
    })
} */

function getGalleryItemDomInfo(dataId) {
  const galleryMainContainer = document.querySelector('[data-js="gallery-main-container"].active');

  if (!galleryMainContainer) return;

  const galleryItem = galleryMainContainer.querySelector(`[data-gallery-item="${dataId}"] .image-wrapper img`);

  if (!galleryItem) return;

  const galleryItemInfoObj = {
    'id': galleryItem.getAttribute('data-img-item'),
    'file_path': galleryItem.getAttribute('data-img-path'),
    'img_url': galleryItem.getAttribute('data-img-url'),
    'alt_text': galleryItem.getAttribute('data-img-alt'),
    'description': galleryItem.getAttribute('data-img-description'),
  }

  return galleryItemInfoObj;
}

// Function to handle image file selection and preview
function handleImageFileSelect(event) {
  const galleryMainContainer = document.querySelector('[data-js="gallery-main-container"].active');

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

  // console.log(file, 'file');

  reader.readAsDataURL(file);
}

function setupImageClickHandler() {
  const galleryMainContainer = document.querySelector('[data-js="gallery-main-container"].active');

  // Select all images that are editable
  const updateForm =
    galleryMainContainer?.querySelector('[data-js="update-form"]');

  if (!updateForm) return;

  // updateForm?.reset();

  const editImage = updateForm.querySelector('[data-js="edit-image"]');
  if (!editImage) return;

  const fileInput =
    updateForm.querySelector('[data-js="file-input"]');

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

function openEditModalImgItemData(id) {

  const galleryMainContainer = document.querySelector('[data-js="gallery-main-container"].active');

  // console.log(data);
  const editModal = galleryMainContainer?.querySelector('[data-js="edit-modal"]');

  if (!editModal) return;

  editModal.classList.add('active');

  const data = getGalleryItemDomInfo(id);

  setEditModalValues(data);

  setupImageClickHandler();
}

const debouncedFetchEditModalItem = debounce((dataId) => {
  // console.log('Debounced fetch item files triggered:', dataId);
  openEditModalImgItemData(dataId);
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
