const darkThemeBtn = document.getElementById("darkThemeBtn");
const lightThemeBtn = document.getElementById("lightThemeBtn");
const systemThemeBtn = document.getElementById("systemThemeBtn");

function applyTheme(theme) {
    document.body.classList.remove("light-mode", "dark-mode");
    darkThemeBtn.classList.remove("active");
    lightThemeBtn.classList.remove("active");
    systemThemeBtn.classList.remove("active");
    if (theme === "dark") {
        document.body.classList.add("dark-mode");
        darkThemeBtn.classList.add("active");
    } else if (theme === "system") {
        systemThemeBtn.classList.add("active");
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
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

function closeDropdown(toggle, dropdown) {
    dropdown.classList.remove("show");
    toggle.setAttribute("aria-expanded", "false");
}

function openDropdown(toggle, dropdown) {
    dropdown.classList.add("show");
    toggle.setAttribute("aria-expanded", "true");
}

// Restore saved theme (default to system)
applyTheme(localStorage.getItem("theme") || "system");

// Load content fragment safely using DOMParser to prevent XSS
function loadContent(url) {
    fetch(url)
        .then((response) => {
            if (!response.ok) throw new Error("Failed to load: " + url);
            return response.text();
        })
        .then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const main = document.querySelector("main");
            main.innerHTML = "";
            for (const child of doc.body.children) {
                main.appendChild(document.importNode(child, true));
            }
            bindShareControls();
        })
        .catch((error) => console.error("Error loading content:", error));
}

// Handle URL fragments to determine which section to show
function handleFragment() {
    const fragment = window.location.hash.substring(1);
    const allowed = [
        "home", "education", "experiences", "certifications",
        "papers", "projects", "contact", "impressum", "interesting"
    ];
    if (fragment && allowed.includes(fragment)) {
        loadContent(fragment + ".html");
    } else {
        loadContent("home.html");
    }
}

window.addEventListener("hashchange", handleFragment);
handleFragment();

// Toggle navbar on small screens
navbarToggle.addEventListener("click", function (event) {
    if (!navbarDropdown.classList.contains("show")) {
        event.stopPropagation();
        event.preventDefault();
        openDropdown(navbarToggle, navbarDropdown);
    }
});

// Toggle theme dropdown
themeToggle.addEventListener("click", function (event) {
    if (!themeDropdown.classList.contains("show")) {
        event.stopPropagation();
        event.preventDefault();
        openDropdown(themeToggle, themeDropdown);
    }
});

// Close dropdowns when clicking outside
document.addEventListener("click", function () {
    closeDropdown(navbarToggle, navbarDropdown);
    closeDropdown(themeToggle, themeDropdown);
});

// Theme buttons via data-theme attribute
document.querySelectorAll("[data-theme]").forEach(function (btn) {
    btn.addEventListener("click", function () {
        applyTheme(this.dataset.theme);
    });
});

// Language switch via data-lang attribute
document.querySelectorAll("[data-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () {
        changeLanguage(this.dataset.lang);
    });
});

function changeLanguage(language) {
    let href = "index.html";
    let currentLanguage = "en";
    try {
        const parts = window.location.href.split("/");
        currentLanguage = parts[parts.length - 2];
    } catch (e) {
        console.log("Error parsing current language from URL");
    }
    if (currentLanguage === language) return;
    localStorage.setItem("language", language);
    switch (language) {
        case "de":
            href = "./de/index.html";
            break;
        default:
            href = "index.html";
    }
    if (href === "index.html" && currentLanguage !== "en") {
        href = "../index.html";
    }
    const fragment = window.location.hash;
    if (fragment) href += fragment;
    window.location.href = href;
}

function bindShareControls() {
    document.querySelectorAll("[data-copy-text]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const text = this.dataset.copyText;
            const status = this.closest(".share-item")?.querySelector(".copy-status");

            function setStatus(message) {
                if (status) status.textContent = message;
            }

            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text)
                    .then(() => setStatus("Copied"))
                    .catch(() => setStatus("Copy failed"));
            } else {
                setStatus("Copy this manually");
            }
        });
    });
}
