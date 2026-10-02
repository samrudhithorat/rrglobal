import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ======================================
// GREETING
// ======================================
function setGreeting() {
    let hour = new Date().getHours();
    let title = document.querySelector(".heading p");
    let adminName = sessionStorage.getItem("userName") || "Admin";

    if (title) {
        if (hour < 12) {
            title.innerHTML = `Good Morning ${adminName}! Welcome back.`;
        } else if (hour < 18) {
            title.innerHTML = `Good Afternoon ${adminName}! Welcome back.`;
        } else {
            title.innerHTML = `Good Evening ${adminName}! Welcome back.`;
        }
    }
}
setGreeting();

// ======================================
// LOAD DATA FROM FIRESTORE
// ======================================
let doughnutChartInstance = null;
let lineChartInstance = null;

async function loadDashboardData() {
    let products = [];
    let orders = [];

    try {
        // Fetch products
        const prodSnap = await getDocs(collection(db, "products"));
        prodSnap.forEach(d => products.push({ id: d.id, ...d.data() }));
    } catch (err) {
        console.warn("Could not load products from Firestore, falling back to localStorage:", err);
        products = JSON.parse(localStorage.getItem("products")) || [];
    }

    try {
        // Fetch orders
        const orderSnap = await getDocs(collection(db, "orders"));
        orderSnap.forEach(d => orders.push({ id: d.id, ...d.data() }));
    } catch (err) {
        console.warn("Could not load orders from Firestore:", err);
    }

    let totalProducts = products.length;
    let exportProducts = 0;
    let importProducts = 0;
    let categoryCount = {};

    products.forEach(function(product) {
        if (product.type === "Export") exportProducts++;
        if (product.type === "Import") importProducts++;

        let cat = product.category || "Other";
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    let totalOrders = orders.length;

    // Update Dashboard Cards
    const cardProd = document.getElementById("cardProducts");
    if (cardProd) cardProd.innerHTML = totalProducts;

    const cardExp = document.getElementById("cardExport");
    if (cardExp) cardExp.innerHTML = exportProducts;

    const cardImp = document.getElementById("cardImport");
    if (cardImp) cardImp.innerHTML = importProducts;

    const cardOrd = document.getElementById("cardOrders");
    if (cardOrd) cardOrd.innerHTML = totalOrders;

    // Update Sidebar Quick Summary
    const totalProdEl = document.getElementById("totalProduct");
    if (totalProdEl) totalProdEl.innerHTML = totalProducts;

    const expCountEl = document.getElementById("exportCount");
    if (expCountEl) expCountEl.innerHTML = exportProducts;

    const impCountEl = document.getElementById("importCount");
    if (impCountEl) impCountEl.innerHTML = importProducts;

    const dashOrdersEl = document.getElementById("dashOrdersCount");
    if (dashOrdersEl) dashOrdersEl.innerHTML = totalOrders;

    // Render Doughnut Chart with real categories
    renderCategoryChart(categoryCount);
}

// ======================================
// CATEGORY DOUGHNUT CHART
// ======================================
function renderCategoryChart(categoryCount) {
    const pieCanvas = document.getElementById("pieChart");
    if (!pieCanvas) return;

    let labels = Object.keys(categoryCount);
    let values = Object.values(categoryCount);

    if (labels.length === 0) {
        labels = ["Export Products", "Import Products"];
        values = [1, 1];
    }

    if (doughnutChartInstance) {
        doughnutChartInstance.destroy();
    }

    doughnutChartInstance = new Chart(pieCanvas, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    "#0b2d63",
                    "#2ecc71",
                    "#3498db",
                    "#f39c12",
                    "#e74c3c",
                    "#9b59b6",
                    "#1abc9c",
                    "#34495e"
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });
}

// ======================================
// ORDERS OVERVIEW LINE CHART
// ======================================
function renderLineChart() {
    const lineCanvas = document.getElementById("lineChart");
    if (!lineCanvas) return;

    if (lineChartInstance) {
        lineChartInstance.destroy();
    }

    lineChartInstance = new Chart(lineCanvas, {
        type: "line",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
            datasets: [{
                label: "Orders",
                data: [40, 55, 60, 75, 70, 85, 92, 110],
                borderColor: "#0b2d63",
                backgroundColor: "rgba(11,45,99,.15)",
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: "#0b2d63"
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

renderLineChart();
loadDashboardData();