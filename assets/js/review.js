
    document.addEventListener("DOMContentLoaded", async () => {
      const container = document.getElementById("reviewList");

      try {
        const res = await fetch(`${BASE_URL}/reviews`);
        const reviews = await res.json();

        if (reviews.length === 0) {
          container.innerHTML = "<p>No reviews available.</p>";
          return;
        }

        container.innerHTML = "";
        reviews.forEach(review => {
          const div = document.createElement("div");
          div.className = "review-card";
          div.style.border = "1px solid #ccc";
          div.style.margin = "10px 0";
          div.style.padding = "10px";
         div.classList.add('review-card');
div.innerHTML = `
  <div class="review-header">
    <h3>${review.username}</h3>
    <span class="user-email">&lt;${review.email}&gt;</span>
  </div>
  <p><strong>Vessel:</strong> ${review.vessel}</p>
  <p><strong>Rating:</strong> ⭐ ${review.rating} / 5</p>
  <p><strong>Comments:</strong><br>${review.comments}</p>
`;

          container.appendChild(div);
        });

      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        container.innerHTML = "<p>Failed to load reviews.</p>";
      }
    });