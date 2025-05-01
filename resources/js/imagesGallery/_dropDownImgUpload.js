import { debounce } from 'lodash';
import { uploadFiles } from './_uploadFiles';

// Debounced function for handling file uploads
const debouncedUploadFiles = debounce((files) => {
  // console.log('Debounced upload files triggered:', files);
  uploadFiles(files);
}, 300);

export function dropDownImgUpload() {
  const activeMainContainer = document.querySelector('[data-js="gallery-main-container"].active');
  if (!activeMainContainer) return;

  const uploadImages =
    activeMainContainer.querySelector('[data-js="upload-images"]');

  const dropZone = activeMainContainer.querySelector('[data-js="drop-zone"]');

  const uploadForm =
    activeMainContainer.querySelector('[data-js="upload-form"]');

  if (!uploadImages || !dropZone || !uploadForm) return;

  // Event listeners
  dropZone.addEventListener('click', function () {
    uploadImages.click();
  });

  dropZone.addEventListener('dragover', function (e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add('dragging');
  });

  dropZone.addEventListener('dragleave', function (e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('dragging');
  });

  dropZone.addEventListener('drop', function (e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('dragging');

    const files = e.dataTransfer.files;

    if (files.length > 0) {
      // Trigger only the debounced function
      debouncedUploadFiles(files);
    }
  });

  uploadImages.addEventListener('change', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    const files = e.target.files;

    const filesLengthZeroArray =
      Array.from({ length: files.length }, () => 0);

    debouncedUploadFiles(filesLengthZeroArray);

  });
}