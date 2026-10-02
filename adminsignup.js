function checkPassword(){
    let password = document.getElementById("adminPassword").value;

    if(password === "1357"){
        sessionStorage.setItem("adminAccess", "true");
        sessionStorage.setItem("userRole", "admin");
        sessionStorage.setItem("userName", "Super Admin");
        alert("Welcome Admin");
        window.location.href = "dashboard.html";
    } else {
        document.getElementById("error").innerHTML = "Incorrect Password";
    }
}
window.checkPassword = checkPassword;