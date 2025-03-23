let locale = "it";
let needsFloorFilter = false;
let incorporatedSite = false;

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
  activitiesTitle: {
    en: "Available activities in",
    it: "Attività disponibili in",
    fr: "Activités disponibles en",
    es: "Actividades disponibles en",
    de: "Verfügbare Aktivitäten in",
  },
  activitiesDescription: {
    en: "SENSEi offers a range of interactive activities designed together with industry specialists to support learning, therapy and personal development. Thanks to innovative digital tools, users can explore, play and learn in an engaging and adaptable environment.",
    it: "SENSEi offre una gamma di attività interattive progettate insieme agli specialisti del settore per supportare l'apprendimento, la terapia e lo sviluppo personale. Grazie a strumenti digitali innovativi, gli utenti possono esplorare, giocare e imparare in un ambiente coinvolgente e adattabile.",
    fr: "SENSEi propose une gamme d'activités interactives conçues en collaboration avec des spécialistes de l'industrie pour soutenir l'apprentissage, la thérapie et le développement personnel. Grâce à des outils numériques innovants, les utilisateurs peuvent explorer, jouer et apprendre dans un environnement engageant et adaptable.",
    es: "SENSEi ofrece una variedad de actividades interactivas diseñadas junto con especialistas de la industria para apoyar el aprendizaje, la terapia y el desarrollo personal. Gracias a herramientas digitales innovadoras, los usuarios pueden explorar, jugar y aprender en un entorno atractivo y adaptable.",
    de: "SENSEi bietet eine Reihe interaktiver Aktivitäten, die zusammen mit Branchenspezialisten entwickelt wurden, um Lernen, Therapie und persönliche Entwicklung zu unterstützen. Dank innovativer digitaler Tools können Benutzer in einer ansprechenden und anpassungsfähigen Umgebung erkunden, spielen und lernen.",
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

let activitiesList;
let integrationsContainer;
let activities = [];
let categories = [];

disableRightClick();
getUrlParams();

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("activitiesTitle").innerText = t("activitiesTitle");
  document.getElementById("activitiesDescription").innerText = t("activitiesDescription");

  activitiesList = document.getElementById("activitiesList");

  integrationsContainer = document.getElementById("integrationsList");
  loadJsons();

  if (incorporatedSite) {
    try {
      //hide title and description
      document.getElementById("activitiesTitle").style.display = "none";
      document.getElementById("activitiesDescription").style.display = "none";
      //hide #logo and #logo_print
      document.getElementById("logo").style.display = "none";
      document.getElementById("logo_print").style.display = "none";
      //hide div with class .print and .printParams
      document.querySelectorAll(".print").forEach((element) => {
        element.style.display = "none";
      });
      document.querySelectorAll(".printParams").forEach((element) => {
        element.style.display = "none";
      });
      //hide .integrationsContainer
      document.getElementById("integrationsContainer").style.display = "none";

      //.activitiesContainer is 100% height
      let activitiesContainer = document.getElementById("activitiesContainer");
      activitiesContainer.style.height = "100%";
      //body has blocked overflow
      document.body.style.overflow = "hidden";
      activitiesList.style.overflowY = "auto";

      let margin = 100;
      if (window.innerWidth < 600) {
        margin = 50;
      }
      activitiesList.style.height = `${window.innerHeight - margin}px`;

      window.addEventListener("resize", () => {
        let margin = 100;
        if (window.innerWidth < 600) {
          margin = 50;
        }
        activitiesList.style.height = `${window.innerHeight - margin}px`;
      });
    } catch (e) {
      console.log(e);
    }
  }
});

function loadJsons() {
  //ACTIVITIES
  fetch("./data/activities.json")
    .then((response) => response.json())
    .then((data) => {
      categories = data.categories || [];
      activities = data.activities || [];

      activities.forEach((activity) => {
        addActivity(activity);
      });
    })
    .catch((error) => console.error("Error loading list.json:", error));

  //INTEGRATIONS
  fetch("./data/integrations.json")
    .then((response) => response.json())
    .then((data) => {
      const integrations = data.integrations || [];

      document.getElementById("integrationsTitle").innerText = integrations.title[locale];
      document.getElementById("integrationsDescription").innerText = integrations.description[locale];
      document.getElementById("integrationsBrandPolicy").innerText = integrations.brandPolicy[locale];

      integrations.items.forEach((integration) => {
        addIntegration(integration);
      });
    })
    .catch((error) => console.error("Error loading list.json:", error));
}

function addActivity(activity) {
  console.log("Adding activity", activity);
  if (activity.info.locales && locale in activity.info.locales) {
    if (needsFloorFilter && activity.needsFloor === true) return;

    const title = activity.info.locales[locale].title || "";
    if (title === "") return;

    const description = activity.info.locales[locale].description || "";
    let icon = "./data/activities/" + activity.id + ".png";

    let model = getActivityModel(activity);

    const activityDiv = document.createElement("div");
    activityDiv.classList.add("item");

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
          parametersHTML += `<li><b>${param.text}</b>: <div class="button">${param.label || t("button")}</div></li>`;
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
                      <span>${model}</span>
                      <p>${description}</p>
                      ${parametersHTML}
                  </div>
              `;

    activitiesList.appendChild(activityDiv);
  } else {
    console.log("No locale found for activity", activity.id);
  }
}

function addIntegration(integration) {
  if (integration.locales && locale in integration.locales) {
    const title = integration.locales[locale].title || "";
    if (title === "") return;

    const description = integration.locales[locale].description || "";
    let icon = "./data/integrations/integration_" + integration.id + ".png";

    const integrationDiv = document.createElement("div");
    integrationDiv.classList.add("item");

    integrationDiv.innerHTML = `
                  <div class="image">
                      <img src="${icon}" alt="${title}">
                  </div>
                  <div class="info">
                      <h3>${title}</h3>
                      <p>${description}</p>
                  </div>
              `;
    integrationsContainer.appendChild(integrationDiv);
  } else {
    console.log("No locale found for integration", integration.id);
  }
}

function getActivityModel(activity) {
  //modelID is activity.model as an array of models, get each modelID, translate it using categories.model[id][locale] and join them with a comma
  let model = "";
  if (activity.model) {
    model = activity.model.map((modelID) => categories.model[modelID][locale] || "").join(", ");
  }

  return model;
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
    paletteHTML += `<div style="background-color:${color.color}" class="color ${color.selected ? "selected" : ""}"></div>`;
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
  if (urlParams.has("i")) {
    incorporatedSite = true;
  }
}

function printWithParameters(value) {
  if (value) {
    // Add the selected style
    document.getElementById("mainBody").classList.add("printWithParameters");
    //add open details
    document.querySelectorAll("details").forEach((details) => {
      details.setAttribute("open", "");
    });
  } else {
    // Remove the selected style
    document.getElementById("mainBody").classList.remove("printWithParameters");
    //remove open details
    document.querySelectorAll("details").forEach((details) => {
      details.removeAttribute("open");
    });
  }

  // Print after a short delay
  setTimeout(() => {
    //get when the print window is closed
    window.onafterprint = function () {
      // Remove the selected style
      document.getElementById("mainBody").classList.remove("printWithParameters");
      //remove open details
      document.querySelectorAll("details").forEach((details) => {
        details.removeAttribute("open");
      });
    };
    window.print();
  }, 500);
}
