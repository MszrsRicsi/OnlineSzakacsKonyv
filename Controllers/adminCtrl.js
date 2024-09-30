function showUsers()
{
    let tbody = document.querySelector("tbody");

    axios.get(`${serverUrl}/users`).then(res => {
        res.data.forEach(user => {
            let tr = document.createElement("tr");
            tr.style = "height: 50px"
            let td1 = document.createElement("td");
            td1.innerHTML = user.name;
            let td2 = document.createElement("td");
            td2.classList.add("text-center");
            td2.innerHTML = user.role;
            let td3 = document.createElement("td");
            td3.classList.add("text-center");
            td3.innerHTML = user.status;

            let td4 = document.createElement("td");
            td4.classList.add("text-end");

            if (user.id != loggedUser[0].id)
            {
                let modifyBTN = document.createElement("button");
                modifyBTN.classList.add("btn", "btn-warning", "me-1");
                modifyBTN.innerHTML = "Modify";
                modifyBTN.setAttribute("data-bs-toggle", "modal");
                modifyBTN.setAttribute("data-bs-target", "#exampleModal");
                modifyBTN.onclick = function() {ModifyModal(user)};
    
                let deleteBTN = document.createElement("button");
                deleteBTN.classList.add("btn", "btn-danger");
                deleteBTN.innerHTML = "Delete";
                deleteBTN.onclick = function() {Delete(user)};
    
                td4.appendChild(modifyBTN);
                td4.appendChild(deleteBTN);
            }

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tbody.appendChild(tr);
        });
    });
}

function ModifyModal(user)
{
    let modifiyBTN = document.querySelector("#modifyBTN");
    modifiyBTN.onclick = function() {document.querySelector("#exampleModal").modal()};
}

function Modify()
{

}

function Delete(user)
{
    console.log(user.id);
}