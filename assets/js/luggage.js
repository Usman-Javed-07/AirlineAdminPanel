
  async function fetchLuggageData() {
    try {
      const res = await fetch(`${BASE_URL}/luggage`);
      const data = await res.json();

      const container = document.getElementById("luggageList");
      container.innerHTML = ""; // clear any existing items

      data.forEach((item) => {
        const div = document.createElement("div");
       div.innerHTML = `
  <div class="booking-card">
    <div class="booking-grid">
      <div class="booking-item"><strong>Booking ID:</strong> ${item.bookingId}</div>
      <div class="booking-item"><strong>Luggage Tag ID:</strong> ${item.luggageTagId}</div>
      <div class="booking-item"><strong>Weight:</strong> ${item.weight} kg</div>
      <div class="booking-item"><strong>Bags:</strong> ${item.numBags}</div>
    </div>
    <hr>
  </div>
`;

        container.appendChild(div);
      });
    } catch (err) {
      console.error("Failed to load luggage data:", err);
    }
  }

  // Call it when the page loads
  window.onload = fetchLuggageData;

