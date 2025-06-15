document.addEventListener('DOMContentLoaded', function() {
    // Initialize counters
    const cowCounter = new CountUp('cowCount', 0, 1000);
    const dogCounter = new CountUp('dogCount', 0, 800);
    const accuracyCounter = new CountUp('accuracyCount', 0, 90);
    
    // Start counters when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                cowCounter.start();
                dogCounter.start();
                accuracyCounter.start();
            }
        });
    });
    
    observer.observe(document.querySelector('.stats'));

    // Slideshow functionality
    const slideshow = document.getElementById('slideshow');
    const slides = slideshow.getElementsByClassName('slideshow-image');
    let currentSlide = 0;

    function nextSlide() {
        // Remove active class from current slide
        slides[currentSlide].classList.remove('active');
        // Move to next slide
        currentSlide = (currentSlide + 1) % slides.length;
        // Add active class to new slide
        slides[currentSlide].classList.add('active');
    }

    // Start slideshow
    if (slides.length > 0) {
        // Make sure first slide is visible
        slides[0].classList.add('active');
        // Change slide every 5 seconds
        setInterval(nextSlide, 5000);
    }
});

function selectAnimal(type) {
    document.getElementById('animal-type').value = type;
    document.getElementById('upload-section').scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('upload-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    const fileInput = document.getElementById('image-upload');
    const animalType = document.getElementById('animal-type').value;
    
    formData.append('file', fileInput.files[0]);
    formData.append('animal_type', animalType);
    
    try {
        const submitButton = e.target.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Analyzing...';
        
        const response = await fetch('/predict', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        document.getElementById('result').classList.remove('hidden');
        document.getElementById('prediction').textContent = `Disease: ${result.prediction}`;
        document.getElementById('confidence').textContent = `Confidence: ${(result.confidence * 100).toFixed(2)}%`;
        
        submitButton.disabled = false;
        submitButton.textContent = 'Detect Disease';
    } catch (error) {
        console.error('Error:', error);
        alert('Error processing image');
    }
});