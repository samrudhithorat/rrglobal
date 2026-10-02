import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Warn if opened directly as file:// which blocks ES modules and Firebase
if (window.location.protocol === "file:") {
    alert("Warning: Please access this application via http://localhost:3000 rather than opening the HTML file directly. Direct file opening prevents Firebase authentication from executing.");
}

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
            console.log("Registering user in Firebase Authentication with email:", email);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("Firebase Auth user created! UID:", user.uid, "Email:", user.email);

            // Update displayName in Firebase Auth profile directly
            try {
                await updateProfile(user, { displayName: name });
            } catch (pErr) {
                console.warn("Could not update Auth displayName:", pErr);
            }

            // 2. Save user profile into Firestore 'users' collection with timeout
            let firestoreSaved = false;
            try {
                const firestorePromise = setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    name: name,
                    email: email,
                    phone: phone,
                    role: "user",
                    createdAt: new Date().toISOString()
                });

                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Firestore save timed out")), 4000)
                );

                await Promise.race([firestorePromise, timeoutPromise]);
                firestoreSaved = true;
                console.log("Firestore document saved in 'users' collection for UID:", user.uid);
            } catch (firestoreErr) {
                console.warn("Firestore profile save notice:", firestoreErr.message || firestoreErr);
            }

            let successMessage = `Signup Successful!\nEmail: ${email}\n\nYour account is now registered in Firebase Authentication.`;
            if (!firestoreSaved) {
                console.info("Tip: Enable Cloud Firestore Database in Firebase Console to also view full profiles in the Firestore 'users' collection.");
            }

            alert(successMessage);
            window.location.href = "login.html";

        } catch (err) {
            console.error("Firebase Signup Error:", err);
            let message = "Signup failed. Please try again.";

            if (err.code === "auth/email-already-in-use") {
                message = `This email (${email}) is already registered in Firebase. Please go to Login.`;
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
                submitBtn.textContent = "Sign Up as User";
            }
        }
    });
}