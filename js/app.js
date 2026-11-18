function showToast(message) {
    let toast = document.getElementById("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(function () {
        toast.classList.remove("show");
    }, 3000);
}

document.addEventListener("DOMContentLoaded", function () {
    const priceChart = {
        "RCB vs CSK": { General: 800, Premium: 2000, VIP: 5000 },
        "MI vs KKR": { General: 1000, Premium: 2500, VIP: 6000 },
        "CSK vs RR": { General: 700, Premium: 1800, VIP: 4500 }
    };

    const defaultStandPrices = {
        General: 800,
        Premium: 2000,
        VIP: 5000
    };

    function getMatchKey(val) {
        if (!val) return "";
        if (val.includes("RCB vs CSK")) return "RCB vs CSK";
        if (val.includes("MI vs KKR")) return "MI vs KKR";
        if (val.includes("CSK vs RR")) return "CSK vs RR";
        return val;
    }

    const matchSelect = document.getElementById("match-select") || document.getElementById("match");
    const standSelect = document.getElementById("stand-select") || document.getElementById("stand");
    const quantityInput = document.getElementById("ticket-quantity") || document.getElementById("tickets") || document.querySelector('input[type="number"]');

    const summaryMatch = document.getElementById("summary-match");
    const summaryStand = document.getElementById("summary-stand");
    const summaryPrice = document.getElementById("summary-price");
    const summaryQuantity = document.getElementById("summary-quantity");
    const summaryTotal = document.getElementById("summary-total");

    function updateBookingSummary(showNotification = false) {
        if (!summaryMatch && !summaryStand && !summaryPrice && !summaryTotal) {
            return;
        }

        const selectedMatchRaw = matchSelect ? matchSelect.value : "";
        const matchKey = getMatchKey(selectedMatchRaw);
        const selectedStand = standSelect ? standSelect.value : "";
        let quantity = quantityInput ? parseInt(quantityInput.value, 10) : 1;

        if (isNaN(quantity) || quantity < 1) {
            quantity = 1;
        }

        let unitPrice = 0;
        if (matchKey && selectedStand && priceChart[matchKey] && priceChart[matchKey][selectedStand]) {
            unitPrice = priceChart[matchKey][selectedStand];
        } else if (selectedStand && defaultStandPrices[selectedStand]) {
            unitPrice = defaultStandPrices[selectedStand];
        }

        const totalAmount = unitPrice * quantity;

        if (summaryMatch) {
            summaryMatch.textContent = matchKey || (selectedMatchRaw ? selectedMatchRaw : "-- Choose a match --");
        }
        if (summaryStand) {
            summaryStand.textContent = selectedStand || "-- Choose a stand --";
        }
        if (summaryPrice) {
            summaryPrice.textContent = unitPrice > 0 ? `₹${unitPrice}` : "₹0";
        }
        if (summaryQuantity) {
            summaryQuantity.textContent = quantity;
        }
        if (summaryTotal) {
            summaryTotal.textContent = totalAmount > 0 ? `₹${totalAmount}` : "₹0";
        }

        if (showNotification) {
            showToast(`Summary updated! Total: ₹${totalAmount}`);
        }
    }

    if (matchSelect) {
        matchSelect.addEventListener("change", function () {
            updateBookingSummary(true);
        });
    }

    if (standSelect) {
        standSelect.addEventListener("change", function () {
            updateBookingSummary(true);
        });
    }

    if (quantityInput) {
        quantityInput.addEventListener("change", function () {
            updateBookingSummary(true);
        });
        quantityInput.addEventListener("input", function () {
            updateBookingSummary(false);
        });
    }

    updateBookingSummary(false);

    const bookButtons = document.querySelectorAll(".book-btn");
    const bookingSection = document.getElementById("booking");

    bookButtons.forEach(function (button) {
        button.addEventListener("click", function (e) {
            e.preventDefault();

            const row = button.closest("tr");
            let teamName = "";
            if (row && row.cells.length > 1) {
                teamName = row.cells[1].textContent.trim();
            }

            if (matchSelect && teamName) {
                for (let i = 0; i < matchSelect.options.length; i++) {
                    if (matchSelect.options[i].text.includes(teamName) || matchSelect.options[i].value.includes(teamName)) {
                        matchSelect.selectedIndex = i;
                        break;
                    }
                }
                updateBookingSummary(false);
            }

            if (bookingSection) {
                bookingSection.scrollIntoView({ behavior: "smooth" });
            }

            if (teamName) {
                showToast("Booking initiated for " + teamName + "! Please fill the form.");
            } else {
                showToast("Navigated to booking form. Please enter your details.");
            }
        });
    });

    const bookingForm = document.getElementById("booking-form") || document.querySelector("form");
    if (bookingForm) {
        bookingForm.addEventListener("submit", function (e) {
            e.preventDefault();
            showToast("Tickets booked successfully! A confirmation has been sent.");
            bookingForm.reset();
            updateBookingSummary(false);
        });

        bookingForm.addEventListener("reset", function () {
            setTimeout(function () {
                updateBookingSummary(false);
            }, 0);
        });
    }
});
