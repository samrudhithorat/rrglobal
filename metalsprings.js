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

let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.getElementById("cartCount").innerHTML = cart.length;

function addCart() {

    let product = {

        name: "Metal springs",
        category: "Metal springs",
        price: 50,
        quantity: 1,
        image: "metalsprings.jpg"

    };

    let existing = cart.find(item => item.name === product.name);

    if (existing) {

        existing.quantity++;

    } else {

        cart.push(product);

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    document.getElementById("cartCount").innerHTML = cart.length;

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