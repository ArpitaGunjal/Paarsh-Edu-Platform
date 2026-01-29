// Tab Functionality
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// Enroll Button Functionality
const enrollBtn = document.querySelector('.btn-enroll');
if (enrollBtn) {
    enrollBtn.addEventListener('click', () => {
        alert('Enrollment system will be integrated soon! Please contact us directly.');
        // In production, this would redirect to enrollment page or open a modal
    });
}