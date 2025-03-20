let currentLang = 'it'; // Default italiano

const translations = {
    it: {
        title: "Trova la mia posizione",
        findButton: "Trova la mia posizione",
        locating: "Sto localizzando...",
        error: "Non è stato possibile rilevare la tua posizione.",
        notSupported: "La geolocalizzazione non è disponibile sul tuo browser",
        popupText: "Sei qui!",
        coordinates: "Latitudine: {{lat}} °, Longitudine: {{lon}} °"
    },
    en: {
        title: "Find My Location",
        findButton: "Find My Location",
        locating: "Locating...",
        error: "Unable to retrieve your location",
        notSupported: "Geolocation is not supported by your browser",
        popupText: "You are here!",
        coordinates: "Latitude: {{lat}} °, Longitude: {{lon}} °"
    }
};

function switchLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    updateTexts();
}

function updateTexts() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = translations[currentLang][key];
    });
}

function geoFindMe() {
    const status = document.querySelector("#status");
    const mapLink = document.querySelector("#map-link");
    const btn = document.getElementById("find-me");
    let map = null;
    let marker = null;

    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status"></span> ${translations[currentLang].locating}`;

    function resetButton() {
        btn.disabled = false;
        btn.innerHTML = translations[currentLang].findButton;
    }

    function onsuccess(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        status.textContent = "";
        mapLink.href = `https://www.openstreetmap.org/#map=18/${lat}/${lon}`;
        mapLink.textContent = translations[currentLang].coordinates
            .replace("{{lat}}", lat.toFixed(4))
            .replace("{{lon}}", lon.toFixed(4));

        if (!map) {
            map = L.map('map').setView([lat, lon], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
        } else {
            map.setView([lat, lon], 13);
        }

        if (marker) map.removeLayer(marker);
        marker = L.marker([lat, lon]).addTo(map)
            .bindPopup(translations[currentLang].popupText).openPopup();

        resetButton();
    }

    function onerror(error) {
        status.textContent = translations[currentLang].error;
        resetButton();
    }

    if (navigator.geolocation) {
        status.textContent = translations[currentLang].locating;
        navigator.geolocation.getCurrentPosition(onsuccess, onerror);
    } else {
        status.textContent = translations[currentLang].notSupported;
        resetButton();
    }
}

// Inizializza la lingua al caricamento
document.addEventListener('DOMContentLoaded', () => {
    updateTexts();
});