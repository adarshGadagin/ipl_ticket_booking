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

function formatBookingId(booking) {
    const match = (booking.match_title || "IPL").toUpperCase().replace(/\s+/g, "");
    let teams = "IPL";
    let venue = "STAD";

    if (match.includes("RCB") && match.includes("CSK")) {
        teams = "RCB-CSK";
        venue = "BLR";
    } else if (match.includes("RCB") && match.includes("KKR")) {
        teams = "RCB-KKR";
        venue = "BLR";
    } else if (match.includes("MI") && match.includes("KKR")) {
        teams = "MI-KKR";
        venue = "MUM";
    } else if (match.includes("CSK") && match.includes("MI")) {
        teams = "CSK-MI";
        venue = "MUM";
    } else if (match.includes("CSK") && match.includes("RR")) {
        teams = "CSK-RR";
        venue = "CHE";
    } else if (match.includes("GT") && match.includes("RR")) {
        teams = "GT-RR";
        venue = "AHM";
    } else if (match.includes("SRH") && match.includes("DC")) {
        teams = "SRH-DC";
        venue = "HYD";
    } else if (match.includes("LSG") && match.includes("PBKS")) {
        teams = "LSG-PBKS";
        venue = "LKN";
    } else {
        teams = (booking.match_title || "IPL").replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase();
    }

    const idNum = booking.id || 1;
    const cnfCode = 10000 + (idNum * 389) % 90000;
    return "IPL26-" + teams + "-" + venue + "-TXN" + cnfCode;
}

function getMatchId(title) {
    if (title.includes("CSK") && title.includes("MI")) return 1;
    if (title.includes("RCB") && title.includes("KKR")) return 2;
    if (title.includes("GT") && title.includes("RR")) return 3;
    if (title.includes("SRH") && title.includes("DC")) return 4;
    if (title.includes("LSG") && title.includes("PBKS")) return 5;
    return 1;
}

