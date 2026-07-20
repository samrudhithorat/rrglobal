function checkPassword(){

let password =
document.getElementById("adminPassword").value;

if(password=="1357"){

alert("Welcome Admin");

// Open Dashboard
window.location.href="dashboard.html";

}

else{

document.getElementById("error").innerHTML="Incorrect Password";

}

}