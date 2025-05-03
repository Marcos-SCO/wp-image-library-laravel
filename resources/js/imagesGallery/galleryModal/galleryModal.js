import Swal from "sweetalert2";
import { addClassToElement, removeClassFromSelectors } from "../../helpers/_classes";
import { handleGalleryDeleteItems } from "../_deleteModal";
import { dropDownImgUpload } from "../_dropDownImgUpload";
import { handleEditModal } from "../_editModal";
import { handlePagination } from "../_pagination";
import { handleUpdateFormSubmit } from "../_updateForm";
import { getBaseUrl } from "../../helpers/_dom";
import { formInputsChange } from "../form";
import { toggleActiveToMainGalleryArticle } from "../_closeModals";
import { initEventListeners } from "..";
import { removeLoadingAnimationFor, triggerLoadingAnimationFor } from "../_loading";

document.addEventListener('DOMContentLoaded', function () {

  const imagesGalleryModal = document.querySelector('[data-js="gallery-selector-modal"]');
  const modalContent = document.querySelector('[data-js="modal-gallery-content"]');

  if (!imagesGalleryModal || !modalContent) return;

  function updateModalSelectedImages() {

    const activeTriggerContainer = document.querySelector('[data-images-modal-trigger].active-trigger');
    if (!activeTriggerContainer) return;

    removeClassFromSelectors('[data-img-item]', 'selected');

    const selectedImagesInput = activeTriggerContainer
      .querySelector('[name="selected_images[]"]');

    let selectedImages = JSON.parse(selectedImagesInput?.value || '[]');

    selectedImages.forEach(imgItem => {
      const imgId = imgItem?.id;

      const imgElement =
        document.querySelector(`[data-img-item="${imgId}"]`);

      if (imgElement) imgElement.classList.add('selected');

    });
  }

  function requestModalItem() {
    const url = getBaseUrl() + '/gallery/modal/';

    triggerLoadingAnimationFor('body');

    fetch(url)
      .then(response => response.text())
      .then(html => {
        modalContent.innerHTML = html;

        imagesGalleryModal.classList.add('active');

        imagesGalleryModal.classList.add('loaded-gallery');

        imagesGalleryModal?.querySelector('[data-js="gallery-main-container"]')
          ?.classList.add('active');

        // Listen inputs inside active modal
        // formInputsChange(false, '.gallery-modal.active [data-js="main-search-inputs-form"]');

        // formInputsChange(false, '[data-js="main-search-inputs-form"]');

        initEventListeners();

        updateModalSelectedImages();
      })
      .catch(error => console.error('Error loading gallery:', error))
      .finally(() => {
        
        removeLoadingAnimationFor('body');
      });
  }

  function openModalGallery() {

    removeClassFromSelectors('.gallery-page.active', 'active');

    const imgGalleryWasLoaded = imagesGalleryModal
      ?.classList?.contains('loaded-gallery');

    if (!imgGalleryWasLoaded) {
      requestModalItem();

      return;
    }

    imagesGalleryModal.classList.add('active');

    imagesGalleryModal?.querySelector('[data-js="gallery-main-container"]')
      ?.classList.add('active');

    initEventListeners();

    updateModalSelectedImages();

  }

  function setupButtonTrigger() {
    document.body.addEventListener('click', function (e) {
      const targetElement = e.target;
      if (!targetElement) return;

      const isModalTrigger = targetElement.hasAttribute('data-modal-trigger');

      if (!isModalTrigger) return;

      removeClassFromSelectors('[data-images-modal-trigger]', 'active-trigger');

      targetElement.closest('.button-img-item')
        .classList.add('active-trigger');

      openModalGallery();

    });
  }


  function closeGalleryModal() {
    const closeModalButton = document.querySelector('[data-js="close-gallery-modal"]');

    if (!closeModalButton) return;

    closeModalButton.addEventListener('click', function () {
      imagesGalleryModal?.classList.remove('active');

      removeClassFromSelectors('[data-js="gallery-main-container"].active', 'active');

      removeClassFromSelectors('[data-img-item]', 'selected');
      removeClassFromSelectors('[data-images-modal-trigger]', 'active-trigger');

      toggleActiveToMainGalleryArticle();
    });

  }


  window.updateImagePreview = function updateImagePreview(container) {
    const selectedImagesInput =
      container.querySelector('[name="selected_images[]"]');

    const previewContainer = container.querySelector('.preview-container');
    if (!previewContainer) return;

    let selectedImages = JSON.parse(selectedImagesInput?.value || '[]');

    const imgPreview = container.querySelector('[data-img-preview]');

    const selectedQuantity = selectedImages?.length;

    if (selectedQuantity > 0) previewContainer.classList.add('active');
    else previewContainer.classList.remove('active');

    // Clear existing images
    imgPreview.innerHTML = '';

    selectedImages.forEach(image => {
      const imgWrapper = document.createElement('div');
      imgWrapper.classList.add('preview-image-wrapper');

      // Create image element
      const imgElement = document.createElement('img');
      imgElement.src = image.url;
      imgElement.alt = 'Preview';
      imgElement.title = 'Remove';
      imgElement.setAttribute('data-img-id', image.id);
      imgElement.classList.add('preview-image');

      imgWrapper.appendChild(imgElement);

      // Add close (X) button for removing image
      const closeButton = document.createElement('span');
      closeButton.classList.add('close-button');
      closeButton.innerHTML = '&times;';

      closeButton.addEventListener('click', () => {
        // Remove the image from selectedImages array
        selectedImages = selectedImages.filter(img => img.id !== image.id);
        selectedImagesInput.value = JSON.stringify(selectedImages);
        updateImagePreview(container); // Re-run the function to update the preview
      });

      imgWrapper.appendChild(closeButton);

      imgPreview.appendChild(imgWrapper);
    });
  }


  function removeImgFromPreview() {

    document.body.addEventListener('click', function (e) {
      const targetElement = e.target;

      const isPreviewImg = (targetElement && targetElement
        ?.classList?.contains('preview-image'));

      if (!isPreviewImg) return;

      const imgId = targetElement.getAttribute('data-img-id');

      const modalTrigger =
        targetElement?.closest('[data-images-modal-trigger]');

      const modalSelectedImgItem =
        document.querySelector(`[data-img-item="${imgId}"]`);

      if (modalSelectedImgItem) modalSelectedImgItem
        ?.classList.remove('selected');

      if (modalTrigger) deselectImage(imgId, modalTrigger);

      targetElement.remove();
    });
  }

  function selectImage(imgItemId, imageUrl, container) {
    const selectedImagesInput =
      container.querySelector('[name="selected_images[]"]');

    if (!selectedImagesInput) return;

    let selectedImages = JSON.parse(selectedImagesInput?.value || '[]');

    const alreadyHaveImage = selectedImages.some(img => img.id === imgItemId);
    if (alreadyHaveImage) return;

    selectedImages.push({ id: imgItemId, url: imageUrl });
    selectedImagesInput.value = JSON.stringify(selectedImages);

    updateImagePreview(container); // Update preview
  }

  function deselectImage(imgItemId, container) {
    const selectedImagesInput =
      container.querySelector('[name="selected_images[]"]');

    if (!selectedImagesInput) return;

    let selectedImages = JSON.parse(selectedImagesInput?.value || '[]');

    selectedImages = selectedImages.filter(img => img.id !== imgItemId);
    selectedImagesInput.value = JSON.stringify(selectedImages);

    updateImagePreview(container);
  }

  function selectModalImages() {
    modalContent.addEventListener('click', function (event) {
      const targetElement = event.target;
      const imgItemId = targetElement?.getAttribute('data-img-item');

      if (!imgItemId) return;

      const imageUrl = targetElement?.getAttribute('data-img-url');

      const activeTriggerContainer = document.querySelector('.active-trigger');
      if (!activeTriggerContainer) return;

      const selectLimitAttr = activeTriggerContainer.getAttribute('imgs-select-limit');
      const selectLimit = +selectLimitAttr;

      // console.log("Selection Limit:", selectLimit);

      // Retrieve current selected images from JSON input
      const selectedImagesInput = activeTriggerContainer.querySelector('[name="selected_images[]"]');
      let selectedImages = JSON.parse(selectedImagesInput?.value || '[]');

      const selectedCount = selectedImages.length;

      if (targetElement.classList.contains('selected')) {
        targetElement.classList.remove('selected');
        deselectImage(imgItemId, activeTriggerContainer);
        return;
      }

      if (selectedCount < selectLimit) {
        targetElement.classList.add('selected');
        selectImage(imgItemId, imageUrl, activeTriggerContainer);
        return;
      }

      const pluralSelect = selectLimit > 1 ? 's' : '';
      const selectMaxMessage = `The limit is ${selectLimit} image${pluralSelect}`;

      // SweetAlert for success without confirm button
      Swal.fire({
        title: `Can only choose ${selectLimit} image${pluralSelect}`,
        text: selectMaxMessage,
        icon: 'warning',
        // showConfirmButton: false, 
        // timer: 1500 
      }).then(() => {
        // console.log('close');
      });

    });
  }

  setupButtonTrigger();
  selectModalImages();
  closeGalleryModal();
  removeImgFromPreview();
});
