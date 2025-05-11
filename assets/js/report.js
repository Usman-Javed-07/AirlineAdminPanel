let flightData = [];

document.addEventListener("DOMContentLoaded", async () => {
  const routeSelect = document.getElementById("routeInput");

  try {
    const res = await fetch(`${BASE_URL}/flights`);
    flightData = await res.json();

    const routes = [...new Set(flightData.map(f => f.route))];
    routes.forEach(route => {
      const option = document.createElement("option");
      option.value = route;
      option.textContent = route;
      routeSelect.appendChild(option);

    });
  } catch (err) {
    console.error("Failed to load flight routes:", err);
    console.log("Selected Route:", route);
  }
});


async function generateReport() {
  const route = document.getElementById("routeInput").value.trim();
  console.log("Selected Route:", route);

  if (!route) {
    alert("Please select a flight route.");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/bookings/report/${encodeURIComponent(route)}`);
    const data = await res.json();

    if (res.ok) {
      document.getElementById("routeName").textContent = data.route;
      document.getElementById("madeIt").textContent = data.report.madeIt;
      document.getElementById("missedIt").textContent = data.report.missedIt;
      document.getElementById("totalPaid").textContent = parseFloat(data.report.totalPaid).toFixed(2);

      const tableBody = document.getElementById("bookingTableBody");
      tableBody.innerHTML = "";

      data.bookings.forEach((booking) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${booking.booking_id}</td>
          <td>${booking.name || "N/A"}</td>
          <td>${booking.checkedIn ? "✅" : "❌"}</td>
          <td>${parseFloat(booking.price).toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
      });

      document.getElementById("reportSection").style.display = "block";
    } else {
      alert("Error: " + (data.error || "Failed to fetch report"));
    }
  } catch (err) {
    console.error("Fetch error:", err);
    alert("Server error occurred while fetching the report.");
  }
}


async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Grab the table body
  const table = document.getElementById("bookingTableBody");
  
  // Get all rows from the table
  const rows = Array.from(table.querySelectorAll("tr")).map(tr => {
    return Array.from(tr.children).map(td => td.textContent); // Get all cell values in the row
  });

  // Set table headers
  const headers = ['Booking ID', 'Name', 'Checked In', 'Price (£)'];

  // Generate the table in the PDF
  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 20, // Adjust this to fit your table in the page
  });

  // Save the generated PDF
  doc.save('Flight_Report.pdf');
}

