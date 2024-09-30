function showUsers()
{
    let tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

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
            td3.innerHTML = SwitchOnStatus(user.status);

            let td4 = document.createElement("td");
            td4.classList.add("text-end");

            if (user.id != loggedUser[0].id)
            {
                let modifyBTN = document.createElement("button");
                modifyBTN.classList.add("btn", "btn-warning", "me-1");
                modifyBTN.innerHTML = "Modify";
                modifyBTN.setAttribute("data-bs-toggle", "modal");
                modifyBTN.setAttribute("data-bs-target", "#exampleModal");
                modifyBTN.onclick = function() {ModifyPopUp(user)};
    
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

function ModifyPopUp(user)
{
    console.log(user.role);
    document.querySelector("#roleModal").value = user.role;
    document.querySelector("#statusModal").value = user.status;

    document.querySelector("#modalSaveBTN").onclick = function() {Modify(user)};

}

function Modify(user)
{
    let newDatas = {
        newrole: SwitchOnRole(document.querySelector("#roleModal").selectedIndex),
        newstatus: document.querySelector("#statusModal").value
    };

    axios.patch(`${serverUrl}/users/${user.id}`, newDatas).then(res => {
        alert(res.data);
        
        if (res.status == 202)
        {
            showUsers();
        }
    });
}

function Delete(user)
{
    if (confirm("Are you sure?"))
    {
        axios.delete(`${serverUrl}/users/${user.id}`).then(res => {
            alert(res.data);

            if (res.status == 202)
            {
                showUsers();
            }
        });
    }
}

function SwitchOnStatus(status)
{
    switch (status)
    {
        case 1: return "Enabled";
        case 0: return "Disabled";
        default: return "Enabled";
    }
}

function SwitchOnRole(roleIndex)
{
    switch (roleIndex)
    {
        case 0: return "admin";
        case 1: return "user";
        default: return "user"; 
    }
}