import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// =========================
// Export & Import Categories
// =========================
const exportCategories = [
    "Jaggery",
    "Metal Springs",
    "Turmeric",
    "Organic Fertilizers"
];

const importCategories = [
    "Drinkware",
    "Stemware",
    "Decorative Glass",
    "Glass Tableware",
    "Speciality Glass",
    "Glass Containers"
];

let products = [];
let editIndex = -1;

// =========================
// Product Type Change
// =========================
const productTypeEl = document.getElementById("productType");
if (productTypeEl) {
    productTypeEl.addEventListener("change", function(){
        let category = document.getElementById("category");
        category.innerHTML = "";

        if (this.value === "Export") {
            exportCategories.forEach(function(item){
                category.innerHTML += `<option>${item}</option>`;
            });
        } else if (this.value === "Import") {
            importCategories.forEach(function(item){
                category.innerHTML += `<option>${item}</option>`;
            });
        }
        updateCategoryFilter();
    });
}

// =========================
// Helper: Read Image File as Base64
// =========================
function readImageFile(file) {
    return new Promise((resolve) => {
        if (!file) {
            resolve("images/noimage.png");
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            resolve(e.target.result);
        };
        reader.onerror = function() {
            resolve("images/noimage.png");
        };
        reader.readAsDataURL(file);
    });
}

// =========================
// Save Product to Firestore
// =========================
const productForm = document.getElementById("productForm");
if (productForm) {
    productForm.addEventListener("submit", async function(e){
        e.preventDefault();

        const imageFile = document.getElementById("productImage").files[0];
        let imageURL = "images/noimage.png";

        if (imageFile) {
            imageURL = await readImageFile(imageFile);
        } else if (editIndex !== -1 && products[editIndex] && products[editIndex].image) {
            imageURL = products[editIndex].image;
        }

        const product = {
            image: imageURL,
            type: document.getElementById("productType").value,
            category: document.getElementById("category").value,
            name: document.getElementById("productName").value.trim(),
            price: Number(document.getElementById("price").value) || 0,
            unit: document.getElementById("unit").value,
            status: document.getElementById("status").value,
            featured: document.getElementById("featured").checked,
            shortDesc: document.getElementById("shortDesc").value.trim(),
            longDesc: document.getElementById("longDesc").value.trim(),
            date: new Date().toLocaleDateString()
        };

        const submitBtn = productForm.querySelector("button[type='submit']") || productForm.querySelector("button");
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Saving...";
        }

        try {
            if (editIndex !== -1 && products[editIndex]) {
                const prodId = products[editIndex].id;
                await updateDoc(doc(db, "products", prodId), product);
                alert("Product Updated Successfully in Firebase!");
                editIndex = -1;
            } else {
                await addDoc(collection(db, "products"), product);
                alert("Product Added Successfully to Firebase!");
            }

            productForm.reset();
            await loadProducts();

        } catch(err) {
            console.error("Firestore Save Error:", err);
            alert("Error saving product to Firebase: " + err.message);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = "Save Product";
            }
        }
    });
}

