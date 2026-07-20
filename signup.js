document.getElementById("signupForm").addEventListener("submit", function(e){

e.preventDefault();

let password =
document.getElementById("password").value;

let confirmPassword =
document.getElementById("confirmPassword").value;

let terms =
document.getElementById("terms").checked;

if(password !== confirmPassword){

alert("Passwords do not match");

return;

}

if(!terms){

alert("Please accept Terms & Conditions");

return;

}

alert("User Registered Successfully");

window.location.href="login.html";

});