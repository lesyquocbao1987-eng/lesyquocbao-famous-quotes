# 100 Famous Quotes Web Application

A responsive web application built with **Python Flask**, **Vanilla JavaScript**, and **HTML5/CSS3** to explore, search, and generate random quotes from a curated collection of 100 well-known quotes.

![Python](https://img.shields.io/badge/Python-3.14-3776AB?logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.x-000000?logo=flask&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-Vanilla-1572B6?logo=css3&logoColor=white)
![Pytest](https://img.shields.io/badge/pytest-Passing-brightgreen?logo=pytest&logoColor=white)

---

## Features

### User Interface & Experience
- **Random Quote Hero**: Prominently displays a featured quote with smooth fade animations, author avatar initials, and category badges.
- **Keyboard Shortcut**: Press <kbd>Space</kbd> anywhere on the page (outside input fields) to instantly fetch a new random quote.
- **Search & Filter**:
  - **Debounced Live Search**: Real-time searching across quotes, authors, and categories with a 250ms debounce for high performance.
  - **Category Pills**: Quick filter tabs showing live quote counts per category (*Inspiration*, *Wisdom*, *Science*, *Leadership*, *Life*, *Philosophy*, *Humor*, *Courage*, *Success*).
  - **Author Dropdown**: Filter quotes by author, complete with count indicators.
  - **Quick Author Click**: Clicking any author name on any card in the gallery automatically filters the entire view by that author.
  - **Empty State**: Friendly fallback when no matching quotes are found, with a one-click "Reset All Filters" button.
- **Clipboard Integration**: One-click "Copy to Clipboard" button on every quote card and hero card with inline "Copied!" visual feedback and toast notifications.
- **Export to CSV**: Download matching or all quotes directly to a CSV file (with Excel UTF-8 BOM encoding and dynamic file naming, e.g., `famous_quotes_science.csv`).
- **Adaptive Design**: Fully responsive layout (mobile, tablet, desktop) with automatic **Dark Mode** support based on user OS preferences.

### Backend & API
- **Lightweight Flask Architecture**: Zero external frontend build tools, powered by clean Python routing.
- **Fast In-Memory Filtering**: JSON-backed dataset with case-insensitive search and parameter-based querying.
- **CSV Export Engine**: Programmatic and browser-accessible CSV generation via `/api/quotes/csv`.
- **Automated Test Suite**: 12 unit tests covering dataset integrity, route responses, CSV exports, and edge cases.

---

## Project Structure

```
famous-quotes/
├── app.py                 # Flask server & REST API endpoints
├── requirements.txt       # Python dependencies (Flask, pytest)
├── .gitignore             # Git ignore rules for Python, venv, and OS files
├── data/
│   └── quotes.json        # Curated dataset of 100 famous quotes
├── static/
│   ├── css/
│   │   └── style.css      # Vanilla CSS (variables, grid, dark mode, animations)
│   └── js/
│       └── app.js         # Vanilla JavaScript (state management, API calls, DOM)
├── templates/
│   └── index.html         # Semantic HTML5 template
└── tests/
    └── test_app.py        # Automated pytest suite
```

---

## Getting Started

### Prerequisites

- **Python 3.10+** (Tested on Python 3.14)
- **pip** package manager

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/lesyquocbao1987-eng/lesyquocbao-famous-quotes.git
   cd lesyquocbao-famous-quotes
   ```

2. **Create and activate a virtual environment**:
   ```powershell
   # Windows (PowerShell):
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1

   # macOS / Linux:
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

### Running the Application

Start the Flask server:
```bash
python app.py
```
Open **[http://127.0.0.1:5000](http://127.0.0.1:5000)** in your browser.

### Running the Test Suite

Run the unit tests with `pytest`:
```bash
pytest tests/ -v
```

---

## API Reference

### 1. Web Page
- **`GET /`**
  - **Description**: Serves the single-page HTML interface.

### 2. Get Random Quote
- **`GET /api/quotes/random`**
  - **Query Parameters (Optional)**:
    - `category`: Filter random pool by category (e.g. `Science`, `Wisdom`).
    - `author`: Filter random pool by author name (e.g. `Albert Einstein`).
  - **Sample Response** (`200 OK`):
    ```json
    {
      "id": 2,
      "quote": "In the middle of difficulty lies opportunity.",
      "author": "Albert Einstein",
      "category": "Science"
    }
    ```

### 3. List & Filter Quotes
- **`GET /api/quotes`**
  - **Query Parameters (Optional)**:
    - `q`: Search keyword matching quote text, author, or category.
    - `category`: Category name or `all`.
    - `author`: Author name or `all`.
  - **Sample Response** (`200 OK`):
    ```json
    {
      "total": 1,
      "quotes": [
        {
          "id": 2,
          "quote": "In the middle of difficulty lies opportunity.",
          "author": "Albert Einstein",
          "category": "Science"
        }
      ]
    }
    ```

### 4. Export Quotes to CSV
- **`GET /api/quotes/csv`**
  - **Query Parameters (Optional)**:
    - `q`: Search keyword matching quote text, author, or category.
    - `category`: Category name or `all`.
    - `author`: Author name or `all`.
  - **Sample Response** (`200 OK`, `Content-Type: text/csv`):
    ```csv
    "ID","Quote","Author","Category"
    "2","In the middle of difficulty lies opportunity.","Albert Einstein","Science"
    ...
    ```

### 5. Categories Metadata
- **`GET /api/categories`**
  - **Sample Response** (`200 OK`):
    ```json
    [
      { "name": "Courage", "count": 10 },
      { "name": "Humor", "count": 5 },
      { "name": "Inspiration", "count": 14 },
      { "name": "Leadership", "count": 10 },
      { "name": "Life", "count": 8 },
      { "name": "Philosophy", "count": 12 },
      { "name": "Science", "count": 11 },
      { "name": "Success", "count": 10 },
      { "name": "Wisdom", "count": 20 }
    ]
    ```

### 5. Authors Metadata
- **`GET /api/authors`**
  - **Sample Response** (`200 OK`):
    ```json
    [
      { "name": "Albert Einstein", "count": 6 },
      { "name": "Aristotle", "count": 4 },
      { "name": "Confucius", "count": 4 },
      ...
    ]
    ```

---

## License

This project is licensed under the MIT License.
