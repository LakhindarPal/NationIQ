# NationIQ 🌍

![Preview](./assets/preview.jpg)

**NationIQ** is an interactive world explorer web application that helps you discover and learn about countries around the globe. Find flags, population data, capitals, currencies, languages, and more with a simple, responsive, and pixel-perfect interface.

[![Frontend Mentor Challenge](<https://img.shields.io/badge/Frontend%20Mentor-Challenge-hsl(212%2C%20100%25%2C%2050%25)?style=for-the-badge&logo=frontendmentor>)](https://www.frontendmentor.io/challenges/rest-countries-api-with-color-theme-switcher-5cacc469fec04111f7b848ca)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)]()
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)]()
[![Vanilla JS](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)]()

---

## ✨ Features

- **Global Country Explorer**: View all countries fetched live from the [REST Countries API](https://restcountries.com/).
- **Live Search**: Instantly find countries by typing their name in the search bar.
- **Region Filtering**: Easily filter countries by specific global regions (Africa, Americas, Asia, Europe, Oceania).
- **Detailed Country Information**: Click on any country to view deep insights, including native name, languages, currencies, and Top Level Domain.
- **Border Navigation**: Discover neighboring countries and navigate directly to their details.
- **Dark/Light Mode**: Toggle between light and dark themes with the UI preference saved in local storage.
- **Responsive Design**: A fluid layout optimized for both mobile and desktop screens.

## 🚀 Getting Started

### Prerequisites

You just need a modern web browser to run this application. No build-tools or package managers are required!

### Installation & Local Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/LakhindarPal/NationIQ.git
   cd NationIQ
   ```

2. **Run a local server:**
   Since the app uses ES Modules (`type="module"` in the `<script>` tag), you need to serve the files over HTTP rather than opening `index.html` directly to avoid CORS issues.

   You can use Python's built-in server:

   ```bash
   python3 -m http.server 8000
   ```

   Or Node's `http-server`:

   ```bash
   npx http-server
   ```

3. **Open the app:**
   Navigate to `http://localhost:8000` in your web browser.

## 🛠️ Built With

- **Semantic HTML5** - structured and accessible markup
- **Vanilla CSS3** - custom properties, Grid, and Flexbox for modern layouts
- **Vanilla JavaScript (ES6+)** - modules, async/await, and DOM manipulation
- **REST Countries API** - data source
- **Google Fonts** - _Nunito Sans_ for typography

## 🧠 What We Learned

Building NationIQ reinforced several key frontend development concepts:

- **API Integration:** Effectively fetching and handling data from an external REST API, including managing loading states, error handling, and optimizing requests.
- **State Management & Filtering:** Implementing real-time search and multi-select filters without using a heavier framework like React.
- **Client-Side Routing:** Building a custom simple router using `history.pushState` and `popstate` events to navigate between the home and detail views smoothly without page reloads.
- **CSS Architecture:** Refactoring and managing a clean CSS file, ensuring a pixel-perfect match to design mockups while maintaining DRY principles.
- **Responsive Theming:** Implementing an elegant Dark/Light mode toggle that respects system preferences and persists user choices via `localStorage`.

## 🤝 Acknowledgments

- Challenge provided by [Frontend Mentor](https://www.frontendmentor.io/).
- Country data provided by the [REST Countries API](https://restcountries.com/).
