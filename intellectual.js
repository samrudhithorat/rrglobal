// =====================
// SEARCH BAR
// =====================

function openSearch(){

    var search = document.getElementById("searchBox");

    if(search.style.display=="block"){

        search.style.display="none";

    }

    else{

        search.style.display="block";

    }

}

// =====================
// SEARCH BUTTON
// =====================

var searchBtn = document.querySelector("#searchBox button");

searchBtn.onclick = function(){

    var value = document.querySelector("#searchBox input").value;

    if(value==""){

        alert("Please enter something to search.");

    }

    else{

        alert("Searching for : " + value);

    }

}

// =====================
// CART
// =====================

var cart = 0;

function addCart(){

    cart++;

    document.getElementById("cartCount").innerHTML = cart;

    alert("Product Added To Cart");

}

// =====================
// LOGIN
// =====================

function loginPage(){

    window.location.href="login.html";

}

// =====================
// SMOOTH SCROLL
// =====================

window.onscroll=function(){

    if(document.documentElement.scrollTop>150){

        console.log("Scrolling...");

    }

}