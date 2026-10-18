# Troll-Quizzy

Troll-Quizzy is a modular, client-side web quiz application designed to deliver dynamic quiz sessions ranging from lighthearted humor and riddles to satirical and existential "troll" challenges. Built with vanilla web technologies, the application emphasizes zero external runtime dependencies, modular dataset partitioning, and an engaging user interface.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture and Directory Structure](#architecture-and-directory-structure)
- [Dataset Organization](#dataset-organization)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation and Execution](#installation-and-execution)
- [Configuration and Customization](#configuration-and-customization)
- [Tech Stack](#tech-stack)
- [License](#license)
- [Author](#author)

---

## Overview

Troll-Quizzy offers two distinct gameplay styles:

1. **Standard Humor Mode**: Whimsical, accessible questions covering puns, classic jokes, office humor, riddles, and geek culture.
2. **Troll Mode**: Irreverent, satirical, and mind-bending questions that challenge conventional quiz logic.

The application dynamically streams and caches category datasets from standalone JSON files, calculates available question pools, shuffles questions deterministically per session, and tracks user progress through a real-time progress indicator.

---

## Key Features

- **Multi-Mode Engine**: Switch between family-friendly humor and satirical troll challenges.
- **Dynamic Content Loading**: Questions are structured in modular JSON banks and fetched asynchronously with client-side caching to minimize network overhead.
- **Configurable Sessions**: Users can define their nickname, select specific themes or mix all categories, and adjust the total number of questions within the available pool limits.
- **Content Disclaimer Modal**: An interactive onboarding modal ensures players are aware of the satirical and dark-humor nature of the troll mode before starting.
- **Responsive Dark Theme**: Modern dark-mode interface built with CSS custom properties, responsive layouts, and SVG vector iconography.
- **Zero Runtime Dependencies**: Pure vanilla JavaScript, HTML5, and CSS3 without framework overhead or build steps.

---

## Architecture and Directory Structure

The repository is structured as a decoupled static web application:

```
troll-quizzy/
├── data/
│   ├── blagues_classiques.json   # Classic jokes and punchlines
│   ├── culture_geek_fun.json     # Tech, developer, and pop culture questions
│   ├── devinettes_drole.json     # Riddles and witty brainteasers
│   ├── humour_noir_troll.json    # Satirical and dark-humor troll questions
│   ├── humour_quotidien.json     # Workplace and daily life humor
│   └── jeux_de_mots.json         # Wordplay and animal puns
├── index.html                    # Main HTML entry point and UI layout
├── licence.yaml                  # Structured license metadata (MIT)
├── main.js                       # Core application state, event handlers, and quiz engine
├── questions.json                # Master archive dataset
├── styles.css                    # Design system, theme variables, and layout rules
├── troll.png                     # Visual brand asset and favicon
└── README.md                     # Project documentation
```

---

## Dataset Organization

Questions are stored as JSON arrays containing question objects. Each item adheres to the following specification:

```json
{
  "theme": "Category or Subcategory Name",
  "question": "Question text displayed to the user",
  "choices": [
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4"
  ],
  "correct": 0,
  "explanation": "Contextual feedback or comedic explanation displayed after answering"
}
```

- **`theme`** *(string)*: Identifier or label of the category.
- **`question`** *(string)*: The prompt text.
- **`choices`** *(array of strings)*: Available answers presented to the player.
- **`correct`** *(number)*: 0-indexed integer pointing to the intended answer in the `choices` array.
- **`explanation`** *(string)*: Explanation, punchline, or follow-up comment shown upon submission.

---

## Getting Started

### Prerequisites

A modern web browser supporting ES6 modules and standard web APIs (Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari).

### Installation and Execution

Because Troll-Quizzy loads question datasets asynchronously using the Fetch API, the files must be served over HTTP/HTTPS rather than opened directly via the `file://` protocol.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Badley08/troll-quizzy.git
   cd troll-quizzy
   ```

2. **Serve the project locally:**

   You can use any local development server:

   - **Using Python 3:**
     ```bash
     python3 -m http.server 8000
     ```

   - **Using Node.js (npx):**
     ```bash
     npx serve .
     ```

   - **Using PHP:**
     ```bash
     php -S localhost:8000
     ```

   - **Using VS Code Live Server**: Right-click `index.html` and select **Open with Live Server**.

3. **Open the application:**
   Navigate to `http://localhost:8000` (or the port provided by your server) in your browser.

---

## Configuration and Customization

Application settings, mode mappings, and theme bindings are located in the `QUIZ_CONFIG` object inside `main.js`:

```javascript
const QUIZ_CONFIG = {
  normal: {
    label: "Mode Humour Normal",
    themes: [
      {
        id: "all_normal",
        name: "Tous les themes (Mix complet)",
        files: [
          "data/blagues_classiques.json",
          "data/devinettes_drole.json",
          "data/humour_quotidien.json",
          "data/jeux_de_mots.json",
          "data/culture_geek_fun.json"
        ]
      }
      // Additional themes...
    ]
  },
  troll: {
    label: "Mode Troll & Humour Noir",
    themes: [
      {
        id: "all_troll",
        name: "Tous les themes trolls",
        files: ["data/humour_noir_troll.json"]
      }
    ]
  }
};
```

To add new categories:
1. Create a corresponding JSON file in the `data/` directory matching the schema.
2. Register the file path and metadata in `QUIZ_CONFIG` within `main.js`.

---

## Tech Stack

- **Markup**: Semantic HTML5 with accessibility considerations (`role="dialog"`, ARIA attributes).
- **Styling**: Vanilla CSS3, CSS custom properties (variables), Flexbox, CSS Grid.
- **Scripting**: Vanilla JavaScript (ES6+), Fetch API, DOM manipulation, client-side caching.
- **Data Format**: Standard JSON.

---

## License

This project is licensed under the MIT License. See [licence.yaml](file:///home/luberisse/Bureau/WORKSPACE/troll-quizzy/licence.yaml) for full copyright and permission terms.

---

## Author

Developed by **Karlito**.
