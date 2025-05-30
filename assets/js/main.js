// Handle Add Flight Form Submission
const flightForm = document.getElementById("flightForm");
if (flightForm) {
  flightForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(flightForm);
    const flight = {
      route: formData.get("route"),
      date: formData.get("date"),
      departure_time: formData.get("departure_time"),
      arrival_time: formData.get("arrival_time"),
      vessel: formData.get("vessel"),
      economy_price: formData.get("economy_price"),
      business_price: formData.get("business_price"),
      first_price: formData.get("first_price"),
      pickup_cities: formData
        .get("pickup_cities")
        ?.split(/\s+/)
        .map((city) => city.trim().toLowerCase()),
      dropoff_cities: formData
        .get("dropoff_cities")
        ?.split(/\s+/)
        .map((city) => city.trim().toLowerCase()),
    };

    try {
      const res = await fetch(`${BASE_URL}/flights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flight),
      });
      const data = await res.json();
      Toastify({
        text: data.message || "Flight added successfully",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#4CAF50",
        close: true,
      }).showToast();

      flightForm.reset();
      loadFlights();
    } catch (err) {
      console.error(err);
      Toastify({
        text: "Failed to add flight",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#f44336",
        close: true,
      }).showToast();
    }
  });
}

// Load and display all flights
async function loadFlights() {
  const tableContainer = document.getElementById("flightsTable");
  if (!tableContainer) return;

  try {
    const res = await fetch(`${BASE_URL}/flights`);
    const flights = await res.json();

    if (flights.length === 0) {
      tableContainer.innerHTML = "<p>No flights available</p>";
      return;
    }

    const rows = flights
      .map(
        (f) => `
      <tr data-id="${f.id}">
        <td>${f.id}</td>
        <td>${f.route}</td>
        <td><input type="date" value="${f.date}" class="edit-date" /></td>
        <td><input type="time" value="${f.departure_time}" class="edit-departure" /></td>
        <td><input type="time" value="${f.arrival_time}" class="edit-arrival" /></td>
        <td>${f.vessel}</td>
        <td><input type="number" value="${f.economy_price}" class="edit-economy" /></td>
        <td><input type="number" value="${f.business_price}" class="edit-business" /></td>
        <td><input type="number" value="${f.first_price}" class="edit-first" /></td>



        <td><button class="update-btn">Update</button></td>
      </tr>
    `
      )
      .join("");

    tableContainer.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Route</th>
            <th>Date</th>
            <th>Departure Time</th>
            <th>Arrival Time</th>
            <th>Vessel</th>
            <th>Economy</th>
            <th>Business</th>
            <th>First</th>
           

            <th>Action</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;

    // Attach update event listeners
    document.querySelectorAll(".update-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const row = btn.closest("tr");
        const flightId = row.dataset.id;

        const updatedData = {
          date: row.querySelector(".edit-date").value,
          departure_time: row.querySelector(".edit-departure").value,
          arrival_time: row.querySelector(".edit-arrival").value,
          economy_price: parseFloat(row.querySelector(".edit-economy").value),
          business_price: parseFloat(row.querySelector(".edit-business").value),
          first_price: parseFloat(row.querySelector(".edit-first").value),
        };

        try {
          const res = await fetch(`${BASE_URL}/flights/${flightId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
          });

          if (res.ok) {
            Toastify({
              text: "Flight updated successfully!",
              duration: 3000,
              gravity: "top",
              position: "right",
              backgroundColor: "#4CAF50",
              close: true,
            }).showToast();
          } else {
            Toastify({
              text: "Failed to update flight.",
              duration: 3000,
              gravity: "top",
              position: "right",
              backgroundColor: "#f44336",
              close: true,
            }).showToast();
          }
        } catch (err) {
          console.error("Update error:", err);
          Toastify({
            text: "Error updating flight.",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#f44336",
            close: true,
          }).showToast();
        }
      });
    });
  } catch (err) {
    console.error(err);
    tableContainer.innerHTML = "<p>Error loading flights</p>";
  }
}

// 🚨 Make sure this is at the bottom
document.addEventListener("DOMContentLoaded", () => {
  loadFlights();
});

// Load bookings (on manage-bookings.html)
async function loadBookings() {
  const table = document.getElementById("bookingsTable");
  if (!table) return;

  try {
    const res = await fetch(`${BASE_URL}/bookings`);
    const bookings = await res.json();

    const tbody = table.querySelector("tbody");
    tbody.innerHTML = bookings
      .map(
        (b) => `
        <tr>
          <td>${b.id}</td>
          <td>${b.passenger_name}</td>
          <td>${b.flight}</td>
          <td>${b.status}</td>
          <td><button onclick="modifyBooking(${b.id})">Modify</button></td>
          <td><button onclick="cancelBooking(${b.id})">Cancel</button></td>
        </tr>`
      )
      .join("");
  } catch (err) {
    console.error(err);
    Toastify({
      text: "Failed to load bookings",
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "#f44336",
      close: true,
    }).showToast();
  }
}

// Cancel a booking
async function cancelBooking(bookingId) {
  const confirmed = confirm(`Cancel booking #${bookingId}?`);
  if (!confirmed) return;

  try {
    const res = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    Toastify({
      text: data.message || "Booking cancelled",
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "#f44336",
      close: true,
    }).showToast();

    loadBookings();
  } catch (err) {
    console.error(err);
    Toastify({
      text: "Failed to cancel booking",
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "#f44336",
      close: true,
    }).showToast();
  }
}

// Placeholder for modifying booking
function modifyBooking(id) {
  Toastify({
    text: "Modify booking #" + id + " (not implemented)",
    duration: 3000,
    gravity: "top",
    position: "right",
    backgroundColor: "#ff9800",
    close: true,
  }).showToast();
}

// Handle report generation
const reportForm = document.getElementById("reportForm");
if (reportForm) {
  reportForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(reportForm);
    const from = formData.get("from");
    const to = formData.get("to");

    try {
      const res = await fetch(`${BASE_URL}/reports?from=${from}&to=${to}`);
      const report = await res.json();

      document.getElementById("reportResults").innerHTML = `
        <p>Total Flights: ${report.totalFlights}</p>
        <p>Total Passengers: ${report.totalPassengers}</p>
        <p>Revenue: £${report.revenue}</p>
        <p>Checked-in: ${report.checkIns}</p>
        <p>Missed Flights: ${report.missed}</p>
      `;
    } catch (err) {
      console.error(err);
      Toastify({
        text: "Failed to generate report",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#f44336",
        close: true,
      }).showToast();
    }
  });
}
