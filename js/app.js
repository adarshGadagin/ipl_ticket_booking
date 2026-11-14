// Reusable showToast() function for notifications
function showToast(message) {
    let toast = document.getElementById("toast");

    // If toast container doesn't exist, create it dynamically
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    // Auto-hide toast after 3 seconds
    setTimeout(function () {
        toast.classList.remove("show");
    }, 3000);
}

// Event handling & smooth scrolling
document.addEventListener("DOMContentLoaded", function () {
    const bookButtons = document.querySelectorAll(".book-btn");
    const bookingSection = document.getElementById("booking");
    const matchSelect = document.getElementById("match-select") || document.getElementById("match");

    // Smooth scrolling from Book button in match schedule to booking form
    bookButtons.forEach(function (button) {
        button.addEventListener("click", function (e) {
            e.preventDefault();

            // Find match details from table row if present
            const row = button.closest("tr");
            let teamName = "";
            if (row && row.cells.length > 1) {
                teamName = row.cells[1].textContent.trim();
            }

            // Pre-select the match in the dropdown if available
            if (matchSelect && teamName) {
                for (let i = 0; i < matchSelect.options.length; i++) {
                    if (matchSelect.options[i].text.includes(teamName) || matchSelect.options[i].value.includes(teamName)) {
                        matchSelect.selectedIndex = i;
                        break;
                    }
                }
            }

            // Smooth scroll to the booking section
            if (bookingSection) {
                bookingSection.scrollIntoView({ behavior: "smooth" });
            }

            // Display confirmation toast
            if (teamName) {
                showToast("Booking initiated for " + teamName + "! Please fill the form.");
            } else {
                showToast("Navigated to booking form. Please enter your details.");
            }
        });
    });

    // Form submission confirmation toast
    const bookingForm = document.getElementById("booking-form") || document.querySelector("form");
    if (bookingForm) {
        bookingForm.addEventListener("submit", function (e) {
            e.preventDefault();
            showToast("Tickets booked successfully! A confirmation has been sent.");
            bookingForm.reset();
        });
    }
});