document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", function () {
            navLinks.classList.toggle("active");
            hamburger.classList.toggle("open");
            const isOpen = navLinks.classList.contains("active");
            hamburger.setAttribute("aria-expanded", isOpen);
        });

        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove("active");
                    hamburger.classList.remove("open");
                    hamburger.setAttribute("aria-expanded", "false");
                }
            });
        });
    }

    const teamFilter = document.getElementById("team-filter");
    const matchCards = document.querySelectorAll(".match-card");

    if (teamFilter) {
        teamFilter.addEventListener("change", function () {
            const selectedTeam = teamFilter.value.trim().toUpperCase();

            matchCards.forEach(function (card) {
                const teamsAttr = (card.getAttribute("data-teams") || "").toUpperCase();
                const cardText = card.textContent.toUpperCase();

                if (selectedTeam === "ALL" || selectedTeam === "ALL TEAMS" || teamsAttr.includes(selectedTeam) || cardText.includes(selectedTeam)) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }
            });

            showToast("Showing matches for: " + (selectedTeam === "ALL" ? "All Teams" : teamFilter.value));
        });
    }

    const gridViewBtn = document.getElementById("grid-view-btn");
    const listViewBtn = document.getElementById("list-view-btn");
    const matchesContainer = document.getElementById("matches-container");

    if (gridViewBtn && listViewBtn && matchesContainer) {
        gridViewBtn.addEventListener("click", function () {
            matchesContainer.classList.remove("list-view");
            gridViewBtn.classList.add("active");
            listViewBtn.classList.remove("active");
            showToast("Switched to Grid View");
        });

        listViewBtn.addEventListener("click", function () {
            matchesContainer.classList.add("list-view");
            listViewBtn.classList.add("active");
            gridViewBtn.classList.remove("active");
            showToast("Switched to List View");
        });
    }

    const priceChart = {
        "CSK vs MI": { General: 1500, Premium: 3000, VIP: 6000 },
        "RCB vs KKR": { General: 1800, Premium: 3500, VIP: 7000 },
        "GT vs RR": { General: 1200, Premium: 2500, VIP: 5000 },
        "SRH vs DC": { General: 1000, Premium: 2200, VIP: 4500 },
        "LSG vs PBKS": { General: 1100, Premium: 2400, VIP: 4800 },
        "RCB vs CSK": { General: 800, Premium: 2000, VIP: 5000 },
        "MI vs KKR": { General: 1000, Premium: 2500, VIP: 6000 },
        "CSK vs RR": { General: 700, Premium: 1800, VIP: 4500 }
    };

    const defaultStandPrices = {
        General: 1000,
        Premium: 2500,
        VIP: 5000
    };

    function getMatchKey(val) {
        if (!val) return "";
        if (val.includes("CSK") && val.includes("MI")) return "CSK vs MI";
        if (val.includes("RCB") && val.includes("KKR")) return "RCB vs KKR";
        if (val.includes("GT") && val.includes("RR")) return "GT vs RR";
        if (val.includes("SRH") && val.includes("DC")) return "SRH vs DC";
        if (val.includes("LSG") && val.includes("PBKS")) return "LSG vs PBKS";
        if (val.includes("RCB") && val.includes("CSK")) return "RCB vs CSK";
        if (val.includes("MI") && val.includes("KKR")) return "MI vs KKR";
        if (val.includes("CSK") && val.includes("RR")) return "CSK vs RR";
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
            summaryPrice.textContent = unitPrice > 0 ? "₹" + unitPrice : "₹0";
        }
        if (summaryQuantity) {
            summaryQuantity.textContent = quantity;
        }
        if (summaryTotal) {
            summaryTotal.textContent = totalAmount > 0 ? "₹" + totalAmount : "₹0";
        }

        if (showNotification) {
            showToast("Summary updated! Total: ₹" + totalAmount);
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

    const urlParams = new URLSearchParams(window.location.search);
    const matchParam = urlParams.get("match");
    if (matchParam && matchSelect) {
        const searchVal = decodeURIComponent(matchParam).trim().toUpperCase();
        for (let i = 0; i < matchSelect.options.length; i++) {
            const optVal = matchSelect.options[i].value.toUpperCase();
            const optTxt = matchSelect.options[i].text.toUpperCase();
            if (optVal.includes(searchVal) || optTxt.includes(searchVal) || searchVal.includes(optVal)) {
                matchSelect.selectedIndex = i;
                break;
            }
        }
    }

    updateBookingSummary(false);

    const bookButtons = document.querySelectorAll(".book-btn");
    const bookingSection = document.getElementById("booking");

    bookButtons.forEach(function (button) {
        button.addEventListener("click", function (e) {
            let teamName = button.getAttribute("data-match") || "";

            if (!teamName) {
                const card = button.closest(".match-card");
                if (card) {
                    const teamsElem = card.querySelector(".match-teams, h3");
                    if (teamsElem) {
                        teamName = teamsElem.textContent.trim();
                    }
                }
            }

            if (!teamName) {
                const row = button.closest("tr");
                if (row && row.cells.length > 1) {
                    teamName = row.cells[1].textContent.trim();
                }
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
                e.preventDefault();
                bookingSection.scrollIntoView({ behavior: "smooth" });
                if (teamName) {
                    showToast("Booking initiated for " + teamName + "! Please fill the form.");
                } else {
                    showToast("Navigated to booking form. Please enter your details.");
                }
            }
        });
    });

    async function loadBookings() {
        const myBookingsSection = document.getElementById("mybookings");
        if (!myBookingsSection) return;

        const table = myBookingsSection.querySelector("table");
        if (!table) return;

        try {
            const response = await fetch("https://zvzepkeddrtrtcaprjgx.supabase.co/rest/v1/bookings?select=*&order=id.desc", {
                headers: {
                    "apikey": "sb_publishable_PxxOgVofgaPa5BMizU9N0A_PuAJnLo7",
                    "Authorization": "Bearer sb_publishable_PxxOgVofgaPa5BMizU9N0A_PuAJnLo7"
                }
            });

            if (!response.ok) return;

            const bookings = await response.json();
            if (Array.isArray(bookings) && bookings.length > 0) {
                const emptyMsg = myBookingsSection.querySelector("p");
                if (emptyMsg) {
                    emptyMsg.style.display = "none";
                }

                const rowsHtml = bookings.map(function (b) {
                    return "<tr>" +
                        "<td><strong>" + formatBookingId(b) + "</strong></td>" +
                        "<td>" + (b.match_title || "IPL Match") + "</td>" +
                        "<td>" + (b.user_name || "General") + "</td>" +
                        "<td>" + b.tickets + "</td>" +
                        "<td>₹" + b.total_price + "</td>" +
                    "</tr>";
                }).join("");

                table.innerHTML = "<tr>" +
                    "<th>Booking ID</th>" +
                    "<th>Match</th>" +
                    "<th>Name</th>" +
                    "<th>Tickets</th>" +
                    "<th>Total Amount</th>" +
                "</tr>" + rowsHtml;
            }
        } catch (err) {
        }
    }

    loadBookings();

    const bookingForm = document.getElementById("booking-form") || document.querySelector("form");
    if (bookingForm) {
        bookingForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const nameInput = document.getElementById("name") || document.getElementById("full-name");
            const userName = nameInput && nameInput.value ? nameInput.value.trim() : "Guest";
            const selectedMatchRaw = matchSelect ? matchSelect.value : "IPL Match";
            const matchTitle = getMatchKey(selectedMatchRaw) || selectedMatchRaw;
            let quantity = quantityInput ? parseInt(quantityInput.value, 10) : 1;
            if (isNaN(quantity) || quantity < 1) quantity = 1;

            let unitPrice = 1000;
            const selectedStand = standSelect ? standSelect.value : "";
            if (matchTitle && selectedStand && priceChart[matchTitle] && priceChart[matchTitle][selectedStand]) {
                unitPrice = priceChart[matchTitle][selectedStand];
            } else if (selectedStand && defaultStandPrices[selectedStand]) {
                unitPrice = defaultStandPrices[selectedStand];
            }
            const totalAmount = unitPrice * quantity;
            const matchId = getMatchId(matchTitle);

            let generatedBookingId = "IPL26-CONFIRMED";
            try {
                const res = await fetch("https://zvzepkeddrtrtcaprjgx.supabase.co/rest/v1/bookings", {
                    method: "POST",
                    headers: {
                        "apikey": "sb_publishable_PxxOgVofgaPa5BMizU9N0A_PuAJnLo7",
                        "Authorization": "Bearer sb_publishable_PxxOgVofgaPa5BMizU9N0A_PuAJnLo7",
                        "Content-Type": "application/json",
                        "Prefer": "return=representation"
                    },
                    body: JSON.stringify({
                        match_id: matchId,
                        user_name: userName,
                        match_title: matchTitle,
                        tickets: quantity,
                        total_price: totalAmount
                    })
                });

                if (res.ok) {
                    const inserted = await res.json();
                    if (Array.isArray(inserted) && inserted.length > 0) {
                        generatedBookingId = formatBookingId(inserted[0]);
                    }
                }

                const matchRes = await fetch("https://zvzepkeddrtrtcaprjgx.supabase.co/rest/v1/matches?id=eq." + matchId + "&select=available_seats", {
                    headers: {
                        "apikey": "sb_publishable_PxxOgVofgaPa5BMizU9N0A_PuAJnLo7",
                        "Authorization": "Bearer sb_publishable_PxxOgVofgaPa5BMizU9N0A_PuAJnLo7"
                    }
                });

                if (matchRes.ok) {
                    const matchData = await matchRes.json();
                    if (Array.isArray(matchData) && matchData.length > 0) {
                        const currentSeats = matchData[0].available_seats;
                        const newSeats = Math.max(0, currentSeats - quantity);
                        await fetch("https://zvzepkeddrtrtcaprjgx.supabase.co/rest/v1/matches?id=eq." + matchId, {
                            method: "PATCH",
                            headers: {
                                "apikey": "sb_publishable_PxxOgVofgaPa5BMizU9N0A_PuAJnLo7",
                                "Authorization": "Bearer sb_publishable_PxxOgVofgaPa5BMizU9N0A_PuAJnLo7",
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ available_seats: newSeats })
                        });
                    }
                }
            } catch (err) {
            }

            showToast("Tickets booked successfully! Booking ID: " + generatedBookingId);
            bookingForm.reset();
            updateBookingSummary(false);
            loadBookings();
        });

        bookingForm.addEventListener("reset", function () {
            setTimeout(function () {
                updateBookingSummary(false);
            }, 0);
        });
    }
});
