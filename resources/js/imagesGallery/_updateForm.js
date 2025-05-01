import { debounce } from "lodash";
import { formDataToJson } from '../helpers/_json';
import { fileToBase64 } from "../helpers/_files";
import { getBaseUrl, getLaravelCsrfToken } from "../helpers/_dom";

function updatedRequest(id, jsonData) {
  const baseUrl = getBaseUrl();

  const csrfToken = getLaravelCsrfToken();
  if (!csrfToken) console.error('No csrf token was provided...');

  fetch(`${baseUrl}/gallery/${id}`, {
    method: 'PUT',
    body: JSON.stringify(jsonData),
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-TOKEN': csrfToken,
    }
  })
    .then(response => response.json())
    .then(data => {

      if (!data.success) {
        console.error('Error:', data.error);
        return;
      }

      const updatedImage = data.updated_image;
      const imageElement = document.querySelector(`[data-gallery-item="${updatedImage.id}"] .gallery-image`);

      if (imageElement) {
        imageElement.src = baseUrl + '/storage/' + updatedImage.file_path;
      }

      console.log(data, 'updated');

      const activeEditModal = document.querySelector('[data-js="edit-modal"].active');

      if (activeEditModal) activeEditModal.classList.remove('active');
    })
    .catch(error => console.error('Error updating image:', error));
}

const debouncedUpdateRequest = debounce((id, dataJson) => {
  // console.log('Debounced update fetch:', dataJson);
  updatedRequest(id, dataJson);
}, 300);

async function handleUpdateFormSubmit() {
  const galleryMainContainer = document.querySelector('[data-js="gallery-main-container"].gallery-page');

  const updateForm = galleryMainContainer?.querySelector('[data-js="update-form"]');
  if (!updateForm) return;

  // Remove any previous submit handler
  if (updateForm._submitHandler) {
    updateForm.removeEventListener('submit', updateForm._submitHandler);
  }

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

    // Check if a new image file is selected
    const fileInput = updateForm.querySelector('input[type="file"]');

    if (fileInput && fileInput.files.length > 0) {
      const { base64, name, type } =
        await fileToBase64(fileInput.files[0]);

      formData.append('image', base64);
      formData.append('image_name', name);
      formData.append('image_type', type);
    }

    const jsonData = formDataToJson(formData);

    debouncedUpdateRequest(id, jsonData);
  };

  updateForm.addEventListener('submit', updateForm._submitHandler);
}

export {
  handleUpdateFormSubmit
}