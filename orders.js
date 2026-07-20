// ===============================
// LOAD PRODUCTS
// ===============================

let products = JSON.parse(localStorage.getItem("products")) || [];

let orders = JSON.parse(localStorage.getItem("orders"));

if(!orders){

orders = [

{
id:"#ORD-2456",
date:"24 May 2025",
customer:"Ramesh Traders",
type:"Export",
products:"Jaggery, Turmeric",
amount:45000,
status:"Completed",
payment:"Paid"
},

{
id:"#ORD-2455",
date:"23 May 2025",
customer:"Global Impex",
type:"Import",
products:"Glass Containers",
amount:78500,
status:"Processing",
payment:"Paid"
},

{
id:"#ORD-2454",
date:"23 May 2025",
customer:"Maya Exports",
type:"Export",
products:"Metal Springs",
amount:22000,
status:"Completed",
payment:"Paid"
},

{
id:"#ORD-2453",
date:"22 May 2025",
customer:"Shakti Enterprises",
type:"Import",
products:"Decorative Glass",
amount:36800,
status:"Pending",
payment:"Partial"
},

{
id:"#ORD-2452",
date:"22 May 2025",
customer:"Krishna Suppliers",
type:"Export",
products:"Organic Fertilizers",
amount:19500,
status:"Completed",
payment:"Paid"
},

{
id:"#ORD-2451",
date:"21 May 2025",
customer:"Suresh & Co.",
type:"Import",
products:"Glass Tableware",
amount:88000,
status:"Processing",
payment:"Paid"
},

{
id:"#ORD-2450",
date:"21 May 2025",
customer:"Green Fields Ltd.",
type:"Export",
products:"Turmeric",
amount:24750,
status:"Pending",
payment:"Paid"
},

{
id:"#ORD-2449",
date:"20 May 2025",
customer:"Bhavesh Industries",
type:"Import",
products:"Electronic Components",
amount:64300,
status:"Cancelled",
payment:"Refunded"
}

];

localStorage.setItem("orders",JSON.stringify(orders));

}

// ===============================
// DISPLAY ORDERS
// ===============================

function displayOrders(list=orders){

let tbody=document.querySelector("#ordersTable tbody");

tbody.innerHTML="";

list.forEach(function(order,index){

let statusClass=order.status.toLowerCase();

let paymentClass=order.payment.toLowerCase();

tbody.innerHTML+=`

<tr>

<td>${order.id}</td>

<td>${order.date}</td>

<td>${order.customer}</td>

<td>${order.type}</td>

<td>${order.products}</td>

<td>₹ ${order.amount.toLocaleString()}</td>

<td>

<span class="${statusClass}">

${order.status}

</span>

</td>

<td>

<span class="${paymentClass}">

${order.payment}

</span>

</td>

<td>

<button class="view-btn"

onclick="viewOrder(${index})">

<i class="fa-solid fa-eye"></i>

</button>

<button class="print-btn"

onclick="printOrder(${index})">

<i class="fa-solid fa-print"></i>

</button>

<button class="delete-btn"

onclick="deleteOrder(${index})">

<i class="fa-solid fa-trash"></i>

</button>

</td>

</tr>

`;

});

updateSummary();

}

// ===============================
// SEARCH
// ===============================

function searchOrders(){

let value=document
.getElementById("searchOrder")
.value
.toLowerCase();

let filtered=orders.filter(function(order){

return order.id.toLowerCase().includes(value)

||

order.customer.toLowerCase().includes(value);

});

displayOrders(filtered);

}

// ===============================
// FILTER
// ===============================

function filterOrders(){

let type=document
.getElementById("filterType")
.value;

let status=document
.getElementById("filterStatus")
.value;

let filtered=orders.filter(function(order){

let typeMatch=

(type=="All" ||

order.type==type);

let statusMatch=

(status=="All" ||

order.status==status);

return typeMatch && statusMatch;

});

displayOrders(filtered);

}

// ===============================
// DELETE
// ===============================

function deleteOrder(index){

if(confirm("Delete this order?")){

orders.splice(index,1);

localStorage.setItem(

"orders",

JSON.stringify(orders)

);

displayOrders();

}

}

// ===============================
// VIEW
// ===============================

function viewOrder(index){

let o=orders[index];

alert(

"Order ID : "+o.id+

"\n\nCustomer : "+o.customer+

"\n\nProducts : "+o.products+

"\n\nAmount : ₹"+o.amount+

"\n\nStatus : "+o.status+

"\n\nPayment : "+o.payment

);

}

// ===============================
// PRINT
// ===============================

function printOrder(index){

let o=orders[index];

let win=window.open("");

win.document.write(`

<h2>RR Global Order</h2>

<hr>

<p><b>Order ID :</b> ${o.id}</p>

<p><b>Date :</b> ${o.date}</p>

<p><b>Customer :</b> ${o.customer}</p>

<p><b>Products :</b> ${o.products}</p>

<p><b>Amount :</b> ₹ ${o.amount}</p>

<p><b>Status :</b> ${o.status}</p>

<p><b>Payment :</b> ${o.payment}</p>

`);

win.print();

}

// ===============================
// SUMMARY
// ===============================

function updateSummary(){

let exportCount=0;

let importCount=0;

products.forEach(function(product){

if(product.type=="Export"){

exportCount++;

}

if(product.type=="Import"){

importCount++;

}

});

document.getElementById("totalProduct").innerHTML=products.length;

document.getElementById("exportCount").innerHTML=exportCount;

document.getElementById("importCount").innerHTML=importCount;

document.getElementById("orderCount").innerHTML=orders.length;

}

// ===============================
// PAGINATION
// ===============================

let page=1;

function nextPage(){

page++;

document.getElementById("pageNumber").innerHTML=

"Page "+page;

}

function previousPage(){

if(page>1){

page--;

document.getElementById("pageNumber").innerHTML=

"Page "+page;

}

}

// ===============================
// EXPORT REPORT
// ===============================

document.querySelector(".export-btn").addEventListener("click",function(){

let text="RR Global Orders Report\n\n";

orders.forEach(function(order){

text+=

order.id+" | "+order.customer+

" | ₹"+order.amount+

" | "+order.status+"\n";

});

let blob=new Blob([text],{type:"text/plain"});

let link=document.createElement("a");

link.href=URL.createObjectURL(blob);

link.download="Orders_Report.txt";

link.click();

});

// ===============================
// LOAD
// ===============================

displayOrders();