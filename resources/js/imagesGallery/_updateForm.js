import { debounce } from "lodash";
import { formDataToJson } from '../helpers/_json';
import { fileToBase64 } from "../helpers/_files";
import { getBaseUrl, getLaravelCsrfToken } from "../helpers/_dom";
import { removeLoadingAnimationFor, triggerLoadingAnimationFor } from "./_loading";
import { swalYourNotAllowedModal } from "./_sweAlertTemplates";
import { closeLastActiveLightBoxModal } from "./_closeModals";
import Swal from "sweetalert2";

function updateGalleryItemDomInfo(dataId, galleryItemUpdatedObj) {
  const clickedGalleryITemImgs = document.querySelectorAll(`[data-gallery-item="${dataId}"] .image-wrapper img`);

  if (!clickedGalleryITemImgs) return;

  const baseUrl = getBaseUrl();

  const galleryItemInfoUpdateObj = function (galleryItem, galleryItemUpdatedObj) {

    const { file_path, img_url, alt_text, description } = galleryItemUpdatedObj;

    // galleryItem.src = baseUrl + '/storage/' + file_path;
    galleryItem.src = baseUrl + '/' + file_path;

    galleryItem.setAttribute('data-img-path', file_path ?? '');
    galleryItem.setAttribute('data-img-url', img_url ?? '');
    galleryItem.setAttribute('data-img-alt', alt_text ?? '');
    galleryItem.setAttribute('data-img-description', description ?? '');
  }

  clickedGalleryITemImgs.forEach(galleryItem => {
    galleryItemInfoUpdateObj(galleryItem, galleryItemUpdatedObj);
  });
}

function updatedRequest(id, jsonData) {
  const baseUrl = getBaseUrl();

  const csrfToken = getLaravelCsrfToken();
  if (!csrfToken) console.error('No csrf token was provided...');

  const activeEditModal = document.querySelector('[data-js="edit-modal"].active');

  if (!activeEditModal) return;

  const modalContent = activeEditModal?.querySelector('.modal-content');

  const submitButton =
    modalContent.querySelector('button[type="submit"]');

  submitButton.innerText = 'Updating...';

  triggerLoadingAnimationFor(modalContent, 'Updating...');

  let responseMessage = 'Must authenticate';
  let isLoggedUser = false;

  const updateRequest = `${baseUrl}/update/gallery/${id}`;
  // const updateRequest = `${baseUrl}/gallery/${id}`;

  fetch(updateRequest, {
    // method: 'PUT',
    method: 'POST',
    body: JSON.stringify(jsonData),
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-TOKEN': csrfToken,
    }
  })
    .then(response => response.json())
    .then(data => {

      isLoggedUser = data?.isLoggedUser;
      responseMessage = data?.message;

      if (!data.success && isLoggedUser) {
        console.log('Error:', data);

        swalErrorModal(responseMessage, 'Unable to update item!');
        return;
      }

      if (!isLoggedUser) {
        closeLastActiveLightBoxModal();
        swalYourNotAllowedModal(responseMessage);
        return;
      }

      const updatedImageData = data.updated_image;
      const imageElement = document.querySelector(`[data-gallery-item="${updatedImageData.id}"] .gallery-image`);

      if (imageElement) {
        // imageElement.src = baseUrl + '/storage/' + updatedImageData.file_path;
        imageElement.src = baseUrl + '/' + updatedImageData.file_path;
      }

      // console.log(data, 'updated');

      updateGalleryItemDomInfo(id, updatedImageData);

      activeEditModal.classList.remove('active');

      Swal.fire({
        title: 'Updated!',
        text: 'Your image was updated.',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
      });

    })
    .catch(error => {
      console.error('Error updating image:', error);

      const message = error?.message || 'An unexpected error occurred';

      swalErrorModal(message, 'Error updating image!')

    })
    .finally(() => {

      removeLoadingAnimationFor(modalContent);

      submitButton.innerText = 'save';
    });
}

async function updateImgInFormdata(updateForm, formData) {
  // Check if a new image file is selected
  const fileInput = updateForm?.querySelector('input[type="file"]');

  if (fileInput && fileInput?.files.length > 0) {
    const { base64, name, type } = await fileToBase64(fileInput.files[0]);

    formData.append('image', base64);
    formData.append('image_name', name);
    formData.append('image_type', type);
  }

  // console.log(formDataToJson(formData), 'form data in updateImgInFormdata');

  return formData;
}

const debouncedUpdateRequest = debounce((id, dataJson) => {
  // console.log('Debounced update fetch:', dataJson);
  updatedRequest(id, dataJson);
}, 300);

function handleUpdateFormSubmit() {
  const galleryMainContainer = document.querySelector('[data-js="gallery-main-container"].active');

  const updateForm = galleryMainContainer?.querySelector('[data-js="update-form"]');
  if (!updateForm) return;

  // Remove any previous submit handler
  if (updateForm._submitHandler) updateForm.removeEventListener('submit', updateForm._submitHandler);

  updateForm._submitHandler = async function (e) {
    e.preventDefault();

    const idInput =
      galleryMainContainer?.querySelector('[data-js="edit-image-id"]');

    const id = idInput?.value;

    if (!id) {
      console.error('Image ID is not set');
      return;
    }

    const formData = new FormData(updateForm);

    await updateImgInFormdata(updateForm, formData);

    const jsonData = formDataToJson(formData);

    // console.log(jsonData);

    debouncedUpdateRequest(id, jsonData);
  };

  updateForm.addEventListener('submit', updateForm._submitHandler);
}

export {
  handleUpdateFormSubmit,
  updateImgInFormdata
}