// =========================
// Export & Import Categories
// =========================

const exportCategories = [
    "Jaggery",
    "Metal Springs",
    "Turmeric",
    "Organic Fertilizers"
];

const importCategories = [
    "Drinkware",
    "Stemware",
    "Decorative Glass",
    "Glass Tableware",
    "Speciality Glass",
    "Glass Containers"
];

let products = JSON.parse(localStorage.getItem("products")) || [];

let editIndex = -1;

// =========================
// Product Type Change
// =========================

document.getElementById("productType").addEventListener("change", function(){

    let category = document.getElementById("category");

    category.innerHTML="";

    if(this.value=="Export"){

        exportCategories.forEach(function(item){

            category.innerHTML +=
            `<option>${item}</option>`;

        });

    }

    else if(this.value=="Import"){

        importCategories.forEach(function(item){

            category.innerHTML +=
            `<option>${item}</option>`;

        });

    }

    updateCategoryFilter();

});

// =========================
// Save Product
// =========================

document.getElementById("productForm").addEventListener("submit",function(e){

    e.preventDefault();

    let image=document.getElementById("productImage").files[0];

    let imageURL="images/noimage.png";

    if(image){

        imageURL=URL.createObjectURL(image);

    }

    let product={

        image:imageURL,

        type:document.getElementById("productType").value,

        category:document.getElementById("category").value,

        name:document.getElementById("productName").value,

        price:document.getElementById("price").value,

        unit:document.getElementById("unit").value,

        status:document.getElementById("status").value,

        featured:document.getElementById("featured").checked,

        shortDesc:document.getElementById("shortDesc").value,

        longDesc:document.getElementById("longDesc").value,

        date:new Date().toLocaleDateString()

    };

    if(editIndex==-1){

        products.push(product);

    }

    else{

        products[editIndex]=product;

        editIndex=-1;

    }

    localStorage.setItem("products",JSON.stringify(products));

    document.getElementById("productForm").reset();

    displayProducts();

});
// ===============================
// Display Products
// ===============================

function displayProducts(){

    let tbody = document.querySelector("#productTable tbody");

    tbody.innerHTML = "";

    let exportCount = 0;
    let importCount = 0;

    products.forEach(function(product,index){

        if(product.type=="Export"){
            exportCount++;
        }

        if(product.type=="Import"){
            importCount++;
        }

        let statusClass =
        product.status=="Active" ?
        "active-status" :
        "inactive-status";

        let featured =
        product.featured ?
        "⭐ Yes" :
        "No";

        tbody.innerHTML += `

        <tr>

        <td>

        <img src="${product.image}" width="60">

        </td>

        <td>${product.name}</td>

        <td>${product.type}</td>

        <td>${product.category}</td>

        <td>₹ ${product.price}</td>

        <td>${product.unit}</td>

        <td>

        <span class="${statusClass}">

        ${product.status}

        </span>

        </td>

        <td>${featured}</td>

        <td>${product.date}</td>

        <td>

        <button
        class="edit-btn"
        onclick="editProduct(${index})">

        <i class="fa-solid fa-pen"></i>

        </button>

        <button
        class="delete-btn"
        onclick="deleteProduct(${index})">

        <i class="fa-solid fa-trash"></i>

        </button>

        </td>

        </tr>

        `;

    });

    document.getElementById("totalProduct").innerHTML =
    products.length;

    document.getElementById("exportCount").innerHTML =
    exportCount;

    document.getElementById("importCount").innerHTML =
    importCount;

}

// ===============================
// Delete Product
// ===============================

function deleteProduct(index){

    let check = confirm("Delete this product ?");

    if(check){

        products.splice(index,1);

        localStorage.setItem(
        "products",
        JSON.stringify(products)
        );

        displayProducts();

    }

}

// ===============================
// Edit Product
// ===============================

function editProduct(index){

    let p = products[index];

    document.getElementById("productType").value =
    p.type;

    document.getElementById("productType").dispatchEvent(
    new Event("change")
    );

    document.getElementById("category").value =
    p.category;

    document.getElementById("productName").value =
    p.name;

    document.getElementById("price").value =
    p.price;

    document.getElementById("unit").value =
    p.unit;

    document.getElementById("status").value =
    p.status;

    document.getElementById("featured").checked =
    p.featured;

    document.getElementById("shortDesc").value =
    p.shortDesc;

    document.getElementById("longDesc").value =
    p.longDesc;

    editIndex = index;

}

// ===============================
// Search Product
// ===============================

function searchProduct(){

    let value =
    document.getElementById("search")
    .value
    .toLowerCase();

    let rows =
    document.querySelectorAll("#productTable tbody tr");

    rows.forEach(function(row){

        let name =
        row.cells[1].innerText.toLowerCase();

        if(name.includes(value)){

            row.style.display="";

        }

        else{

            row.style.display="none";

        }

    });

}

// ===============================
// Filter Products
// ===============================

function filterProducts(){

    let type =
    document.getElementById("filterType").value;

    let category =
    document.getElementById("filterCategory").value;

    let rows =
    document.querySelectorAll("#productTable tbody tr");

    rows.forEach(function(row){

        let rowType =
        row.cells[2].innerText;

        let rowCategory =
        row.cells[3].innerText;

        let typeMatch =
        (type=="All" || rowType==type);

        let categoryMatch =
        (category=="All" ||
        rowCategory==category);

        if(typeMatch && categoryMatch){

            row.style.display="";

        }

        else{

            row.style.display="none";

        }

    });

}

// ===============================
// Update Category Filter
// ===============================

function updateCategoryFilter(){

    let filter =
    document.getElementById("filterCategory");

    filter.innerHTML =
    `<option value="All">All Categories</option>`;

    exportCategories.forEach(function(item){

        filter.innerHTML +=
        `<option>${item}</option>`;

    });

    importCategories.forEach(function(item){

        filter.innerHTML +=
        `<option>${item}</option>`;

    });

}

// ===============================
// Pagination
// ===============================

let page = 1;

function nextPage(){

    page++;

    document.getElementById("pageNumber").innerHTML =
    "Page " + page;

}

function previousPage(){

    if(page>1){

        page--;

        document.getElementById("pageNumber").innerHTML =
        "Page " + page;

    }

}

// ===============================
// Load
// ===============================

updateCategoryFilter();

displayProducts();