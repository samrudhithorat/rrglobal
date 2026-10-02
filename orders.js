import { db } from "./firebase-config.js";
import { collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let products = [];
let orders = [];

// ===============================
// LOAD PRODUCTS FROM FIRESTORE
// ===============================
async function loadProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        products = [];
        querySnapshot.forEach((docSnap) => {
            products.push({ id: docSnap.id, ...docSnap.data() });
        });
        updateSummary();
    } catch (err) {
        console.error("Firestore Load Products Error:", err);
    }
}

// ===============================
// LOAD ORDERS FROM FIRESTORE
// ===============================
async function loadOrders() {
    try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        orders = [];
        querySnapshot.forEach((docSnap) => {
            orders.push({ id: docSnap.id, ...docSnap.data() });
        });
        displayOrders();
        updateSummary();
    } catch (err) {
        console.error("Firestore Load Orders Error:", err);
        alert("Error loading orders from Firebase: " + err.message);
    }
}

// ===============================
// DISPLAY ORDERS
// ===============================
function displayOrders(list = orders) {
    let tbody = document.querySelector("#ordersTable tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    list.forEach(function(order, index) {
        let status = order.status || "Pending";
        let payment = order.payment || "Pending";
        let statusClass = status.toLowerCase();
        let paymentClass = payment.toLowerCase();
        let displayId = order.orderNumber || order.id || ("#ORD-" + index);
        let amount = Number(order.amount) || 0;

        tbody.innerHTML += `
        <tr>
            <td>${displayId}</td>
            <td>${order.date || "-"}</td>
            <td>${order.customer || "Guest"}</td>
            <td>${order.type || "Export"}</td>
            <td>${order.products || "-"}</td>
            <td>₹ ${amount.toLocaleString()}</td>
            <td>
                <span class="${statusClass}">${status}</span>
            </td>
            <td>
                <span class="${paymentClass}">${payment}</span>
            </td>
            <td>
                <button class="view-btn" onclick="viewOrder(${index})" title="View Details">
                    <i class="fa-solid fa-eye"></i>
                </button>
                <button class="print-btn" onclick="printOrder(${index})" title="Print Order">
                    <i class="fa-solid fa-print"></i>
                </button>
                <button class="delete-btn" onclick="deleteOrder('${order.id}')" title="Delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
        `;
    });

    updateSummary();
}
window.displayOrders = displayOrders;

// ===============================
// SEARCH
// ===============================
function searchOrders() {
    const searchEl = document.getElementById("searchOrder");
    if (!searchEl) return;
    let value = searchEl.value.toLowerCase();

    let filtered = orders.filter(function(order) {
        let orderId = (order.orderNumber || order.id || "").toLowerCase();
        let customer = (order.customer || "").toLowerCase();
        return orderId.includes(value) || customer.includes(value);
    });

    displayOrders(filtered);
}
window.searchOrders = searchOrders;

// ===============================
// FILTER
// ===============================
function filterOrders() {
    let type = document.getElementById("filterType").value;
    let status = document.getElementById("filterStatus").value;

    let filtered = orders.filter(function(order) {
        let typeMatch = (type === "All" || order.type === type);
        let statusMatch = (status === "All" || order.status === status);
        return typeMatch && statusMatch;
    });

    displayOrders(filtered);
}
window.filterOrders = filterOrders;

// ===============================
// DELETE ORDER FROM FIRESTORE
// ===============================
async function deleteOrder(id) {
    if (!id || id === "undefined") {
        alert("Invalid order ID");
        return;
    }

    if (!confirm("Are you sure you want to delete this order from Firebase?")) return;

    try {
        await deleteDoc(doc(db, "orders", id));
        alert("Order Deleted Successfully from Firebase");
        await loadOrders();
    } catch (err) {
        console.error("Firestore Delete Order Error:", err);
        alert("Error deleting order: " + err.message);
    }
}
window.deleteOrder = deleteOrder;

// ===============================
// VIEW ORDER
// ===============================
function viewOrder(index) {
    let o = orders[index];
    if (!o) return;

    alert(
        "Order ID : " + (o.orderNumber || o.id) +
        "\nDate : " + (o.date || "-") +
        "\nCustomer : " + (o.customer || "-") +
        "\nType : " + (o.type || "-") +
        "\nProducts : " + (o.products || "-") +
        "\nAmount : ₹ " + (Number(o.amount) || 0).toLocaleString() +
        "\nStatus : " + (o.status || "-") +
        "\nPayment : " + (o.payment || "-")
    );
}
window.viewOrder = viewOrder;

// ===============================
// PRINT ORDER
// ===============================
function printOrder(index) {
    let o = orders[index];
    if (!o) return;

    let win = window.open("", "_blank");
    win.document.write(`
        <html>
        <head><title>Order Invoice - ${o.orderNumber || o.id}</title></head>
        <body style="font-family: sans-serif; padding: 20px;">
            <h2>RR Global Order Invoice</h2>
            <hr>
            <p><b>Order ID:</b> ${o.orderNumber || o.id}</p>
            <p><b>Date:</b> ${o.date || "-"}</p>
            <p><b>Customer:</b> ${o.customer || "-"}</p>
            <p><b>Type:</b> ${o.type || "-"}</p>
            <p><b>Products:</b> ${o.products || "-"}</p>
            <p><b>Total Amount:</b> ₹ ${(Number(o.amount) || 0).toLocaleString()}</p>
            <p><b>Status:</b> ${o.status || "-"}</p>
            <p><b>Payment Status:</b> ${o.payment || "-"}</p>
        </body>
        </html>
    `);
    win.document.close();
    win.focus();
    win.print();
}
window.printOrder = printOrder;

// ===============================
// SUMMARY
// ===============================
function updateSummary() {
    let exportCount = 0;
    let importCount = 0;

    products.forEach(function(product) {
        if (product.type === "Export") exportCount++;
        if (product.type === "Import") importCount++;
    });

    const totalProdEl = document.getElementById("totalProduct");
    if (totalProdEl) totalProdEl.innerHTML = products.length;

    const exportCountEl = document.getElementById("exportCount");
    if (exportCountEl) exportCountEl.innerHTML = exportCount;

    const importCountEl = document.getElementById("importCount");
    if (importCountEl) importCountEl.innerHTML = importCount;

    const orderCountEl = document.getElementById("orderCount");
    if (orderCountEl) orderCountEl.innerHTML = orders.length;
}

// ===============================
// PAGINATION
// ===============================
let page = 1;
function nextPage() {
    page++;
    const pEl = document.getElementById("pageNumber");
    if (pEl) pEl.innerHTML = "Page " + page;
}
window.nextPage = nextPage;

function previousPage() {
    if (page > 1) {
        page--;
        const pEl = document.getElementById("pageNumber");
        if (pEl) pEl.innerHTML = "Page " + page;
    }
}
window.previousPage = previousPage;

// ===============================
// EXPORT REPORT
// ===============================
const exportBtn = document.querySelector(".export-btn");
if (exportBtn) {
    exportBtn.addEventListener("click", function() {
        let text = "RR Global Orders Report\n\n";

        orders.forEach(function(order) {
            text += (order.orderNumber || order.id) + " | " + order.customer +
                " | ₹" + order.amount + " | " + order.status + " | " + (order.date || "") + "\n";
        });

        let blob = new Blob([text], { type: "text/plain" });
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Orders_Report.txt";
        link.click();
    });
}

// ===============================
// LOAD
// ===============================
loadProducts();
loadOrders();