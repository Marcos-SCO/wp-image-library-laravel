function handleEscKeyCloseLightModal() {
  const body = document.body;

  body.addEventListener('keyup', (e) => {

    if (!(e.key === 'Escape')) return;

    const isSweetAlertActive =
      body.classList.contains('swal2-shown');

    if (isSweetAlertActive) return;

    const activeModals = document.querySelectorAll('.lightbox-modal.active');
    if (!activeModals?.length > 0) return;

    const openedModals = Array.from(activeModals);
    if (!openedModals) return;

    const lastActive = openedModals[openedModals?.length - 1];

    lastActive.classList.remove('active');

  });
}

function closeModalButtonListener() {
  document.body.addEventListener('click', (e) => {
    const target = e.target;

    const isButtonClose = target?.hasAttribute('close-modal');

    if (!isButtonClose) return;

    const closestActive = target?.closest('.lightbox-modal.active');
    if (!closestActive) return;

    closestActive.classList.remove('active');

  })
}

function closeLastActiveOutsideClickListener() {
  document.body.addEventListener('click', (e) => {
    const target = e.target;

    const closestActiveModal = target?.closest('.lightbox-modal.active');
    if (!closestActiveModal) return;

    const contentContainer =
      closestActiveModal.querySelector('.modal-content');

    const modalContentWasClicked = contentContainer.contains(target);

    if (modalContentWasClicked) return;

    closestActiveModal?.classList.remove('active');

  })
}

document.addEventListener('DOMContentLoaded', () => {
  closeModalButtonListener();
  handleEscKeyCloseLightModal();
  closeLastActiveOutsideClickListener();
});