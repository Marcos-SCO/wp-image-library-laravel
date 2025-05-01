import { debounce } from "lodash";
import { formGetParamsQueryStringUpdate } from "../helpers/_forms";
import { handleModalChangesAfterPagination } from "../imagesGallery/galleryModal/_handleModalChangesAfterPagination";
import { getLaravelCsrfToken } from "../helpers/_dom";
import { initEventListeners } from ".";

function updateDataPage(dataPage = 1) {
  const currentPageInput =
    document.querySelector('[data-current-page]');

  if (!currentPageInput) return;

  currentPageInput.setAttribute('data-current-page', dataPage);
  currentPageInput.setAttribute('value', dataPage);
}


function fetchPaginationData(url) {

  const csrfToken = getLaravelCsrfToken();
  if (!csrfToken) console.error('No csrf token was provided...');

  let isLoading = false;
  if (isLoading) return;

  isLoading = true;

  fetch(url, {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-TOKEN': csrfToken
    }
  })
    .then(response => response.json())
    .then(data => {

      // Handle redirection if the server suggests a redirect to a different page
      if (data.redirect) {
        window.location.href = data.redirect;
        return;
      }

      const galleryMainContainer = document.querySelector('[data-js="gallery-main-container"].active');
      const galleryContainer = galleryMainContainer?.querySelector('[data-js="gallery-container"]');

      if (!galleryContainer) {
        console.error('Gallery container not found.');
        return;
      }

      const galleryMainContainerDataPage =
        galleryMainContainer?.getAttribute('data-page');

      const isGalleryPage = galleryMainContainerDataPage == 'gallery';

      // Update gallery content
      galleryContainer.innerHTML = data.view;

      // Update pagination links if included in the response
      const paginationContainer = galleryMainContainer?.querySelector('[data-js="pagination-links-container"]');

      if (paginationContainer && data.pagination) {
        paginationContainer.innerHTML = data.pagination;
      }

      if (isGalleryPage) {

        // Update the browser's URL
        formGetParamsQueryStringUpdate(`[data-js="main-search-inputs-form"]`);
      }

      if (!isGalleryPage) {
        handleModalChangesAfterPagination();
      }

      initEventListeners();
    })
    .catch(error => console.error('Error fetching pagination data:', error))
    .finally(() => {
      isLoading = false;
    });
}

const debouncedPaginationData = debounce((url, dataPage) => {
  // console.log('Debounced pagination data:', url);
  fetchPaginationData(url);

  updateDataPage(dataPage);
}, 300);

// Function to handle pagination via event delegation
function handlePagination() {
  const paginationContainer = document.querySelector('.gallery-main-container.active [data-js="pagination-links-container"]');

  if (!paginationContainer) return;

  // If a previous handler exists, remove it
  if (paginationContainer._paginationHandler) {
    paginationContainer.removeEventListener('click', paginationContainer._paginationHandler);
  }

  // Define and store the new handler
  const paginationHandler = function (e) {
    e.preventDefault();

    const target = e.target;
    const clickedLink = target.tagName.toLowerCase() === 'a';

    if (!clickedLink) return;

    const url = target.getAttribute('href');
    const dataPage = target?.getAttribute('data-page');

    debouncedPaginationData(url, dataPage);
  };

  // Attach the handler to the element for future removal
  paginationContainer._paginationHandler = paginationHandler;
  paginationContainer.addEventListener('click', paginationHandler);
}

export {
  handlePagination,
  fetchPaginationData,
  updateDataPage,
};
