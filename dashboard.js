// ======================================
// LOAD PRODUCTS FROM LOCAL STORAGE
// ======================================

let products = JSON.parse(localStorage.getItem("products")) || [];

let totalProducts = products.length;
let exportProducts = 0;
let importProducts = 0;

products.forEach(function(product){

    if(product.type=="Export"){
        exportProducts++;
    }

    if(product.type=="Import"){
        importProducts++;
    }

});

// ======================================
// UPDATE DASHBOARD CARDS
// ======================================

document.getElementById("cardProducts").innerHTML = totalProducts;
document.getElementById("cardExport").innerHTML = exportProducts;
document.getElementById("cardImport").innerHTML = importProducts;

document.getElementById("totalProduct").innerHTML = totalProducts;
document.getElementById("exportCount").innerHTML = exportProducts;
document.getElementById("importCount").innerHTML = importProducts;


// ======================================
// ORDERS OVERVIEW LINE CHART
// ======================================

new Chart(document.getElementById("lineChart"),{

    type:"line",

    data:{

        labels:[
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug"
        ],

        datasets:[{

            label:"Orders",

            data:[
                40,
                55,
                60,
                75,
                70,
                85,
                92,
                110
            ],

            borderColor:"#0b2d63",

            backgroundColor:"rgba(11,45,99,.15)",

            fill:true,

            tension:.4,

            pointRadius:4,

            pointBackgroundColor:"#0b2d63"

        }]

    },

    options:{

        responsive:true,

        plugins:{

            legend:{
                display:false
            }

        },

        scales:{

            y:{

                beginAtZero:true

            }

        }

    }

});


// ======================================
// PRODUCTS BY CATEGORY CHART
// ======================================

let categoryCount = {};

products.forEach(function(product){

    if(categoryCount[product.category]){

        categoryCount[product.category]++;

    }

    else{

        categoryCount[product.category]=1;

    }

});

let labels = Object.keys(categoryCount);
let values = Object.values(categoryCount);

if(labels.length==0){

    labels=[
        "Export",
        "Import"
    ];

    values=[
        1,
        1
    ];

}

new Chart(document.getElementById("pieChart"),{

    type:"doughnut",

    data:{

        labels:labels,

        datasets:[{

            data:values,

            backgroundColor:[

                "#0b2d63",
                "#2ecc71",
                "#3498db",
                "#f39c12",
                "#e74c3c",
                "#9b59b6",
                "#1abc9c",
                "#34495e"

            ]

        }]

    },

    options:{

        responsive:true,

        plugins:{

            legend:{

                position:"bottom"

            }

        }

    }

});


// ======================================
// GREETING
// ======================================

let hour = new Date().getHours();

let title = document.querySelector(".heading p");

if(hour < 12){

    title.innerHTML =
    "Good Morning Admin! Welcome back.";

}
else if(hour < 18){

    title.innerHTML =
    "Good Afternoon Admin! Welcome back.";

}
else{

    title.innerHTML =
    "Good Evening Admin! Welcome back.";

}