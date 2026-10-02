// =========================
// SEARCH FUNCTION
// =========================
function searchItem() {
    const input = document.getElementById("searchInput") || document.getElementById("search");
    if (!input) return;
    const search = input.value.trim().toLowerCase();
    if (search === "") {
        alert("Please enter something to search.");
        return;
    }
    
    if (search === "export") {
        window.location.href = "export.html";
    } else if (search === "import") {
        window.location.href = "import.html";
    } else if (search === "services") {
        window.location.href = "services.html";
    } else if (search === "about" || search === "about us") {
        window.location.href = "about.html";
    } else if (search === "contact" || search === "contact us") {
        window.location.href = "contact.html";
    } else if (search === "login") {
        window.location.href = "login.html";
    } else {
        alert("No Result Found for: " + search);
    }
}

// =========================
// CART SYNC
// =========================
window.addEventListener("DOMContentLoaded", () => {
    const badge = document.getElementById("cartCount");
    if (badge) {
        badge.innerHTML = localStorage.getItem("cartCount") || "0";
    }
});
