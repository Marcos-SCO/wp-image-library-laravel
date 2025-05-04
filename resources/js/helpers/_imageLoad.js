function handleImageLoad(img) {
    const wrapper =
        img.closest("[data-js='image-loading-wrapper']");

    const loader = wrapper.querySelector(".image-loader");

    img.style.opacity = 1;

    if (loader) loader.remove();
}

function activateLoadingWrapper() {
    const images = document.querySelectorAll("[data-js='image-loading-wrapper'] img");

    console.log(images);

    images.forEach((img) => {
        let isImgComplete = img.complete;

        if (isImgComplete) handleImageLoad(img);

        if (!isImgComplete) {

            img.addEventListener("load", () => {
                return handleImageLoad(img)
            });
        }
    });
}

export {
    activateLoadingWrapper
}