import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const terms = document.getElementById("terms").checked;

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        if (!terms) {
            alert("Please accept the Terms & Conditions");
            return;
        }

        const submitBtn = signupForm.querySelector("button[type='submit']") || signupForm.querySelector("button");
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Creating Account...";
        }

        try {
            // 1. Create account in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Save user profile into Firestore 'users' collection
            try {
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    name: name,
                    email: email,
                    phone: phone,
                    role: "user",
                    createdAt: new Date().toISOString()
                });
            } catch (firestoreErr) {
                console.warn("Firestore profile save warning (check Firestore security rules):", firestoreErr);
            }

            alert("Signup Successful! Please login to continue.");
            window.location.href = "login.html";

        } catch (err) {
            console.error("Firebase Signup Error:", err);
            let message = "Signup failed. Please try again.";

            if (err.code === "auth/email-already-in-use") {
                message = "This email is already registered. Please go to Login.";
            } else if (err.code === "auth/invalid-email") {
                message = "Please enter a valid email address.";
            } else if (err.code === "auth/weak-password") {
                message = "Password must be at least 6 characters long.";
            } else if (err.code === "auth/operation-not-allowed") {
                message = "Email/Password sign-in is not enabled in Firebase Console. Please enable it under Authentication > Sign-in method.";
            } else if (err.message) {
                message = err.message;
            }

            alert(message);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = "Create Account";
            }
        }
    });
}