import { debounce } from "lodash";
import { formGetParamsQueryStringUpdate } from "../helpers/_forms";
import { handleModalChangesAfterPagination } from "../imagesGallery/galleryModal/_handleModalChangesAfterPagination";
import { getLaravelCsrfToken } from "../helpers/_dom";

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

      const galleryMainContainer = document.querySelector('[data-js="gallery-main-container"]');
      const galleryContainer = galleryMainContainer.querySelector('[data-js="gallery-container"]');


      const galleryMainContainerDataPage = galleryMainContainer
        ?.getAttribute('data-page');

      const isGalleryPage = galleryMainContainerDataPage == 'gallery';

      if (!galleryContainer) {
        console.error('Gallery container not found.');
        return;
      }

      // Update gallery content
      galleryContainer.innerHTML = data.view;

      // Update pagination links if included in the response
      const paginationContainer = document.querySelector('[data-js="pagination-links-container"]');

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
    .catch(error => console.error('Error fetching pagination data:', error));
}

const debouncedPaginationData = debounce((url, dataPage) => {
  // console.log('Debounced pagination data:', url);
  fetchPaginationData(url);

  updateDataPage(dataPage);
}, 300);

// Function to handle pagination via event delegation
function handlePagination() {
  const paginationContainer = document.querySelector('[data-js="pagination-links-container"]');

  if (!paginationContainer) return;

  // Use event delegation to handle clicks on pagination links
  paginationContainer.addEventListener('click', function (e) {
    e.preventDefault();

    const target = e.target;
    const clickedLink = target.tagName.toLowerCase() === 'a';

    // Check if the clicked element is a link
    if (!clickedLink) return;

    const url = target.getAttribute('href');
    const dataPage = target?.getAttribute('data-page');

    debouncedPaginationData(url, dataPage);

  });
}

export {
  handlePagination,
  fetchPaginationData,
  updateDataPage,
};
