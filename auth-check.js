import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Immediately check auth state
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // No user is signed in, redirect to login page
        window.location.href = "login.html";
    } else {
        // User is signed in, verify if they are an admin
        const userDocRef = doc(db, "users", user.uid);
        getDoc(userDocRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    if (userData.role !== "admin") {
                        alert("Access Denied: Admin privileges required.");
                        signOut(auth).then(() => {
                            window.location.href = "login.html";
                        });
                    } else {
                        // User is an admin, dynamically update any profile text in UI if available
                        updateAdminUI(userData.name || "Admin User");
                    }
                } else {
                    alert("Access Denied: Profile not found.");
                    signOut(auth).then(() => {
                        window.location.href = "login.html";
                    });
                }
            })
            .catch((error) => {
                console.error("Auth check Firestore error:", error);
                alert("Authentication check failed. Please log in again.");
                signOut(auth).then(() => {
                    window.location.href = "login.html";
                });
            });
    }
});

function updateAdminUI(adminName) {
    // Look for topbar admin elements
    const adminTitleEl = document.querySelector(".admin h3");
    if (adminTitleEl) {
        adminTitleEl.textContent = adminName;
    }
    
    // Bind logout button click
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("Are you sure you want to log out?")) {
                signOut(auth)
                    .then(() => {
                        window.location.href = "login.html";
                    })
                    .catch((err) => {
                        alert("Logout failed: " + err.message);
                    });
            }
        });
    }
}
