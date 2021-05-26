function collapse1(){
    let check = document.getElementById("collapsible1");
    let content = document.getElementById("card-content1");
        if (check.checked == true){
      	    content.style.display = "block";
        } else {
            content.style.display = "none";
        }
    }

