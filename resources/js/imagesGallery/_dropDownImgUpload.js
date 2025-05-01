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

  const dropZone =
    activeMainContainer.querySelector('[data-js="drop-zone"]');

  const uploadForm =
    activeMainContainer.querySelector('[data-js="upload-form"]');

  if (!uploadImages || !dropZone || !uploadForm) return;

  // === DROP ZONE ===
  if (dropZone._clickHandler) dropZone.removeEventListener('click', dropZone._clickHandler);

  if (dropZone._dragOverHandler) dropZone.removeEventListener('dragover', dropZone._dragOverHandler);

  if (dropZone._dragLeaveHandler) dropZone.removeEventListener('dragleave', dropZone._dragLeaveHandler);

  if (dropZone._dropHandler) dropZone.removeEventListener('drop', dropZone._dropHandler);

  dropZone._clickHandler = () => uploadImages.click();

  dropZone._dragOverHandler = e => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add('dragging');
  };

  dropZone._dragLeaveHandler = e => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('dragging');
  };

  dropZone._dropHandler = e => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('dragging');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      debouncedUploadFiles(files);
    }
  };

  dropZone.addEventListener('click', dropZone._clickHandler);
  dropZone.addEventListener('dragover', dropZone._dragOverHandler);
  dropZone.addEventListener('dragleave', dropZone._dragLeaveHandler);
  dropZone.addEventListener('drop', dropZone._dropHandler);

  // === FILE INPUT ===
  if (uploadImages._changeHandler) {
    uploadImages.removeEventListener('change', uploadImages._changeHandler);
  }

  uploadImages._changeHandler = e => {
    e.preventDefault();
    e.stopImmediatePropagation();

    const files = e.target.files;
    const filesLengthZeroArray =
      Array.from({ length: files.length }, () => 0);

    debouncedUploadFiles(filesLengthZeroArray);
  };

  uploadImages.addEventListener('change', uploadImages._changeHandler);
}
