const homeView = document.getElementById("home-view");
const detailView = document.getElementById("detail-view");
const themeToggleBtn = document.getElementById("theme-toggle");
const themeTextSpan = document.getElementById("theme-text");
const searchInput = document.getElementById("search-input");
const filterContainer = document.getElementById("filter-container");
const filterDropdownHeader = document.getElementById("filter-dropdown-header");
const filterOptionsContainer = document.getElementById("filter-options");
const filterTextLabel = document.getElementById("filter-text");
const countriesGrid = document.getElementById("countries-grid");
const gridLoadingMessage = document.getElementById("loading-message");
const gridErrorMessage = document.getElementById("error-message");
const noResultsMessage = document.getElementById("no-results-message");
const backButton = document.getElementById("back-button");
const countryDetailContent = document.getElementById("country-detail-content");
const detailLoadingMessage = document.getElementById("detail-loading-message");
const detailErrorMessage = document.getElementById("detail-error-message");

const API_BASE_URL = "https://restcountries.com/v3.1";
let countriesData = [];
let selectedRegion = "All";
let searchQuery = "";
let isFetchingData = false;

function initApp() {
  setupThemeToggle();
  setupEventListeners();
  handleRoute();
}

window.addEventListener("popstate", handleRoute);
document.addEventListener("DOMContentLoaded", initApp);

function navigateTo(path) {
  history.pushState(null, "", path);
  handleRoute();
}

function handleRoute() {
  const path = window.location.pathname;

  if (path === "/" || path === "/index.html") {
    renderHomeView();
  } else {
    const countryCode = decodeURIComponent(path.slice(1));
    if (countryCode?.length === 3) {
      renderDetailView(countryCode);
    } else {
      navigateTo("/");
    }
  }
}

function setupThemeToggle() {
  const userTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)") ? "dark" : "light");

  applyTheme(userTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = document.body.getAttribute("data-theme");
      const newTheme = currentTheme === "light" ? "dark" : "light";
      applyTheme(newTheme);
    });
  }
}

function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  themeTextSpan.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
  themeToggleBtn.setAttribute(
    "aria-label",
    `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`,
  );
}

function setupEventListeners() {
  searchInput.addEventListener("input", (event) => {
    searchQuery = event.target.value.trim().toLowerCase();
    filterAndRenderGrid();
  });
  filterDropdownHeader.addEventListener("click", (event) => {
    event.stopPropagation();
    const isActive = filterContainer.classList.toggle("active");
    filterDropdownHeader.setAttribute("aria-expanded", isActive);
  });
  document.addEventListener("click", (event) => {
    if (
      !filterContainer.contains(event.target) &&
      filterContainer.classList.contains("active")
    ) {
      filterContainer.classList.remove("active");
      filterDropdownHeader.setAttribute("aria-expanded", "false");
    }
  });
  filterOptionsContainer.addEventListener("click", (event) => {
    if (event.target.tagName === "LI") {
      selectedRegion = event.target.dataset.region;
      filterTextLabel.textContent =
        selectedRegion !== "All"
          ? event.target.textContent
          : "Filter by Region";
      Array.from(filterOptionsContainer.children).forEach((li) =>
        li.classList.remove("selected"),
      );
      event.target.classList.add("selected");
      filterContainer.classList.remove("active");
      filterDropdownHeader.setAttribute("aria-expanded", "false");
      filterAndRenderGrid();
    }
  });
  backButton.addEventListener("click", () => {
    navigateTo("/");
  });
}

async function renderHomeView() {
  detailView.classList.add("hidden");
  homeView.classList.remove("hidden");

  if (countriesData.length === 0 && !isFetchingData) {
    await fetchAllCountries();
  } else if (countriesData.length > 0) {
    filterAndRenderGrid();
  }
}

async function fetchAllCountries() {
  isFetchingData = true;
  toggleElementVisiblity(gridLoadingMessage, true);
  toggleElementVisiblity(gridErrorMessage, false);
  toggleElementVisiblity(noResultsMessage, false);
  countriesGrid.innerHTML = "";

  try {
    const response = await fetch(
      `${API_BASE_URL}/all?fields=name,flags,cca3,population,region,capital`,
    );
    if (!response.ok) throw new Error("Failed to fetch data");

    countriesData = await response.json();
    filterAndRenderGrid();
  } catch (error) {
    console.error("Error fetching all countries:", error);
    toggleElementVisiblity(gridErrorMessage, true);
  } finally {
    isFetchingData = false;
    toggleElementVisiblity(gridLoadingMessage, false);
  }
}

function filterAndRenderGrid() {
  if (homeView.classList.contains("hidden")) return;

  if (countriesData.length === 0) return;
  const filteredArray = countriesData.filter((country) => {
    const matchesSearch = country.name.common
      .toLowerCase()
      .includes(searchQuery);
    const matchesRegion =
      selectedRegion === "All" || country.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });
  countriesGrid.innerHTML = "";

  if (filteredArray.length === 0) {
    toggleElementVisiblity(noResultsMessage, true);
  } else {
    toggleElementVisiblity(noResultsMessage, false);

    const fragment = document.createDocumentFragment();
    filteredArray.forEach((country) => {
      fragment.appendChild(createCountryCardDOM(country));
    });

    countriesGrid.appendChild(fragment);
  }
}

