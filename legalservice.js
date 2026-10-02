// ================= SEARCH BAR =================

function openSearch(){

    var search = document.getElementById("searchBox");

    if(search.style.display=="block"){

        search.style.display="none";

    }

    else{

        search.style.display="block";

    }

}


// ================= CART =================

var count = 0;

function addCart(){

    count++;

    document.getElementById("cartCount").innerHTML = count;

    alert("Item Added To Cart");

}


// ================= SEARCH BUTTON =================

var button = document.querySelector("#searchBox button");

button.onclick = function(){

    var text = document.querySelector("#searchBox input").value;

    if(text==""){

        alert("Please enter something to search.");

    }

    else{

        alert("Searching for : " + text);

    }

}


// ================= LOGIN =================

function loginPage(){

    window.location.href="login.html";

}


// ================= SCROLL =================

window.onscroll=function(){

    if(document.documentElement.scrollTop>200){

        console.log("Scrolling...");

    }

}