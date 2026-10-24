import json
import os
import pytest
from app import app, load_quotes, DATA_PATH

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_dataset_integrity():
    """Verify that quotes.json contains exactly 100 quotes with required fields."""
    assert os.path.exists(DATA_PATH), "data/quotes.json file must exist"
    quotes = load_quotes()
    assert len(quotes) == 100, f"Expected 100 quotes, found {len(quotes)}"

    ids = set()
    for q in quotes:
        assert "id" in q and isinstance(q["id"], int)
        assert "quote" in q and len(q["quote"].strip()) > 0
        assert "author" in q and len(q["author"].strip()) > 0
        assert "category" in q and len(q["category"].strip()) > 0
        ids.add(q["id"])

    assert len(ids) == 100, "All quote IDs must be unique"

def test_index_route(client):
    """Verify index HTML route loads successfully."""
    response = client.get("/")
    assert response.status_code == 200
    assert b"100 Well-Known Quotes" in response.data

def test_random_quote_route(client):
    """Verify random quote returns a valid quote."""
    response = client.get("/api/quotes/random")
    assert response.status_code == 200
    data = response.get_json()
    assert "quote" in data
    assert "author" in data
    assert "category" in data

def test_random_quote_filtered(client):
    """Verify random quote with category filter."""
    response = client.get("/api/quotes/random?category=Science")
    assert response.status_code == 200
    data = response.get_json()
    assert data["category"].lower() == "science"

def test_quotes_list_all(client):
    """Verify listing quotes without filters returns all 100."""
    response = client.get("/api/quotes")
    assert response.status_code == 200
    data = response.get_json()
    assert data["total"] == 100
    assert len(data["quotes"]) == 100

def test_quotes_filter_by_author(client):
    """Verify filtering by author."""
    response = client.get("/api/quotes?author=Albert Einstein")
    assert response.status_code == 200
    data = response.get_json()
    assert data["total"] > 0
    for q in data["quotes"]:
        assert q["author"] == "Albert Einstein"

def test_quotes_filter_by_category(client):
    """Verify filtering by category."""
    response = client.get("/api/quotes?category=Philosophy")
    assert response.status_code == 200
    data = response.get_json()
    assert data["total"] > 0
    for q in data["quotes"]:
        assert q["category"] == "Philosophy"

def test_quotes_search_query(client):
    """Verify text search in quotes."""
    response = client.get("/api/quotes?q=imagination")
    assert response.status_code == 200
    data = response.get_json()
    assert data["total"] > 0
    for q in data["quotes"]:
        assert (
            "imagination" in q["quote"].lower()
            or "imagination" in q["author"].lower()
            or "imagination" in q["category"].lower()
        )

def test_categories_endpoint(client):
    """Verify categories metadata endpoint."""
    response = client.get("/api/categories")
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) > 0
    category_names = [item["name"] for item in data]
    assert "Science" in category_names
    assert "Wisdom" in category_names

def test_authors_endpoint(client):
    """Verify authors metadata endpoint."""
    response = client.get("/api/authors")
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) > 0
    author_names = [item["name"] for item in data]
    assert "Albert Einstein" in author_names
