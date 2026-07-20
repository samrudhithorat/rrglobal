// =========================
// SHOW / HIDE PASSWORD
// =========================

function showPassword(){

    var password = document.getElementById("password");

    var eye = document.getElementById("eye");

    if(password.type=="password"){

        password.type="text";

        eye.classList.remove("fa-eye");

        eye.classList.add("fa-eye-slash");

    }

    else{

        password.type="password";

        eye.classList.remove("fa-eye-slash");

        eye.classList.add("fa-eye");

    }

}

// =========================
// SEARCH BUTTON
// =========================

function searchItem(){

    var search = document.getElementById("search").value;

    if(search==""){

        alert("Please enter something to search.");

    }

    else{

        alert("Searching for : " + search);

    }

}

// =========================
// CART
// =========================

var cart = 0;

document.querySelector(".fa-cart-shopping").onclick=function(){

    cart++;

    document.getElementById("cartCount").innerHTML=cart;

}

// =========================
// LOGIN VALIDATION
// =========================

document.querySelector("form").addEventListener("submit",function(event){

    var email=document.querySelector("input[name='email']").value;

    var password=document.getElementById("password").value;

    if(email=="" || password==""){

        alert("Please fill all fields.");

        event.preventDefault();

    }

});

// =========================
// REMEMBER ME
// =========================

window.onload=function(){

    var email=localStorage.getItem("email");

    if(email){

        document.querySelector("input[name='email']").value=email;

    }

}

document.querySelector("form").addEventListener("submit",function(){

    var remember=document.querySelector("input[type='checkbox']");

    if(remember.checked){

        localStorage.setItem("email",

        document.querySelector("input[name='email']").value);

    }

    else{

        localStorage.removeItem("email");

    }

});