function createCountryCardDOM(country) {
  const card = document.createElement("article");
  card.classList.add("country-card");
  card.dataset.countryCode = country.cca3;
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `View details for ${country.name.common}`);

  const capitalStr =
    country.capital && country.capital.length > 0 ? country.capital[0] : "N/A";

  card.innerHTML = `
        <img src="${country.flags.png}" alt="Flag of ${country.name.common}" loading="lazy">
        <div class="card-info">
            <h2>${country.name.common}</h2>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <p><strong>Capital:</strong> ${capitalStr}</p>
        </div>
    `;
  card.addEventListener("click", () =>
    navigateTo(`/${encodeURIComponent(country.cca3)}`),
  );
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigateTo(`/${encodeURIComponent(country.cca3)}`);
    }
  });

  return card;
}
async function renderDetailView(countryCode) {
  homeView.classList.add("hidden");
  detailView.classList.remove("hidden");
  countryDetailContent.innerHTML = "";
  toggleElementVisiblity(detailLoadingMessage, true);
  toggleElementVisiblity(detailErrorMessage, false);

  try {
    const response = await fetch(
      `${API_BASE_URL}/alpha/${encodeURIComponent(countryCode)}?fields=name,flags,population,region,subregion,capital,tld,currencies,languages,borders`,
    );

    if (!response.ok) throw new Error("Country details fetch failed");

    const countryData = await response.json();

    let borderTagsHTML = "<p>N/A</p>";
    if (countryData.borders && countryData.borders.length > 0) {
      borderTagsHTML = await generateBorderTags(countryData.borders);
    }

    const nativeNameKey = countryData.name.nativeName
      ? Object.keys(countryData.name.nativeName)[0]
      : null;
    const nativeName = nativeNameKey
      ? countryData.name.nativeName[nativeNameKey].common
      : countryData.name.common;

    const currencies = countryData.currencies
      ? Object.values(countryData.currencies)
          .map((c) => c.name)
          .join(", ")
      : "N/A";

    const languages = countryData.languages
      ? Object.values(countryData.languages).join(", ")
      : "N/A";

    const capitalStr =
      countryData.capital && countryData.capital.length > 0
        ? countryData.capital[0]
        : "N/A";
    const tldStr =
      countryData.tld && countryData.tld.length > 0
        ? countryData.tld[0]
        : "N/A";

    countryDetailContent.innerHTML = `
            <img src="${countryData.flags.svg || countryData.flags.png}" alt="Flag of ${countryData.name.common}" class="detail-flag">
            <div class="detail-info">
                <h2>${countryData.name.common}</h2>
                <div class="info-columns">
                    <div class="info-column">
                        <p><strong>Native Name:</strong> ${nativeName}</p>
                        <p><strong>Population:</strong> ${countryData.population.toLocaleString()}</p>
                        <p><strong>Region:</strong> ${countryData.region}</p>
                        <p><strong>Sub Region:</strong> ${countryData.subregion || "N/A"}</p>
                        <p><strong>Capital:</strong> ${capitalStr}</p>
                    </div>
                    <div class="info-column">
                        <p><strong>Top Level Domain:</strong> ${tldStr}</p>
                        <p><strong>Currencies:</strong> ${currencies}</p>
                        <p><strong>Languages:</strong> ${languages}</p>
                    </div>
                </div>
                <div class="border-countries">
                    <h3>Border Countries:</h3>
                    <div class="border-tags">
                        ${borderTagsHTML}
                    </div>
                </div>
            </div>
        `;
    const borderButtons = countryDetailContent.querySelectorAll(
      ".border-country-tag",
    );
    borderButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const targetCode = e.target.dataset.countryCode;
        if (targetCode) navigateTo(`/${encodeURIComponent(targetCode)}`);
      });
    });
  } catch (error) {
    console.error("Error loading detail view:", error);
    toggleElementVisiblity(detailErrorMessage, true);
  } finally {
    toggleElementVisiblity(detailLoadingMessage, false);
  }
}

async function generateBorderTags(borderCodesArray) {
  let resolvedNames = [];
  if (countriesData && countriesData.length > 0) {
    resolvedNames = borderCodesArray.map((code) => {
      const found = countriesData.find((c) => c.cca3 === code);
      return found ? { code, name: found.name.common } : { code, name: code };
    });
  } else {
    try {
      const joinedCodes = borderCodesArray.join(",");
      const response = await fetch(
        `${API_BASE_URL}/alpha?codes=${joinedCodes}&fields=cca3,name`,
      );
      if (response.ok) {
        const batchData = await response.json();
        resolvedNames = borderCodesArray.map((code) => {
          const found = batchData.find((c) => c.cca3 === code);
          return found
            ? { code, name: found.name.common }
            : { code, name: code };
        });
      } else {
        throw new Error("Could not fetch border names batch.");
      }
    } catch (e) {
      console.error("Border names fallback failed:", e);
      resolvedNames = borderCodesArray.map((code) => ({ code, name: code }));
    }
  }

  return resolvedNames
    .map(
      (info) => `
        <button class="border-country-tag" data-country-code="${info.code}">
            ${info.name}
        </button>
    `,
    )
    .join("");
}

function toggleElementVisiblity(element, isVisible) {
  if (isVisible) {
    element.classList.remove("hidden");
  } else {
    element.classList.add("hidden");
  }
}
