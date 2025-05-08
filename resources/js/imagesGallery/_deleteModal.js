import Swal from 'sweetalert2';
import { debounce } from "lodash";
import { fetchPaginationData, updateDataPage } from "./_pagination";
import { getBaseUrl, getLaravelCsrfToken } from '../helpers/_dom';
import { removeLoadingAnimationFor, triggerLoadingAnimationFor } from './_loading';
import { swalYourNotAllowedModal } from './_sweAlertTemplates';
import { closeLastActiveLightBoxModal } from './_closeModals';

function removeImageFromAllPreviews(imageId) {
  const previews = document.querySelectorAll('.preview-image');

  if (!previews) return;

  previews.forEach(preview => {
    if (preview?.getAttribute('data-img-id') === imageId) {
      preview.remove();
    }
  });

  // Find all containers that have the selected images input
  const containers =
    document.querySelectorAll('[data-images-modal-trigger]');

  if (!containers) return;

  containers.forEach(container => {
    const selectedImagesInput = container.querySelector('[name="selected_images[]"]');
    if (!selectedImagesInput) return;

    // Parse the input value as JSON
    let selectedImages = JSON.parse(selectedImagesInput.value || '[]');

    // Filter out the image that has been deleted
    selectedImages = selectedImages.filter(img => img.id !== imageId);

    // Update the input value with the new filtered list
    selectedImagesInput.value = JSON.stringify(selectedImages);

    // Update the preview to reflect the changes
    updateImagePreview(container);
  });
}


const debounceDeleteGalleryItem = debounce((id, galleryItemsWithId) => {

  const galleryMainContainer = document.querySelector('[data-js="gallery-main-container"].active');

  if (!galleryMainContainer) console.error('No gallery main container found...');

  let isLoading = false;
  if (isLoading) return;

  isLoading = true;

  const baseUrl = getBaseUrl();

  const currentPage = document.querySelector('[data-current-page]')
    ?.getAttribute('data-current-page');

  const csrfToken = getLaravelCsrfToken();
  if (!csrfToken) console.error('No csrf token was provided...');

  triggerLoadingAnimationFor(galleryMainContainer);

  let responseMessage = 'Must authenticate';
  let isLoggedUser = false;

  fetch(`${baseUrl}/gallery/${id}`, {
    method: 'DELETE',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-TOKEN': csrfToken
    }
  })
    .then(response => response.json())
    .then(data => {
      const dataSuccess = data?.success;
      isLoggedUser = data?.isLoggedUser;
      responseMessage = data?.message;

      if (!dataSuccess) {
        console.log(data);
        return;
      }

      // Mark removed item for gallery items with id
      if (galleryItemsWithId) Array.from(galleryItemsWithId).forEach(galleryItem => galleryItem.classList.add('removed-item'));

      Swal.fire({
        title: 'Deleted!',
        text: 'Your image was deleted.',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
      });

      removeImageFromAllPreviews(id);

      // const deleteModal = document.querySelector('[data-js="delete-modal"]');

      const galleryContainer = galleryMainContainer.querySelector('[data-js="gallery-container"]');
      if (!galleryContainer) return;

      const itemsLeft = galleryContainer.children.length;
      const isPageOne = currentPage == 1;

      if (+itemsLeft > 0) return;

      if (itemsLeft == 0 && !isPageOne) {
        fetchPaginationData(`${baseUrl}/gallery?page=${+currentPage - 1}`);

        updateDataPage(+currentPage - 1);

        return;
      }

      fetchPaginationData(`${baseUrl}/gallery?page=${1}`);
      updateDataPage(1);
    })
    .catch(error => console.error('Error deleting image:', error))
    .finally(() => {
      isLoading = false;

      removeLoadingAnimationFor(galleryMainContainer);

      if (!isLoggedUser) swalYourNotAllowedModal(responseMessage);
    });

}, 300); // 300ms debounce delay

function deleteGalleryItem(id) {
  const galleryItemsWithId =
    document.querySelectorAll(`[data-gallery-item="${id}"]`);

  if (!galleryItemsWithId) return;

  // Trigger the debounced delete function
  debounceDeleteGalleryItem(id, galleryItemsWithId);
}

export function handleGalleryDeleteItems() {
  const galleryMainContainer = document.querySelector('[data-js="gallery-main-container"].active');
  if (!galleryMainContainer) return;

  // Remove previous listener if it exists
  if (galleryMainContainer._deleteClickHandler) {
    galleryMainContainer.removeEventListener('click', galleryMainContainer._deleteClickHandler);
  }

  // Define the new handler
  const deleteClickHandler = (e) => {
    const target = e.target;
    const targetAttribute = target?.getAttribute('data-js');
    const deleteBtn = targetAttribute === 'delete-btn';
    const dataId = target?.getAttribute('data-id');

    if (!deleteBtn) return;

    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this image?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: 'No, go back'
    }).then((result) => {
      if (!result.isConfirmed) return;

      deleteGalleryItem(dataId);
    });
  };

  // Store and bind the handler
  galleryMainContainer._deleteClickHandler = deleteClickHandler;
  galleryMainContainer.addEventListener('click', deleteClickHandler);
}