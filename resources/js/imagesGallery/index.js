import './form';
import './galleryModal/galleryModal.js';
import './_closeModals.js';

import { handleUpdateFormSubmit } from './_updateForm.js';
import { handlePagination } from './_pagination.js';
import { handleEditModal } from './_editModal.js';
import { handleGalleryDeleteItems } from './_deleteModal.js';
import { dropDownImgUpload } from './_dropDownImgUpload.js';

window.debounce = function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

window.initEventListeners = function initEventListeners() {
  handlePagination();
  handleEditModal();
}

document.addEventListener('DOMContentLoaded', function () {
  handleGalleryDeleteItems();
  initEventListeners();
  dropDownImgUpload();
  handleUpdateFormSubmit();
});