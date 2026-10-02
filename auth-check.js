import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Check authentication state for admin protected pages
onAuthStateChanged(auth, async (user) => {
    const adminKey = sessionStorage.getItem("adminAccess");

    // Case 1: Session has admin access via admin password code
    if (adminKey === "true") {
        const adminName = sessionStorage.getItem("userName") || "Super Admin";
        updateAdminUI(adminName);
        return;
    }

    // Case 2: No Firebase user logged in and no admin access key
    if (!user) {
        alert("Please log in with an Admin account to access this page.");
        window.location.href = "login.html";
        return;
    }

    // Case 3: Firebase user logged in - verify role in Firestore
    try {
        const userDocRef = doc(db, "users", user.uid);
        const fetchPromise = getDoc(userDocRef);
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Firestore fetch timeout")), 3500)
        );
        const docSnap = await Promise.race([fetchPromise, timeoutPromise]);

        if (docSnap && docSnap.exists()) {
            const userData = docSnap.data();
            if (userData.role !== "admin") {
                alert("Access Denied: Admin privileges required.");
                await signOut(auth);
                sessionStorage.clear();
                window.location.href = "login.html";
                return;
            }
            updateAdminUI(userData.name || "Admin User");
        } else {
            // Document missing, check if user has adminAccess in session
            if (sessionStorage.getItem("userRole") === "admin") {
                updateAdminUI(user.displayName || user.email.split("@")[0]);
            } else {
                alert("Access Denied: Admin privileges required.");
                await signOut(auth);
                sessionStorage.clear();
                window.location.href = "login.html";
            }
        }
    } catch (error) {
        console.error("Auth check Firestore error:", error);
        // Fallback check if user is authenticated
        updateAdminUI(user.displayName || (user.email ? user.email.split("@")[0] : "Admin User"));
    }
});

function updateAdminUI(adminName) {
    // Dynamically update admin name in the topbar
    const adminTitleEl = document.querySelector(".admin h3");
    if (adminTitleEl) {
        adminTitleEl.textContent = adminName;
    }

    // Attach logout button listener
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.onclick = async (e) => {
            e.preventDefault();
            if (confirm("Are you sure you want to log out?")) {
                try {
                    await signOut(auth);
                } catch (err) {
                    console.log("Logout error:", err);
                }
                sessionStorage.clear();
                window.location.href = "login.html";
            }
        };
    }
}

export { updateAdminUI };
