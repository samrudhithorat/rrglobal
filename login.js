import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// =========================
// SHOW / HIDE PASSWORD
// =========================
function showPassword() {
    const password = document.getElementById("password");
    const eye = document.getElementById("eye");

    if (!password || !eye) return;

    if (password.type === "password") {
        password.type = "text";
        eye.classList.remove("fa-eye");
        eye.classList.add("fa-eye-slash");
    } else {
        password.type = "password";
        eye.classList.remove("fa-eye-slash");
        eye.classList.add("fa-eye");
    }
}
window.showPassword = showPassword;

// =========================
// SEARCH BUTTON
// =========================
function searchItem() {
    const searchInput = document.getElementById("search") || document.getElementById("searchInput");
    const val = searchInput ? searchInput.value.trim() : "";

    if (!val) {
        alert("Please enter something to search.");
    } else {
        alert("Searching for : " + val);
    }
}
window.searchItem = searchItem;

// =========================
// CART BADGE CLICK
// =========================
let cart = 0;
const cartBtn = document.querySelector(".fa-cart-shopping");
if (cartBtn) {
    cartBtn.onclick = function() {
        cart++;
        const cartCount = document.getElementById("cartCount");
        if (cartCount) cartCount.innerHTML = cart;
    };
}

// =========================
// FIREBASE LOGIN
// =========================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const emailInput = document.querySelector("input[name='email']");
        const passwordInput = document.getElementById("password");
        const rememberCheckbox = document.querySelector(".remember input[type='checkbox']");

        const email = emailInput ? emailInput.value.trim() : "";
        const password = passwordInput ? passwordInput.value : "";

        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        const submitBtn = loginForm.querySelector("button[type='submit']") || loginForm.querySelector("button");
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Logging in...";
        }

        try {
            // 1. Authenticate with Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Remember Me logic
            if (rememberCheckbox && rememberCheckbox.checked) {
                localStorage.setItem("rememberedEmail", email);
            } else {
                localStorage.removeItem("rememberedEmail");
            }

            // 3. Fetch user profile from Firestore to determine role
            let userRole = "user";
            let displayName = email.split("@")[0];

            try {
                const userDocRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userDocRef);
                if (userSnap.exists()) {
                    const data = userSnap.data();
                    if (data.role) userRole = data.role;
                    if (data.name) displayName = data.name;
                }
            } catch (fsErr) {
                console.warn("Could not read user profile from Firestore:", fsErr);
            }

            sessionStorage.setItem("userRole", userRole);
            sessionStorage.setItem("userName", displayName);
            if (userRole === "admin") {
                sessionStorage.setItem("adminAccess", "true");
            }

            alert(`Login Successful! Welcome back, ${displayName}.`);

            // 4. Redirect based on role
            if (userRole === "admin") {
                window.location.href = "dashboard.html";
            } else {
                window.location.href = "rr.html";
            }

        } catch (err) {
            console.error("Firebase Login Error:", err);
            let message = "Invalid email or password.";

            if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
                message = "Invalid email or password.";
            } else if (err.code === "auth/too-many-requests") {
                message = "Too many failed attempts. Please try again in a few minutes.";
            } else if (err.code === "auth/network-request-failed") {
                message = "Network error: Unable to connect to Firebase. Please check your internet connection.";
            } else if (err.message) {
                message = err.message;
            }

            alert(message);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = "Login";
            }
        }
    });
}

// =========================
// REMEMBER ME AUTO-FILL
// =========================
window.addEventListener("DOMContentLoaded", function() {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
        const emailInput = document.querySelector("input[name='email']");
        if (emailInput) emailInput.value = rememberedEmail;
        const rememberCheckbox = document.querySelector(".remember input[type='checkbox']");
        if (rememberCheckbox) rememberCheckbox.checked = true;
    }
});
