import './form';
import './galleryModal/galleryModal.js';
import './_closeModals.js';

import { handleUpdateFormSubmit } from './_updateForm.js';
import { handlePagination } from './_pagination.js';
import { handleEditModal } from './_editModal.js';
import { handleGalleryDeleteItems } from './_deleteModal.js';
import { dropDownImgUpload } from './_dropDownImgUpload.js';

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