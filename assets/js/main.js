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
    };

    try {
      
      const res = await fetch("http://localhost:5000/api/flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flight),
      });
      const data = await res.json();
      alert(data.message || "Flight added successfully");
      flightForm.reset();
      loadFlights(); // Optional: refresh flight table
    } catch (err) {
      console.error(err);
      alert("Failed to add flight");
    }
  });
}

// Load and display all flights
async function loadFlights() {
  const tableContainer = document.getElementById("flightsTable");
  if (!tableContainer) return;

  try {
    const res = await fetch("http://localhost:5000/api/flights");
    const flights = await res.json();

    if (flights.length === 0) {
      tableContainer.innerHTML = "<p>No flights available</p>";
      return;
    }

    const rows = flights.map((f) => `
      <tr>
        <td>${f.id}</td>
        <td>${f.route}</td>
        <td>${f.date}</td>
        <td>${f.departure_time}</td> 
        <td> ${f.arrival_time} </td>
        <td>${f.vessel}</td>
        <td>£${f.economy_price}</td>
        <td>£${f.business_price}</td>
        <td>£${f.first_price}</td>
      </tr>`).join("");

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
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
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
    const res = await fetch("http://localhost:5000/api/bookings");
    const bookings = await res.json();

    const tbody = table.querySelector("tbody");
    tbody.innerHTML = bookings.map(
      (b) => `
        <tr>
          <td>${b.id}</td>
          <td>${b.passenger_name}</td>
          <td>${b.flight}</td>
          <td>${b.status}</td>
          <td><button onclick="modifyBooking(${b.id})">Modify</button></td>
          <td><button onclick="cancelBooking(${b.id})">Cancel</button></td>
        </tr>`
    ).join("");
  } catch (err) {
    console.error(err);
    alert("Failed to load bookings");
  }
}

// Cancel a booking
async function cancelBooking(bookingId) {
  const confirmed = confirm(`Cancel booking #${bookingId}?`);
  if (!confirmed) return;

  try {
    const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    alert(data.message || "Booking cancelled");
    loadBookings(); // Refresh list
  } catch (err) {
    console.error(err);
    alert("Failed to cancel booking");
  }
}

// Placeholder for modifying booking
function modifyBooking(id) {
  alert("Modify booking #" + id + " (not implemented)");
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
      const res = await fetch(`http://localhost:5000/api/reports?from=${from}&to=${to}`);
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
      alert("Failed to generate report");
    }
  });
}
