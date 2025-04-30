import Swal from 'sweetalert2';
import { debounce } from "lodash";
import { fetchPaginationData, updateDataPage } from "./_pagination";
import { getBaseUrl, getLaravelCsrfToken } from '../helpers/_dom';

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


const debounceDeleteGalleryItem = debounce((id, galleryItem) => {

  let isLoading = false;
  if (isLoading) return;

  isLoading = true;

  const baseUrl = getBaseUrl();

  const currentPage = document.querySelector('[data-current-page]')
    ?.getAttribute('data-current-page');

  const csrfToken = getLaravelCsrfToken();
  if (!csrfToken) console.error('No csrf token was provided...');

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

      if (!dataSuccess) {
        console.error(data);
        return;
      }

      // Remove the gallery item
      galleryItem.remove();

      removeImageFromAllPreviews(id);

      // const deleteModal = document.querySelector('[data-js="delete-modal"]');

      // Check if the gallery container is empty after deletion
      const galleryContainer = document.querySelector('[data-js="gallery-container"]');
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
    });

}, 300); // 300ms debounce delay

function deleteGalleryItem(id) {
  const galleryItem = document.querySelector(`[data-gallery-item="${id}"]`);
  if (!galleryItem) return;

  // Trigger the debounced delete function
  debounceDeleteGalleryItem(id, galleryItem);
}

export function handleGalleryDeleteItems() {
  const galleryMainContainer = document.querySelector('[data-js="gallery-main-container"]');
  if (!galleryMainContainer) return;

  galleryMainContainer.addEventListener('click', (e) => {
    const target = e.target;
    const targetAttribute = target?.getAttribute('data-js');
    const deleteBtn = targetAttribute === 'delete-btn';
    const dataId = target?.getAttribute('data-id');

    if (!deleteBtn) return;

    // Use SweetAlert to confirm deletion
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

      if (!result.isConfirmed) {
        return;
      }

      // Proceed with deletion
      deleteGalleryItem(dataId);

      // SweetAlert for success without confirm button
      Swal.fire({
        title: 'Deleted!',
        text: 'Your image was deleted.',
        icon: 'success',
        showConfirmButton: false, // No OK button
        timer: 1500 // Close after 1.5 seconds
      });

    });
  });
}