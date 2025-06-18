let searchstaff = (str) => {

    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let tablebody = document.getElementById("tbody");
            tablebody.innerHTML = "";

            const jsonobj = JSON.parse(this.responseText);

            if (jsonobj.length === 0) {
                let row = document.createElement("tr");
                let column = document.createElement("td");
                column.setAttribute("colspan", "8");
                column.innerHTML = "<span class='text-danger'>No matching staff found.</span>";
                row.appendChild(column);
                tablebody.appendChild(row);
                return;
            }

            jsonobj.forEach((item, index) => {
                let row = document.createElement("tr");

                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td>${item.email}</td>
                    <td>${item.contact_no}</td>
                    <td>${item.salary}</td>
                    <td>${item.password}</td>
                    <td><a href='/UpdateStaff?id=${item.staff_id}'><i class='fa-regular fa-pen-to-square'></i></a></td>
                    <td><a href='/DeleteStaff?id=${item.staff_id}'><i class='fa-solid fa-trash text-danger'></i></a></td>
                `;

                tablebody.appendChild(row);
            });
        }
    };

    xhttp.open("GET", "/SearchStaff?sname=" + encodeURIComponent(str), true);
    xhttp.send();
};
