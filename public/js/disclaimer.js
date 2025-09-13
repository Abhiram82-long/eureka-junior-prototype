// Disclaimer functionality
document.addEventListener('DOMContentLoaded', function() {
    const disclaimer = document.getElementById('disclaimer');
    const closeButton = document.getElementById('closeDisclaimer');

    if (disclaimer && closeButton) {
        closeButton.addEventListener('click', function() {
            disclaimer.style.display = 'none';
        });
    }
});