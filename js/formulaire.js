document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('pieForm');
    const sections = document.querySelectorAll('.section');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentStepEl = document.getElementById('currentStep');
    const totalStepsEl = document.getElementById('totalSteps');
    const progressBar = document.getElementById('progressBar');
    const saveIndicator = document.getElementById('saveIndicator');

    let currentSection = 0;
    const totalSections = sections.length;

    // Initialize
    totalStepsEl.textContent = totalSections;
    updateNavigation();
    sections[0].classList.add('active');

    // Navigation
    prevBtn.addEventListener('click', () => {
        if (currentSection > 0) {
            sections[currentSection].classList.remove('active');
            currentSection--;
            sections[currentSection].classList.add('active');
            updateNavigation();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (validateCurrentSection()) {
            if (currentSection < totalSections - 1) {
                sections[currentSection].classList.remove('active');
                currentSection++;
                sections[currentSection].classList.add('active');
                updateNavigation();
                autoSave();
            } else {
                submitForm();
            }
        }
    });

    // Validation
    function validateCurrentSection() {
        const currentInputs = sections[currentSection].querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        currentInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                showError(input);
            } else {
                removeError(input);
            }
        });

        return isValid;
    }

    function showError(input) {
        input.classList.add('error');
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Ce champ est requis';
        input.parentNode.appendChild(errorMessage);
    }

    function removeError(input) {
        input.classList.remove('error');
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // Auto-save
    let autoSaveTimeout;
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(autoSave, 1000);
        });
    });

    async function autoSave() {
        const formData = new FormData(form);
        try {
            const response = await fetch('save_responses.php', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                showSaveIndicator();
            }
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
        }
    }

    function showSaveIndicator() {
        saveIndicator.style.opacity = '1';
        setTimeout(() => {
            saveIndicator.style.opacity = '0';
        }, 2000);
    }

    // Update UI
    function updateNavigation() {
        currentStepEl.textContent = currentSection + 1;
        prevBtn.style.visibility = currentSection === 0 ? 'hidden' : 'visible';
        nextBtn.textContent = currentSection === totalSections - 1 ? 'Terminer' : 'Suivant';
        updateProgressBar();
    }

    function updateProgressBar() {
        const progress = ((currentSection + 1) / totalSections) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Form submission
    async function submitForm() {
        if (validateCurrentSection()) {
            try {
                const formData = new FormData(form);
                const response = await fetch('save_responses.php', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    window.location.href = 'reponses.php';
                } else {
                    throw new Error('Erreur lors de la soumission');
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert('Une erreur est survenue lors de la soumission du formulaire');
            }
        }
    }
}); 