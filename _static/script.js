const darkThemeBtn = document.getElementById("darkThemeBtn");
const lightThemeBtn = document.getElementById("lightThemeBtn");
const systemThemeBtn = document.getElementById("systemThemeBtn");

function applyTheme(theme) {
    document.body.classList.remove("light-mode", "dark-mode", "system-theme");
    if (theme === "dark") {
        document.body.classList.add("dark-mode");
        darkThemeBtn.classList.add("active");
    } else if (theme === "system") {
        systemThemeBtn.classList.add("active");
        const prefersDarkScheme = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
        if (prefersDarkScheme) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.add("light-mode");
        }
    } else {
        lightThemeBtn.classList.add("active");
        document.body.classList.add("light-mode");
    }
    localStorage.setItem("theme", theme);
}

const navbarToggle = document.querySelector(".nav.dropdown-toggle");
const navbarDropdown = document.querySelector(".nav.dropdown");
const themeToggle = document.querySelector(".theme.dropdown-toggle");
const themeDropdown = document.querySelector(".theme.dropdown");

// Set initial theme based on the current selection or localStorage
const savedTheme = localStorage.getItem("theme") || themeToggle.value;
applyTheme(savedTheme);

// Function to load content dynamically
function loadContent(url) {
    fetch(url)
        .then((response) => response.text())
        .then((data) => {
            document.querySelector("main").innerHTML = data;
        })
        .catch((error) => console.error("Error loading content:", error));
}

// Function to handle URL fragments
function handleFragment() {
    const fragment = window.location.hash.substring(1);
    if (fragment) {
        loadContent(fragment + ".html");
    } else {
        loadContent("home.html");
    }
}

// Event listener for URL hash changes
window.addEventListener("hashchange", handleFragment);

// Load content based on the current URL fragment
handleFragment();

// Toggle navbar on small screens
navbarToggle.addEventListener("click", function (event) {
    if (!navbarDropdown.classList.contains("show")) {
        event.stopPropagation();
        event.preventDefault();
        navbarDropdown.classList.add("show");
    }
});

// Toggle theme dropdown
themeToggle.addEventListener("click", function (event) {
    if (!themeDropdown.classList.contains("show")) {
        event.stopPropagation();
        event.preventDefault();
        themeDropdown.classList.add("show");
    }
});

// Close dropdowns when clicking outside
document.addEventListener("click", function (event) {
    if (navbarDropdown.classList.contains("show")) {
        navbarDropdown.classList.remove("show");
        event.stopPropagation();
    }
    if (themeDropdown.classList.contains("show")) {
        themeDropdown.classList.remove("show");
        event.stopPropagation();
    }
});

// Language change functionality
function changeLanguage(language) {
    let href = "index.html";
    let currentLanguage = "en";
    try {
        currentHref = window.location.href;
        currentLanguage =
            currentHref.split("/")[currentHref.split("/").length - 2];
    } catch (e) {
        console.log("Error parsing current language from URL");
    }
    if (currentLanguage === language) {
        return;
    }
    localStorage.setItem("language", language);
    switch (language) {
        case "de":
            href = "./de/index.html";
            break;
        default:
            href = "index.html";
    }
    if (href == "index.html" && currentLanguage !== "en") {
        href = "../index.html";
    }
    // Get current fragment for persistence
    const fragment = window.location.hash;
    if (fragment) {
        href += fragment;
    }
    window.location.href = href;
}
