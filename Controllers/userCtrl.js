function updatePasswd() {
    
    let passwdDatas= {
        oldpasswd: document.querySelector("#oldpasswd").value,
        newpasswd: document.querySelector("#newpasswd").value,
        confirmpasswd: document.querySelector("#confirmpasswd").value
    }

    axios.patch(`${serverUrl}/passwd/${loggedUser[0].id}`, passwdDatas).then(res =>{
        alert(res.data);

        if (res.status == 200) {
            document.querySelector("#oldpasswd").value = "";
            document.querySelector("#newpasswd").value = "";
            document.querySelector("#confirmpasswd").value = "";
        }
    });
}

function updatePhone() {
    
    let phoneDatas= {
        newphone: document.querySelector("#newphone").value
    }

    axios.patch(`${serverUrl}/phone/${loggedUser[0].id}`, phoneDatas).then(res =>{
        alert(res.data);

        if (res.status == 200) {
            document.querySelector("#newphone").value = "";
        }
    });
}

function updateEmail() {
    
    let emailDatas= {
        newemail: document.querySelector("#newemail").value
    }

    axios.patch(`${serverUrl}/email/${loggedUser[0].id}`, emailDatas).then(res =>{
        alert(res.data);

        if (res.status == 200) {
            document.querySelector("#newemail").value = "";
        }
    });
}