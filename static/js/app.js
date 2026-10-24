document.addEventListener("DOMContentLoaded", () => {
  // Application State
  const state = {
    heroQuote: null,
    searchQuery: "",
    selectedCategory: "all",
    selectedAuthor: "all",
    debounceTimer: null,
    currentQuotes: []
  };

  // DOM Elements
  const heroCard = document.getElementById("heroCard");
  const heroCategory = document.getElementById("heroCategory");
  const heroQuoteText = document.getElementById("heroQuoteText");
  const heroAuthor = document.getElementById("heroAuthor");
  const heroAvatar = document.getElementById("heroAvatar");
  const randomBtn = document.getElementById("randomBtn");
  const copyHeroBtn = document.getElementById("copyHeroBtn");

  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  const authorSelect = document.getElementById("authorSelect");
  const categoryPillsContainer = document.getElementById("categoryPills");
  const pillAllCount = document.getElementById("pillAllCount");

  const quotesGrid = document.getElementById("quotesGrid");
  const resultsCount = document.getElementById("resultsCount");
  const exportCsvBtn = document.getElementById("exportCsvBtn");
  const emptyState = document.getElementById("emptyState");
  const resetFiltersBtn = document.getElementById("resetFiltersBtn");
  const toast = document.getElementById("toast");

  // Show Toast
  let toastTimer = null;
  function showToast(message) {
    if (toastTimer) clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("show");
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2400);
  }

  // Copy to Clipboard
  async function copyQuote(quoteText, quoteAuthor, clickedBtn = null) {
    const formatted = `"${quoteText}" — ${quoteAuthor}`;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(formatted);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = formatted;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      showToast("Quote copied to clipboard!");

      if (clickedBtn) {
        clickedBtn.classList.add("copied");
        const label = clickedBtn.querySelector(".copy-btn-label, .btn-text");
        const prevText = label ? label.textContent : "";
        if (label) label.textContent = "Copied!";
        setTimeout(() => {
          clickedBtn.classList.remove("copied");
          if (label) label.textContent = prevText;
        }, 1600);
      }
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      showToast("Failed to copy quote.");
    }
  }

  // Fetch Random Quote
  async function fetchRandomQuote() {
    try {
      randomBtn.disabled = true;
      randomBtn.style.opacity = "0.7";

      const params = new URLSearchParams();
      if (state.selectedCategory !== "all") {
        params.append("category", state.selectedCategory);
      }
      if (state.selectedAuthor !== "all") {
        params.append("author", state.selectedAuthor);
      }

      const url = `/api/quotes/random?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        // Fallback to purely random if filtered random has no match
        const fallbackRes = await fetch("/api/quotes/random");
        const fallbackData = await fallbackRes.json();
        renderHeroQuote(fallbackData);
        return;
      }

      const quote = await response.json();
      renderHeroQuote(quote);
    } catch (err) {
      console.error("Error fetching random quote:", err);
    } finally {
      randomBtn.disabled = false;
      randomBtn.style.opacity = "1";
    }
  }

  // Render Hero Quote with Transition
  function renderHeroQuote(quote) {
    state.heroQuote = quote;

    heroQuoteText.style.opacity = "0";
    heroAuthor.style.opacity = "0";

    setTimeout(() => {
      heroQuoteText.textContent = quote.quote;
      heroAuthor.textContent = `— ${quote.author}`;
      heroCategory.textContent = quote.category;
      heroCategory.setAttribute("data-cat", quote.category);

      // Generate avatar initials
      const initials = quote.author
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(n => n[0].toUpperCase())
        .join("");
      heroAvatar.textContent = initials || "?";

      heroQuoteText.style.opacity = "1";
      heroAuthor.style.opacity = "1";
    }, 150);
  }

  // Fetch Quotes List
  async function fetchQuotes() {
    try {
      const params = new URLSearchParams();
      if (state.searchQuery) {
        params.append("q", state.searchQuery);
      }
      if (state.selectedCategory !== "all") {
        params.append("category", state.selectedCategory);
      }
      if (state.selectedAuthor !== "all") {
        params.append("author", state.selectedAuthor);
      }

      const response = await fetch(`/api/quotes?${params.toString()}`);
      const data = await response.json();

      renderQuotesGrid(data.quotes || []);
    } catch (err) {
      console.error("Error fetching quotes list:", err);
    }
  }

  // Render Grid
  function renderQuotesGrid(quotes) {
    state.currentQuotes = quotes;
    resultsCount.textContent = `Showing ${quotes.length} quote${quotes.length === 1 ? "" : "s"}`;

    if (exportCsvBtn) {
      exportCsvBtn.disabled = quotes.length === 0;
      exportCsvBtn.style.opacity = quotes.length === 0 ? "0.5" : "1";
    }

    if (quotes.length === 0) {
      quotesGrid.innerHTML = "";
      emptyState.style.display = "block";
      return;
    }

    emptyState.style.display = "none";
    quotesGrid.innerHTML = quotes
      .map(
        q => `
      <div class="quote-item-card" data-id="${q.id}">
        <div class="item-top">
          <span class="category-badge" data-cat="${escapeHtml(q.category)}">${escapeHtml(q.category)}</span>
          <button class="card-copy-btn" data-quote="${escapeHtml(q.quote)}" data-author="${escapeHtml(q.author)}" title="Copy quote to clipboard" aria-label="Copy quote to clipboard">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span class="copy-btn-label">Copy</span>
          </button>
        </div>
        <blockquote class="item-quote-text">“${escapeHtml(q.quote)}”</blockquote>
        <div class="item-footer">
          <span class="item-author" data-author="${escapeHtml(q.author)}" title="Filter by this author">${escapeHtml(q.author)}</span>
        </div>
      </div>
    `
      )
      .join("");

    // Attach copy button listeners inside cards
    quotesGrid.querySelectorAll(".card-copy-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const text = btn.getAttribute("data-quote");
        const author = btn.getAttribute("data-author");
        copyQuote(text, author, btn);
      });
    });

    // Attach author click to filter by that author
    quotesGrid.querySelectorAll(".item-author").forEach(authorSpan => {
      authorSpan.addEventListener("click", () => {
        const authorName = authorSpan.getAttribute("data-author");
        setAuthorFilter(authorName);
      });
    });
  }

  // Export Quotes to CSV
  function exportToCsv() {
    const quotes = state.currentQuotes || [];
    if (quotes.length === 0) {
      showToast("No quotes to export.");
      return;
    }

    const csvRows = [
      ["ID", "Quote", "Author", "Category"].map(escapeCsvField).join(",")
    ];

    quotes.forEach(q => {
      csvRows.push([
        escapeCsvField(q.id),
        escapeCsvField(q.quote),
        escapeCsvField(q.author),
        escapeCsvField(q.category)
      ].join(","));
    });

    const csvContent = "\uFEFF" + csvRows.join("\r\n"); // UTF-8 BOM
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    let filename = "famous_quotes";
    if (state.selectedCategory && state.selectedCategory !== "all") {
      filename += `_${state.selectedCategory.toLowerCase()}`;
    }
    filename += ".csv";

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Exported ${quotes.length} quotes to ${filename}!`);
  }

  function escapeCsvField(field) {
    if (field === null || field === undefined) return '""';
    const str = String(field);
    return `"${str.replace(/"/g, '""')}"`;
  }

  // Escape HTML helper
  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Load Categories & Authors Metadata
  async function loadMetadata() {
    try {
      const [catRes, authRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/authors")
      ]);

      const categories = await catRes.json();
      const authors = await authRes.json();

      // Total count calculation
      const totalCount = categories.reduce((sum, c) => sum + c.count, 0);
      pillAllCount.textContent = totalCount;

      // Populate Category Pills
      categories.forEach(cat => {
        const pill = document.createElement("button");
        pill.className = "pill";
        pill.setAttribute("role", "radio");
        pill.setAttribute("aria-checked", "false");
        pill.setAttribute("data-category", cat.name);
        pill.innerHTML = `${escapeHtml(cat.name)} <span class="pill-count">${cat.count}</span>`;
        pill.addEventListener("click", () => {
          setCategoryFilter(cat.name);
        });
        categoryPillsContainer.appendChild(pill);
      });

      // Populate Authors Select
      authors.forEach(auth => {
        const opt = document.createElement("option");
        opt.value = auth.name;
        opt.textContent = `${auth.name} (${auth.count})`;
        authorSelect.appendChild(opt);
      });
    } catch (err) {
      console.error("Error loading categories/authors metadata:", err);
    }
  }

  // Set Category Filter
  function setCategoryFilter(category) {
    state.selectedCategory = category;

    // Update pill styles
    categoryPillsContainer.querySelectorAll(".pill").forEach(p => {
      const isActive = p.getAttribute("data-category").toLowerCase() === category.toLowerCase();
      p.classList.toggle("active", isActive);
      p.setAttribute("aria-checked", isActive ? "true" : "false");
    });

    fetchQuotes();
  }

  // Set Author Filter
  function setAuthorFilter(author) {
    state.selectedAuthor = author;
    authorSelect.value = author;
    fetchQuotes();
  }

  // Event Listeners
  randomBtn.addEventListener("click", fetchRandomQuote);

  copyHeroBtn.addEventListener("click", () => {
    if (state.heroQuote) {
      copyQuote(state.heroQuote.quote, state.heroQuote.author, copyHeroBtn);
    }
  });

  if (exportCsvBtn) {
    exportCsvBtn.addEventListener("click", exportToCsv);
  }

  // Category pill for "All"
  categoryPillsContainer.querySelector('[data-category="all"]').addEventListener("click", () => {
    setCategoryFilter("all");
  });

  // Author select change
  authorSelect.addEventListener("change", e => {
    setAuthorFilter(e.target.value);
  });

  // Search input debounced
  searchInput.addEventListener("input", e => {
    const query = e.target.value.trim();
    state.searchQuery = query;
    clearSearchBtn.style.display = query ? "block" : "none";

    clearTimeout(state.debounceTimer);
    state.debounceTimer = setTimeout(() => {
      fetchQuotes();
    }, 250);
  });

  // Clear search button
  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    state.searchQuery = "";
    clearSearchBtn.style.display = "none";
    searchInput.focus();
    fetchQuotes();
  });

  // Reset all filters
  resetFiltersBtn.addEventListener("click", () => {
    state.searchQuery = "";
    state.selectedCategory = "all";
    state.selectedAuthor = "all";

    searchInput.value = "";
    clearSearchBtn.style.display = "none";
    authorSelect.value = "all";

    categoryPillsContainer.querySelectorAll(".pill").forEach(p => {
      const isAll = p.getAttribute("data-category") === "all";
      p.classList.toggle("active", isAll);
      p.setAttribute("aria-checked", isAll ? "true" : "false");
    });

    fetchQuotes();
  });

  // Global Keyboard Shortcut: Space for Random Quote
  window.addEventListener("keydown", e => {
    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
    if (activeTag === "input" || activeTag === "textarea" || activeTag === "select") {
      return;
    }
    if (e.code === "Space") {
      e.preventDefault();
      fetchRandomQuote();
    }
  });

  // Initial Load
  loadMetadata();
  fetchRandomQuote();
  fetchQuotes();
});
