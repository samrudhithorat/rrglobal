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

var searchButton = document.querySelector("#searchBox button");

searchButton.onclick = function(){

    var text = document.querySelector("#searchBox input").value;

    if(text==""){

        alert("Please enter something to search.");

    }

    else{

        alert("Searching for : " + text);

    }

}

// =====================
// CART
// =====================

var cart = 0;

function addCart(){

    cart++;

    document.getElementById("cartCount").innerHTML = cart;

    alert("Item Added To Cart");

}

// =====================
// LOGIN
// =====================

function loginPage(){

    window.location.href="login.html";

}

// =====================
// SCROLL
// =====================

window.onscroll = function(){

    if(document.documentElement.scrollTop > 150){

        console.log("Scrolling...");

    }

}