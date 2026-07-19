// Search Bar Open and Close

function openSearch() {

    var search = document.getElementById("searchBox");

    if (search.style.display == "block") {

        search.style.display = "none";

    } else {

        search.style.display = "block";

    }

}



// Cart Counter

var count = 0;

function addCart() {

    count++;

    document.getElementById("cartCount").innerHTML = count;

    alert("Product Added to Cart!");

}



// Search Button

var button = document.querySelector("#searchBox button");

button.onclick = function () {

    var value = document.querySelector("#searchBox input").value;

    if (value == "") {

        alert("Please enter a product name.");

    }

    else {

        alert("Searching for : " + value);

    }

}