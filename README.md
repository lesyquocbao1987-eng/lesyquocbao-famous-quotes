# 100 Famous Quotes Web Application

A responsive web application built with **Python Flask**, **Vanilla JavaScript**, and **HTML5/CSS3** to explore, search, and generate random quotes from a curated collection of 100 well-known quotes.

![Python](https://img.shields.io/badge/Python-3.14-3776AB?logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.x-000000?logo=flask&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black)

## Features

- **Random Quote Generator**: Generates random quotes with smooth animations; supports pressing <kbd>Space</kbd> for the next quote.
- **Search & Filter**:
  - Instant debounced text search across quotes and authors.
  - Category filtering (*Inspiration*, *Wisdom*, *Science*, *Leadership*, *Life*, *Philosophy*, *Humor*, *Courage*, *Success*).
  - Filter by specific authors.
- **One-Click Copy**: Copy formatted quotes directly to the clipboard with toast feedback.
- **Modern Responsive Design**: Clean card interface supporting dark mode preferences and mobile/desktop layouts.
- **RESTful API**: Endpoints for quotes, categories, and authors.

## Project Structure

```
famous-quotes/
├── app.py                 # Flask server & REST API
├── requirements.txt       # Dependencies
├── .gitignore             # Git ignore rules
├── data/
│   └── quotes.json        # Curated dataset of 100 famous quotes
├── static/
│   ├── css/
│   │   └── style.css      # Vanilla CSS styling
│   └── js/
│       └── app.js         # Vanilla JavaScript application logic
├── templates/
│   └── index.html         # HTML5 interface
└── tests/
    └── test_app.py        # Automated test suite
```

## Getting Started

### Prerequisites

- Python 3.10+
- pip

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lesyquocbao1987-eng/lesyquocbao-famous-quotes.git
   cd lesyquocbao-famous-quotes
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # Windows:
   .\.venv\Scripts\activate
   # macOS/Linux:
   source .venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Running the App

```bash
python app.py
```
Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in your browser.

### Running Tests

```bash
pytest tests/ -v
```

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/` | `GET` | Web user interface |
| `/api/quotes/random` | `GET` | Random quote (optional query params: `?category=...&author=...`) |
| `/api/quotes` | `GET` | List quotes with filters (`?q=...&category=...&author=...`) |
| `/api/categories` | `GET` | Categories with quote counts |
| `/api/authors` | `GET` | Authors with quote counts |

## License

MIT
