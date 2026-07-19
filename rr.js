function searchItem(){

var search=document.getElementById("searchInput").value.toLowerCase();

if(search=="export"){
window.location="export.html";
}

else if(search=="import"){
window.location="import.html";
}

else if(search=="services"){
window.location="services.html";
}

else if(search=="about"){
window.location="about.html";
}

else if(search=="contact"){
window.location="contact.html";
}

else if(search=="login"){
window.location="login.html";
}

else{
alert("No Result Found");
}

}
function closeVideo(){

    document.getElementById("videoPopup").style.display="none";

}