// ===============================
// Display Products
// ===============================
function displayProducts(){
    let tbody = document.querySelector("#productTable tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    let exportCount = 0;
    let importCount = 0;

    products.forEach(function(product, index){
        if (product.type === "Export") exportCount++;
        if (product.type === "Import") importCount++;

        let statusClass = product.status === "Active" ? "active-status" : "inactive-status";
        let featured = product.featured ? "⭐ Yes" : "No";
        let imgSrc = product.image || "images/noimage.png";

        tbody.innerHTML += `
        <tr>
            <td>
                <img src="${imgSrc}" width="60" style="max-height: 50px; object-fit: cover; border-radius: 4px;" onerror="this.src='hero.png'">
            </td>
            <td>${product.name || "Unnamed"}</td>
            <td>${product.type || "-"}</td>
            <td>${product.category || "-"}</td>
            <td>₹ ${(Number(product.price) || 0).toLocaleString()}</td>
            <td>${product.unit || "-"}</td>
            <td>
                <span class="${statusClass}">${product.status || "Active"}</span>
            </td>
            <td>${featured}</td>
            <td>${product.date || "-"}</td>
            <td>
                <button class="edit-btn" onclick="editProduct(${index})" title="Edit">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="delete-btn" onclick="deleteProduct('${product.id}')" title="Delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
        `;
    });

    const totalProdEl = document.getElementById("totalProducts");
    if (totalProdEl) totalProdEl.innerHTML = products.length;

    const exportCountEl = document.getElementById("exportCount");
    if (exportCountEl) exportCountEl.innerHTML = exportCount;

    const importCountEl = document.getElementById("importCount");
    if (importCountEl) importCountEl.innerHTML = importCount;
}

// ===============================
// Delete Product from Firestore
// ===============================
async function deleteProduct(id) {
    if (!id || id === "undefined") {
        alert("Invalid product ID");
        return;
    }

    if (!confirm("Are you sure you want to delete this product from Firebase?")) return;

    try {
        await deleteDoc(doc(db, "products", id));
        alert("Product Deleted Successfully from Firebase");
        await loadProducts();
    } catch (err) {
        console.error("Firestore Delete Error:", err);
        alert("Error deleting product: " + err.message);
    }
}
window.deleteProduct = deleteProduct;

// ===============================
// Edit Product
// ===============================
function editProduct(index){
    let p = products[index];
    if (!p) return;

    document.getElementById("productType").value = p.type || "";
    document.getElementById("productType").dispatchEvent(new Event("change"));

    document.getElementById("category").value = p.category || "";
    document.getElementById("productName").value = p.name || "";
    document.getElementById("price").value = p.price || "";
    document.getElementById("unit").value = p.unit || "";
    document.getElementById("status").value = p.status || "Active";
    document.getElementById("featured").checked = Boolean(p.featured);
    document.getElementById("shortDesc").value = p.shortDesc || "";
    document.getElementById("longDesc").value = p.longDesc || "";

    editIndex = index;
    window.scrollTo({ top: 0, behavior: "smooth" });
}
window.editProduct = editProduct;

// ===============================
// Search Product
// ===============================
function searchProduct(){
    let value = (document.getElementById("search") || document.getElementById("searchProduct")).value.toLowerCase();
    let rows = document.querySelectorAll("#productTable tbody tr");

    rows.forEach(function(row){
        let name = row.cells[1] ? row.cells[1].innerText.toLowerCase() : "";
        if (name.includes(value)){
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}
window.searchProduct = searchProduct;

// ===============================
// Filter Products
// ===============================
function filterProducts(){
    let type = document.getElementById("filterType").value;
    let category = document.getElementById("filterCategory").value;
    let rows = document.querySelectorAll("#productTable tbody tr");

    rows.forEach(function(row){
        let rowType = row.cells[2] ? row.cells[2].innerText : "";
        let rowCategory = row.cells[3] ? row.cells[3].innerText : "";

        let typeMatch = (type === "All" || rowType === type);
        let categoryMatch = (category === "All" || rowCategory === category);

        if (typeMatch && categoryMatch){
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}
window.filterProducts = filterProducts;

// ===============================
// Update Category Filter
// ===============================
function updateCategoryFilter(){
    let filter = document.getElementById("filterCategory");
    if (!filter) return;

    filter.innerHTML = `<option value="All">All Categories</option>`;

    exportCategories.forEach(function(item){
        filter.innerHTML += `<option>${item}</option>`;
    });

    importCategories.forEach(function(item){
        filter.innerHTML += `<option>${item}</option>`;
    });
}

// ===============================
// Pagination
// ===============================
let page = 1;
function nextPage(){
    page++;
    const pEl = document.getElementById("pageNumber");
    if (pEl) pEl.innerHTML = "Page " + page;
}
window.nextPage = nextPage;

function previousPage(){
    if (page > 1){
        page--;
        const pEl = document.getElementById("pageNumber");
        if (pEl) pEl.innerHTML = "Page " + page;
    }
}
window.previousPage = previousPage;

// ===============================
// Load Products from Firestore
// ===============================
async function loadProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        products = [];
        querySnapshot.forEach((docSnap) => {
            products.push({ id: docSnap.id, ...docSnap.data() });
        });
        displayProducts();
    } catch (err) {
        console.error("Firestore Load Products Error:", err);
        alert("Error loading products from Firebase: " + err.message);
    }
}

// Initial calls
updateCategoryFilter();
loadProducts();