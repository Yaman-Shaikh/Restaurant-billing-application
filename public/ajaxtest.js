

let ajaximp=(str)=>{
    let xhttp=new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState==4 && this.status==200)
        {
            let tablebody=document.getElementById("tbody");
            tablebody.innerHTML="";
            let responseData=this.responseText;
            let jsonobj=JSON.parse(responseData);
            jsonobj.forEach((item,index)=>{
                let row=document.createElement("tr");
                let column=document.createElement("td");
                column.innerHTML=""+(index+1);
                row.appendChild(column);
                
                column=document.createElement("td");
                column.innerHTML=""+item.name;
                row.appendChild(column);

                  column=document.createElement("td");
                 column.innerHTML = "<a href='/UpdateCategory?id=" + item.id + "'><i class='fa-regular fa-pen-to-square'></i></a>";

                  row.appendChild(column);

                    column=document.createElement("td");
                  column.innerHTML = "<a href='/DeleteCategory?id=" + item.id + "'><i class='fa-solid fa-trash text-danger'></a>";
                  row.appendChild(column);
                    tablebody.appendChild(row);
            });
        }
    };
    xhttp.open("get","/Search?sname=" +str,true);
    xhttp.send();
}