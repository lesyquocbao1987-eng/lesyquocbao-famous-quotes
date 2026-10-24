import csv
import io
import json
import os
import random
from flask import Flask, Response, jsonify, render_template, request

app = Flask(__name__)

DATA_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "quotes.json")

def load_quotes():
    """Loads quotes list from the JSON data file."""
    if not os.path.exists(DATA_PATH):
        return []
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

@app.route("/")
def index():
    """Renders the main page."""
    return render_template("index.html")

@app.route("/api/quotes", methods=["GET"])
def get_quotes():
    """Returns quotes filtered by search query, category, and/or author."""
    quotes = load_quotes()
    query = request.args.get("q", "").strip().lower()
    category = request.args.get("category", "").strip().lower()
    author = request.args.get("author", "").strip().lower()

    filtered = quotes

    if category and category != "all":
        filtered = [q for q in filtered if q.get("category", "").lower() == category]

    if author and author != "all":
        filtered = [q for q in filtered if q.get("author", "").lower() == author]

    if query:
        filtered = [
            q for q in filtered
            if query in q.get("quote", "").lower() or query in q.get("author", "").lower() or query in q.get("category", "").lower()
        ]

    return jsonify({
        "total": len(filtered),
        "quotes": filtered
    })

@app.route("/api/quotes/csv", methods=["GET"])
def export_quotes_csv():
    """Exports filtered quotes as a downloadable CSV file."""
    quotes = load_quotes()
    query = request.args.get("q", "").strip().lower()
    category = request.args.get("category", "").strip().lower()
    author = request.args.get("author", "").strip().lower()

    filtered = quotes

    if category and category != "all":
        filtered = [q for q in filtered if q.get("category", "").lower() == category]

    if author and author != "all":
        filtered = [q for q in filtered if q.get("author", "").lower() == author]

    if query:
        filtered = [
            q for q in filtered
            if query in q.get("quote", "").lower() or query in q.get("author", "").lower() or query in q.get("category", "").lower()
        ]

    output = io.StringIO()
    writer = csv.writer(output, quoting=csv.QUOTE_ALL)
    writer.writerow(["ID", "Quote", "Author", "Category"])
    for q in filtered:
        writer.writerow([q.get("id", ""), q.get("quote", ""), q.get("author", ""), q.get("category", "")])

    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment; filename=famous_quotes.csv"}
    )

@app.route("/api/quotes/random", methods=["GET"])
def get_random_quote():
    """Returns a single random quote, optionally filtered by category or author."""
    quotes = load_quotes()
    category = request.args.get("category", "").strip().lower()
    author = request.args.get("author", "").strip().lower()

    pool = quotes
    if category and category != "all":
        pool = [q for q in pool if q.get("category", "").lower() == category]
    if author and author != "all":
        pool = [q for q in pool if q.get("author", "").lower() == author]

    if not pool:
        return jsonify({"error": "No quotes found matching criteria"}), 404

    selected = random.choice(pool)
    return jsonify(selected)

@app.route("/api/categories", methods=["GET"])
def get_categories():
    """Returns available categories with counts."""
    quotes = load_quotes()
    category_counts = {}
    for q in quotes:
        cat = q.get("category", "General")
        category_counts[cat] = category_counts.get(cat, 0) + 1

    sorted_categories = sorted(category_counts.items(), key=lambda x: x[0])
    return jsonify([
        {"name": name, "count": count} for name, count in sorted_categories
    ])

@app.route("/api/authors", methods=["GET"])
def get_authors():
    """Returns available authors with counts."""
    quotes = load_quotes()
    author_counts = {}
    for q in quotes:
        auth = q.get("author", "Unknown")
        author_counts[auth] = author_counts.get(auth, 0) + 1

    sorted_authors = sorted(author_counts.items(), key=lambda x: x[0])
    return jsonify([
        {"name": name, "count": count} for name, count in sorted_authors
    ])

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
