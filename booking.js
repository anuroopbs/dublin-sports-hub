document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.querySelector('form');
    
    if (bookingForm) {
        // Handle time button selection
        const timeButtons = document.querySelectorAll('button:not([type="submit"])');
        timeButtons.forEach(button => {
            button.addEventListener('click', function() {
                timeButtons.forEach(btn => btn.classList.remove('active', 'selected-time'));
                this.classList.add('active', 'selected-time');
            });
        });
        
        // Handle form submission
        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const date = document.querySelector('input[placeholder="Choose a date"]').value;
            const time = document.querySelector('button.selected-time').textContent;
            const name = document.querySelector('input[placeholder="Full Name"]').value;
            const email = document.querySelector('input[type="email"]').value;
            const phone = document.querySelector('input[placeholder="Phone Number"]').value;
            const experience = document.querySelector('select').value;
            const notes = document.querySelector('textarea').value;
            
            // Prepare email data
            const templateParams = {
                name: name,
                email: email,
                phone: phone,
                date: date,
                time: time,
                experience: experience,
                notes: notes
            };
            
            // Disable submit button
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            // Send email
            emailjs.send('service_j4beam4', 'template_rp83yqo', templateParams)
                .then(function(response) {
                    alert('Booking request sent successfully!');
                    bookingForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Request Booking';
                })
                .catch(function(error) {
                    alert('Failed to send booking request. Please try again.');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Request Booking';
                });
        });
    }
});
