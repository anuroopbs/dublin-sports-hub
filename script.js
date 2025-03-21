document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const dateInput = document.getElementById('date');
    const timeSlots = document.querySelectorAll('.time-slot');
    const bookingForm = document.getElementById('booking-form');
    const bookingStatus = document.getElementById('booking-status');
    const confirmationModal = document.getElementById('confirmation-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const closeModalX = document.querySelector('.close');
    const bookingDetails = document.getElementById('booking-details');
    
    // Set minimum date to today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayString = `${yyyy}-${mm}-${dd}`;
    dateInput.setAttribute('min', todayString);
    
    // Selected time slot
    let selectedTimeSlot = null;
    
    // Time slot selection
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            // Remove selected class from all time slots
            timeSlots.forEach(s => s.classList.remove('selected'));
            
            // Add selected class to clicked time slot
            this.classList.add('selected');
            
            // Store selected time
            selectedTimeSlot = this.dataset.time;
            
            // Update booking status
            updateBookingStatus();
        });
    });
    
    // Date selection
    dateInput.addEventListener('change', function() {
        updateBookingStatus();
    });
    
    // Update booking status
    function updateBookingStatus() {
        const selectedDate = dateInput.value;
        
        if (selectedDate && selectedTimeSlot) {
            const formattedDate = formatDate(selectedDate);
            bookingStatus.textContent = `Your Booking: ${formattedDate} at ${selectedTimeSlot}`;
        } else if (selectedDate) {
            bookingStatus.textContent = `Your Booking: ${formatDate(selectedDate)} - Please select a time`;
        } else if (selectedTimeSlot) {
            bookingStatus.textContent = `Your Booking: Please select a date - Time: ${selectedTimeSlot}`;
        } else {
            bookingStatus.textContent = `Your Booking: Please select a date and time`;
        }
    }
    
    // Format date for display
    function formatDate(dateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
    
    // Form submission
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const selectedDate = dateInput.value;
        
        // Validate date and time selection
        if (!selectedDate || !selectedTimeSlot) {
            alert('Please select both a date and time for your booking.');
            return;
        }
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const experience = document.getElementById('experience').value;
        const notes = document.getElementById('notes').value;
        
        // Display booking details in confirmation modal
        const formattedDate = formatDate(selectedDate);
        bookingDetails.innerHTML = `
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${selectedTimeSlot}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Experience Level:</strong> ${experience}</p>
            ${notes ? `<p><strong>Special Requests:</strong> ${notes}</p>` : ''}
        `;
        
        // Show confirmation modal
        confirmationModal.style.display = 'block';
        
        // In a real application, you would send this data to a server
        console.log('Booking submitted:', {
            date: selectedDate,
            time: selectedTimeSlot,
            name,
            email,
            phone,
            experience,
            notes
        });
    });
    
    // Close modal when clicking the close button
    closeModalBtn.addEventListener('click', function() {
        confirmationModal.style.display = 'none';
        // Reset form after successful submission
        bookingForm.reset();
        timeSlots.forEach(s => s.classList.remove('selected'));
        selectedTimeSlot = null;
        updateBookingStatus();
    });
    
    // Close modal when clicking the X
    closeModalX.addEventListener('click', function() {
        confirmationModal.style.display = 'none';
    });
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(event) {
        if (event.target === confirmationModal) {
            confirmationModal.style.display = 'none';
        }
    });
});
