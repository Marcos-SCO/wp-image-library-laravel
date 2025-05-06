import './form';
import './galleryModal/galleryModal.js';
import './_closeModals.js';

import { handleUpdateFormSubmit } from './_updateForm.js';
import { handlePagination } from './_pagination.js';
import { handleEditModal } from './_editModal.js';
import { handleGalleryDeleteItems } from './_deleteModal.js';
import { dropDownImgUpload } from './_dropDownImgUpload.js';
import { formInputsChange } from './form';
import { activateLoadingWrapper } from '../helpers/_imageLoad.js';

function initEventListeners() {
  handlePagination();
  
  handleEditModal();
  handleGalleryDeleteItems();
  
  formInputsChange();

  dropDownImgUpload();
  handleUpdateFormSubmit();

  activateLoadingWrapper();
}

document.addEventListener('DOMContentLoaded', function () {
  initEventListeners();
});

export {
  initEventListeners
}