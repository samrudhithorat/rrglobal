import { auth, db } from "./firebase-config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// =========================
// LOAD CART
// =========================
function loadCart() {
    let cartBody = document.getElementById("cartBody");
    if (!cartBody) return;

    cartBody.innerHTML = "";

    let subtotal = 0;

    cart.forEach((item, index) => {
        let price = Number(item.price) || 0;
        let qty = Number(item.quantity) || 1;
        let total = price * qty;
        subtotal += total;

        cartBody.innerHTML += `
        <tr>
            <td>
                <div class="product">
                    <img src="${item.image || 'hero.png'}" width="70" style="border-radius: 6px; object-fit: cover;" onerror="this.src='hero.png'">
                    <div>
                        <h3>${item.name || 'Product'}</h3>
                        <p>${item.category || ''}</p>
                    </div>
                </div>
            </td>
            <td>₹${price.toLocaleString()}</td>
            <td>
                <input type="number"
                       value="${qty}"
                       min="1"
                       onchange="changeQty(${index}, this.value)">
            </td>
            <td>₹${total.toLocaleString()}</td>
            <td>
                <i class="fa-solid fa-trash delete"
                   onclick="removeItem(${index})" title="Remove item"></i>
            </td>
        </tr>
        `;
    });

    let shipping = subtotal > 0 ? 300 : 0;
    let gst = subtotal > 0 ? subtotal * 0.18 : 0;
    let grandTotal = subtotal + shipping + gst;

    const cartTitleEl = document.querySelector(".cart-title h2");
    if (cartTitleEl) {
        cartTitleEl.innerHTML = `Your Cart (${cart.length} Items)`;
    }

    // Update order summary card
    const summaryRows = document.querySelectorAll(".summary .row");
    if (summaryRows.length >= 3) {
        summaryRows[0].lastElementChild.textContent = "₹" + Math.round(subtotal).toLocaleString();
        summaryRows[1].lastElementChild.textContent = "₹" + Math.round(shipping).toLocaleString();
        summaryRows[2].lastElementChild.textContent = "₹" + Math.round(gst).toLocaleString();
    }
    const totalRow = document.querySelector(".summary .row.total");
    if (totalRow) {
        totalRow.lastElementChild.textContent = "₹" + Math.round(grandTotal).toLocaleString();
    }
}
window.loadCart = loadCart;

// =========================
// CHANGE QUANTITY
// =========================
function changeQty(index, qty) {
    if (!cart[index]) return;
    const parsed = parseInt(qty);
    cart[index].quantity = parsed > 0 ? parsed : 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}
window.changeQty = changeQty;

// =========================
// REMOVE ITEM
// =========================
function removeItem(index) {
    if (confirm("Remove this product from cart?")) {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart();
    }
}
window.removeItem = removeItem;

// =========================
// PLACE ORDER IN FIRESTORE
// =========================
async function placeOrder() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // Detect logged-in Firebase user if available
    let defaultName = "";
    if (auth.currentUser) {
        defaultName = auth.currentUser.displayName || auth.currentUser.email.split("@")[0];
    } else if (sessionStorage.getItem("userName")) {
        defaultName = sessionStorage.getItem("userName");
    }

    let customer = prompt("Enter Customer Name", defaultName);
    if (!customer) return;

    let subtotal = 0;
    cart.forEach(item => {
        let price = Number(item.price) || 0;
        let qty = Number(item.quantity) || 1;
        subtotal += price * qty;
    });

    let shipping = 300;
    let gst = subtotal * 0.18;
    let grandTotal = Math.round(subtotal + shipping + gst);

    let order = {
        orderNumber: "ORD" + Date.now(),
        date: new Date().toLocaleDateString(),
        customer: customer.trim(),
        type: "Export",
        products: cart.map(item => `${item.name} (x${item.quantity || 1})`).join(", "),
        amount: grandTotal,
        status: "Pending",
        payment: "Pending",
        userId: auth.currentUser ? auth.currentUser.uid : null,
        createdAt: new Date().toISOString()
    };

    try {
        await addDoc(collection(db, "orders"), order);
        alert(`Order Placed Successfully in Firebase!\nOrder ID: ${order.orderNumber}\nTotal: ₹${grandTotal.toLocaleString()}`);

        localStorage.removeItem("cart");
        cart = [];
        loadCart();

    } catch (err) {
        console.error("Firestore Order Save Error:", err);
        alert("Error placing order in Firebase: " + err.message);
    }
}
window.placeOrder = placeOrder;

loadCart();