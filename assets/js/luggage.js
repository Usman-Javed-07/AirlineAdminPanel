
  async function fetchLuggageData() {
    try {
      const res = await fetch(`${BASE_URL}/luggage`);
      const data = await res.json();

      const container = document.getElementById("luggageList");
      container.innerHTML = ""; // clear any existing items

      data.forEach((item) => {
        const div = document.createElement("div");
        div.innerHTML = `
          <p><strong>Booking ID:</strong> ${item.bookingId}</p>
          <p><strong>Luggage Tag ID:</strong> ${item.luggageTagId}</p>
          <p><strong>Weight:</strong> ${item.weight} kg</p>
          <p><strong>Bags:</strong> ${item.numBags}</p>
          <hr>
        `;
        container.appendChild(div);
      });
    } catch (err) {
      console.error("Failed to load luggage data:", err);
    }
  }

  // Call it when the page loads
  window.onload = fetchLuggageData;

