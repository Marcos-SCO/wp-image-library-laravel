import Swal from "sweetalert2";
import { getBaseUrl } from "../helpers/_dom";

function swalYourNotAllowedModal(responseMessage, title = 'You\'re not allowed!') {

    Swal.fire({
        title: title,
        //text: responseMessage,
        html: `<style>.you-shall-not-pass-modal .swal2-actions {margin-top:-.5rem;}</style><p>${responseMessage}</p><img src="${getBaseUrl()}/build/assets/img/youShallNotPass.png" alt="You shall not pass" style="width:100%;max-width: 174px;margin:auto;">`,
        // icon: 'warning',
        customClass: { container: 'you-shall-not-pass-modal' },
        showCancelButton: false,
        confirmButtonColor: '#015c94',
        confirmButtonText: 'Ok, i understand',
      }).then((result) => {
        if (!result.isConfirmed) return;

        window.location.href = getBaseUrl() + '/login';
      });
}

export {
    swalYourNotAllowedModal
}