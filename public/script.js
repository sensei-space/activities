let locale = "it";
let needsFloorFilter = false;

let defaultPalette = [
  { color: "#FFFFFF", label: "White" }, // White
  { color: "#FFEB3B", label: "Yellow 500" }, // Yellow 500
  { color: "#FFC107", label: "Amber 500" }, // Amber 500
  { color: "#FF9800", label: "Orange 500" }, // Orange 500
  { color: "#FF5722", label: "Deep Orange 500" }, // Deep Orange 500
  { color: "#F44336", label: "Red 500" }, // Red 500
  { color: "#E91E63", label: "Pink 500" }, // Pink 500
  { color: "#9C27B0", label: "Purple 500" }, // Purple 500
  { color: "#673AB7", label: "Deep Purple 500" }, // Deep Purple 500
  { color: "#3F51B5", label: "Indigo 500" }, // Indigo 500
  { color: "#2196F3", label: "Blue 500" }, // Blue 500
  { color: "#03A9F4", label: "Light Blue 500" }, // Light Blue 500
  { color: "#00BCD4", label: "Cyan 500" }, // Cyan 500
  { color: "#009688", label: "Teal 500" }, // Teal 500
  { color: "#4CAF50", label: "Green 500" }, // Green 500
  { color: "#8BC34A", label: "Light Green 500" }, // Light Green 500
  { color: "#9E9E9E", label: "Gray 500" }, // Gray 500
  { color: "#000000", label: "Black" }, // Black
];

let dictionary = {
  title: {
    en: "Available activities in",
    it: "Attività disponibili in",
    fr: "Activités disponibles en",
    es: "Actividades disponibles en",
    de: "Verfügbare Aktivitäten in",
  },
  parameters: {
    en: "Parameters",
    it: "Parametri",
    fr: "Paramètres",
    es: "Parámetros",
    de: "Parameter",
  },
  yesno: {
    en: "Yes/No",
    it: "Sì/No",
    fr: "Oui/Non",
    es: "Sí/No",
    de: "Ja/Nein",
  },
  button: {
    en: "Button",
    it: "Pulsante",
    fr: "Bouton",
    es: "Botón",
    de: "Schaltfläche",
  },
  image: {
    en: "Local or internet image",
    it: "Immagine locale o da internet",
    fr: "Image locale ou internet",
    es: "Imagen local o de internet",
    de: "Lokales oder Internetbild",
  },
  video: {
    en: "Local or internet video",
    it: "Video locale o da internet",
    fr: "Vidéo locale ou internet",
    es: "Video local o de internet",
    de: "Lokales oder Internetvideo",
  },
  audio: {
    en: "Local or internet audio",
    it: "Audio locale o da internet",
    fr: "Audio local ou internet",
    es: "Audio local o de internet",
    de: "Lokales oder Internet-Audio",
  },
  from: {
    en: "from",
    it: "da",
    fr: "de",
    es: "de",
    de: "von",
  },
  to: {
    en: "to",
    it: "a",
    fr: "à",
    es: "a",
    de: "zu",
  },
};

let activitiesContainer;


disableRightClick();
getUrlParams();

document.addEventListener("DOMContentLoaded", function () {

  document.getElementById("title").innerText = t("title");

  activitiesContainer = document.getElementById("activitiesList");
  loadJson();
});

function loadJson() {
  fetch("./data/list.json")
    .then((response) => response.json())
    .then((data) => {
      const activities = data.activities || [];

      activities.forEach((activity) => {
        addActivity(activity);
      });
    })
    .catch((error) => console.error("Error loading list.json:", error));
}

function addActivity(activity) {
  if (activity.info.locales && locale in activity.info.locales) {

    if(needsFloorFilter && activity.needsFloor === true) return;

    const title = activity.info.locales[locale].title || "";
    if(title === "") return;

    const description = activity.info.locales[locale].description || "";
    let icon = "./data/activities/" + activity.id + ".png";

    const activityDiv = document.createElement("div");
    activityDiv.classList.add("activity");

    //set attributes in data-
    activityDiv.setAttribute("data-id", activity.id);
    activityDiv.setAttribute("data-title", title);

    let parametersHTML = `<details><summary>${t("parameters")}</summary><ul>`;
    (activity.parameters || []).forEach((param) => {
      switch (param.type) {
        case "toggle":
          parametersHTML += `<li><b>${param.text}</b>: ${t("yesno")}</li>`;
          break;
        case "button":
          parametersHTML += `<li><b>${param.text}</b>: <div class="button">${
            param.label || t("button")
          }</div></li>`;
          break;
        case "slider":
          parametersHTML += `<li><b>${param.text}</b>: ${t("from")} ${param.min} ${t("to")} ${param.max}</li>`;
          break;
        case "list":
          parametersHTML += `<li><b>${param.text}</b>: <ul>`;
          param.choices.forEach((choice) => {
            parametersHTML += `<li>${choice}</li>`;
          });
          parametersHTML += `</ul></li>`;
          break;
        case "color":
          parametersHTML += `<li><b>${param.text}</b>: `;
          parametersHTML += createPalette(param);
          parametersHTML += `</li>`;
          break;
        case "image":
          parametersHTML += `<li><b>${param.text}</b>: ${t("image")}</li>`;
          break;
        case "video":
          parametersHTML += `<li><b>${param.text}</b>: ${t("video")}</li>`;
          break;
        case "audio":
          parametersHTML += `<li><b>${param.text}</b>: ${t("audio")}</li>`;
          break;
      }
    });
    parametersHTML += "</ul></details>";

    activityDiv.innerHTML = `
                  <div class="image">
                      <img src="${icon}" alt="${title}">
                  </div>
                  <div class="info">
                      <h3>${title}</h3>
                      <p>${description}</p>
                      ${parametersHTML}
                  </div>
              `;

    activitiesContainer.appendChild(activityDiv);
  } else {
    console.log("No locale found for activity", activity.id);
  }
}

function createPalette(param) {
  let palette = [];
  let defaultColor = param.default || "#FFFFFF";

  if (param.choices) {
    // Use provided choices and mark the default selection
    palette = param.choices.map((choice) => ({
      color: choice,
      label: choice,
      selected: choice.toLowerCase() === defaultColor.toLowerCase(),
    }));
  } else {
    // Clone defaultPalette and reset selection
    palette = defaultPalette.map((color) => ({
      ...color,
      selected: false, // Reset selection
    }));

    // Check if defaultColor is in palette, otherwise add it
    let found = false;
    palette = palette.map((color) => {
      if (color.color.toLowerCase() === defaultColor.toLowerCase()) {
        found = true;
        return { ...color, selected: true };
      }
      return color;
    });

    // If defaultColor is not in defaultPalette, add it
    if (!found) {
      palette.push({
        color: defaultColor,
        label: defaultColor,
        selected: true,
      });
    }
  }

  // Generate HTML for the color palette
  let paletteHTML = `<div class="palette">`;
  palette.forEach((color) => {
    paletteHTML += `<div style="background-color:${color.color}" class="color ${
      color.selected ? "selected" : ""
    }"></div>`;
  });
  paletteHTML += `</div>`;

  return paletteHTML;
}

function t(key) {
  if (key in dictionary && locale in dictionary[key]) {
    return dictionary[key][locale];
  }
  return "";
}

function disableRightClick() {
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });
}

function getUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("l")) {
    locale = urlParams.get("l");
  }
  if (urlParams.has("nf")) {
    needsFloorFilter = true;
  }
}
