let locale = "it";

document.addEventListener("DOMContentLoaded", function () {
  fetch("./data/list.json")
    .then((response) => response.json())
    .then((data) => {
      const activities = data.activities || [];
      const activitiesContainer = document.getElementById("activitiesList");

      activities.forEach((activity) => {
        if (activity.info.locales && locale in activity.info.locales) {
          const title = activity.info.locales[locale].title || "Untitled";
          const description =
            activity.info.locales[locale].description ||
            "No description available";
          let icon = "./data/activities/" + activity.id + ".png";

          const activityDiv = document.createElement("div");
          activityDiv.classList.add("activity");

          activityDiv.innerHTML = `
                    <img src="${icon}" alt="${title}" onerror="this.src='https://via.placeholder.com/60'">
                    <div class="info">
                        <h3>${title}</h3>
                        <p>${description}</p>
                    </div>
                `;

          activitiesContainer.appendChild(activityDiv);
        } else {
          console.log("No locale found for activity", activity.id);
        }
      });
    })
    .catch((error) => console.error("Error loading list.json:", error));
});
