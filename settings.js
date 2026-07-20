// ===============================
// LOAD DATA
// ===============================

let settings = JSON.parse(localStorage.getItem("settings")) || {};

let products = JSON.parse(localStorage.getItem("products")) || [];

let orders = JSON.parse(localStorage.getItem("orders")) || [];

let users = JSON.parse(localStorage.getItem("users")) || [];


// ===============================
// LOAD SETTINGS
// ===============================

window.onload = function(){

    document.getElementById("websiteName").value =
    settings.websiteName || "RR Global";

    document.getElementById("adminName").value =
    settings.adminName || "Admin";

    document.getElementById("email").value =
    settings.email || "admin@rrglobal.com";

    document.getElementById("phone").value =
    settings.phone || "+91 9876543210";

    document.getElementById("address").value =
    settings.address || "Pune, Maharashtra";

    document.getElementById("maintenance").checked =
    settings.maintenance || false;

    document.getElementById("emailNotification").checked =
    settings.emailNotification || false;

    document.getElementById("darkMode").checked =
    settings.darkMode || false;

    updateSummary();

};


// ===============================
// SAVE GENERAL SETTINGS
// ===============================

document.getElementById("settingsForm")
.addEventListener("submit",function(e){

e.preventDefault();

settings.websiteName =
document.getElementById("websiteName").value;

settings.adminName =
document.getElementById("adminName").value;

settings.email =
document.getElementById("email").value;

settings.phone =
document.getElementById("phone").value;

settings.address =
document.getElementById("address").value;

localStorage.setItem(

"settings",

JSON.stringify(settings)

);

alert("Settings Saved Successfully.");

});


// ===============================
// CHANGE PASSWORD
// ===============================

document.getElementById("passwordForm")
.addEventListener("submit",function(e){

e.preventDefault();

let newPass =
document.getElementById("newPassword").value;

let confirmPass =
document.getElementById("confirmPassword").value;

if(newPass==""){

alert("Enter New Password");

return;

}

if(newPass!=confirmPass){

alert("Passwords do not match");

return;

}

settings.password = newPass;

localStorage.setItem(

"settings",

JSON.stringify(settings)

);

document.getElementById("passwordForm").reset();

alert("Password Updated Successfully.");

});


// ===============================
// SAVE PREFERENCES
// ===============================

function savePreference(){

settings.maintenance =
document.getElementById("maintenance").checked;

settings.emailNotification =
document.getElementById("emailNotification").checked;

settings.darkMode =
document.getElementById("darkMode").checked;

localStorage.setItem(

"settings",

JSON.stringify(settings)

);

alert("Preferences Saved Successfully.");

}


// ===============================
// QUICK SUMMARY
// ===============================

function updateSummary(){

let exportCount = 0;

let importCount = 0;

products.forEach(function(product){

if(product.type=="Export"){

exportCount++;

}

if(product.type=="Import"){

importCount++;

}

});

document.getElementById("totalProduct").innerHTML =
products.length;

document.getElementById("exportCount").innerHTML =
exportCount;

document.getElementById("importCount").innerHTML =
importCount;

document.getElementById("orderCount").innerHTML =
orders.length;

document.getElementById("userCount").innerHTML =
users.length;

}


// ===============================
// DARK MODE
// ===============================

document.getElementById("darkMode")
.addEventListener("change",function(){

if(this.checked){

document.body.style.background="#1e1e1e";

document.querySelectorAll(".card").forEach(function(card){

card.style.background="#2b2b2b";

card.style.color="white";

});

}

else{

location.reload();

}

});