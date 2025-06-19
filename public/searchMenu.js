let searchMenu = (str) => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let tablebody = document.getElementById("tbody");
            tablebody.innerHTML = "";
            let jsonobj = JSON.parse(this.responseText);
            jsonobj.forEach((item, index) => {
                let row = document.createElement("tr");

                let column = document.createElement("td");
                column.innerHTML = index + 1;
                row.appendChild(column);

                column = document.createElement("td");
                column.innerHTML = item.item_name;
                row.appendChild(column);

                column = document.createElement("td");
                column.innerHTML = item.price;
                row.appendChild(column);

                column = document.createElement("td");
                column.innerHTML = item.category_name;
                row.appendChild(column);

                column = document.createElement("td");
                column.innerHTML = item.description;
                row.appendChild(column);

                column = document.createElement("td");
                column.innerHTML = `<img src='/uploads/${item.image}' style='width: 50px; height: 50px;'>`;
                row.appendChild(column);

                column = document.createElement("td");
                column.innerHTML = `<a href='/UpdateMenu?id=${item.id}'><i class='fa-regular fa-pen-to-square'></i></a>`;
                row.appendChild(column);

                column = document.createElement("td");
                column.innerHTML = `<a href='/DeleteMenu?id=${item.id}'><i class='fa-solid fa-trash text-danger'></i></a>`;
                row.appendChild(column);

                tablebody.appendChild(row);
            });
        }
    };
    xhttp.open("GET", "/SearchMenu?name=" + str, true);
    xhttp.send();
};
