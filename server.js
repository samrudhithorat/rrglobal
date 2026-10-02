const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve all static project files (HTML, CSS, JS, Images, Videos)
app.use(express.static(__dirname));

// Route root to main home page (rr.html)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "rr.html"));
});

app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`  RR Global Nexux is live!`);
    console.log(`  Server URL : http://localhost:${PORT}`);
    console.log(`  Home Page  : http://localhost:${PORT}/rr.html`);
    console.log(`  Login Page : http://localhost:${PORT}/login.html`);
    console.log(`  Signup Page: http://localhost:${PORT}/signup.html`);
    console.log(`  Dashboard  : http://localhost:${PORT}/dashboard.html`);
    console.log(`===============================================`);
});