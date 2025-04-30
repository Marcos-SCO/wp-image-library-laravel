function handleModalChangesAfterPagination() {
  const modalContent =
    document.querySelector('[data-js="modal-gallery-content"]');

  if (!modalContent) return;

  const selectedImagesInput =
    document.querySelector('.active-trigger [name="selected_images[]"]');

  if (!selectedImagesInput) return;

  const jsonInput = selectedImagesInput?.value || '[]';

  let selectedImages = JSON.parse(jsonInput || '[]');

  const modalItems = modalContent.querySelectorAll('[data-img-item]');
  if (!modalItems) return;

  modalItems.forEach(item => {
    const imgItemId = item.getAttribute('data-img-item');

    const isSelected = selectedImages.some(img => img.id === imgItemId);

    if (isSelected) {
      item?.classList.add('selected');
      return;
    }

    // item?.classList.remove('selected');
  });

}

export {
  handleModalChangesAfterPagination
}