@if (session('success'))
<div class="alert alert-success alert-dismissible fade show" role="alert" data-js="success-alert">
    {{ session('success') }}
    <button type="button" class="btn-close" aria-label="Close"></button>
</div>

<script>
    function successMessage() {

        const alertBox = document.querySelector('[data-js="success-alert"]');

        if (!alertBox) return;

        const closeButton = alertBox.querySelector('.btn-close');

        closeButton.addEventListener('click', function() {
            alertBox.classList.add('hide-element');
        });
        
        setTimeout(() => {
            alertBox.classList.add('hide-element');
        }, 10000);
    }

    document.addEventListener('DOMContentLoaded', () => successMessage());
</script>
@endif