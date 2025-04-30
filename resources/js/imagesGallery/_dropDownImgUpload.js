import { debounce } from 'lodash';
import { uploadFiles } from './_uploadFiles';

// Debounced function for handling file uploads
const debouncedUploadFiles = debounce((files) => {
  // console.log('Debounced upload files triggered:', files);
  uploadFiles(files);
}, 300);

export function dropDownImgUpload() {

  const uploadImages =
    document.querySelector('[data-js="upload-images"]');

  const dropZone = document.querySelector('[data-js="drop-zone"]');

  const uploadForm =
    document.querySelector('[data-js="upload-form"]');

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

  uploadImages.addEventListener('change', function () {
    // console.log(this.files)
    debouncedUploadFiles(this.files[0]);
  });
}