function getRecipes()
{
    let container = document.querySelector(".recipesContainer");
    container.innerHTML = "";

    axios.get(`${serverUrl}/recipes`).then(res => {
        for (let i = 0; i < res.data.length; i++) {
            CreateRecipeCards(res.data[i]);
        }
    });
    
    getCategories();
};

function CreateRecipeCards(data)
{   
    //Creating elements

    let container = document.querySelector(".recipesContainer");
    let card = document.createElement("div");

    let headerTitle = document.createElement("div");
    let title = document.createElement("h4");
    let categoryTitle = document.createElement("h7");

    let hr = document.createElement("hr");

    let time = document.createElement("p");
    let calorie = document.createElement("p");

    let additionsTitle = document.createElement("h7");

    let additions = document.createElement("p");


    //Adding stuff to them
    card.classList.add("card");
    headerTitle.classList.add("p-3");

    title.innerHTML = data.title;

    let category = {
        id: data.catID
    }

    axios.post(`${serverUrl}/category`, category).then(res => {
        categoryTitle.innerHTML = res.data[0].name;
    });

    headerTitle.appendChild(title);
    headerTitle.appendChild(categoryTitle);
    card.appendChild(headerTitle);
    card.appendChild(hr);

    time.innerHTML = "Time: " + data.time + " min";
    calorie.innerHTML = "Calories: " + data.calorie;

    time.classList.add("textIndent");
    calorie.classList.add("textIndent");

    card.appendChild(time);
    card.appendChild(calorie);

    additionsTitle.innerHTML = "Additions:";
    additionsTitle.classList.add("textIndent");

    additions.innerHTML = data.additions;
    additions.classList.add("textIndent");
 
    card.appendChild(additionsTitle);
    card.appendChild(additions);

    if (loggedUser)
    {
        if (data.userID == loggedUser[0].id || loggedUser[0].role == "admin")
            {
                let buttonContainer = document.createElement("div");
                buttonContainer.classList.add("d-flex", "justify-content-center", "mb-3");
        
                let cardModifyBTN = document.createElement("button");
                cardModifyBTN.classList.add("btn", "btn-warning");
                cardModifyBTN.innerHTML = "Modify";
                cardModifyBTN.setAttribute("data-bs-toggle", "modal");
                cardModifyBTN.setAttribute("data-bs-target", "#recipeModal");
                cardModifyBTN.onclick = function() {ModifyCardPopUp(data)};
            
                let cardDeleteBTN = document.createElement("button");
                cardDeleteBTN.classList.add("btn", "btn-danger", "me-1");
                cardDeleteBTN.innerHTML = "Delete";
                cardDeleteBTN.onclick = function() {DeleteCard(data)};
            
                buttonContainer.appendChild(cardDeleteBTN);
                buttonContainer.appendChild(cardModifyBTN);
            
                card.appendChild(buttonContainer);
            }
    }

    container.appendChild(card);
};

function getCategories()
{
    let categories = document.getElementById("category");
    categories.innerHTML = "";

    let filter = document.getElementById('filter');
    filter.innerHTML = "";

    let modalCategories = document.getElementById("categoryModal");
    modalCategories.innerHTML = "";

    let selectText = document.createElement("option");
    selectText.innerText = "Select a category..";
    categories.appendChild(selectText);

    let selectText2 = document.createElement("option");
    selectText2.innerText = "All categories";
    filter.appendChild(selectText2);

    axios.get(`${serverUrl}/categories`).then(res => {
        res.data.forEach(item => {
            let option = document.createElement("option");
            option.innerHTML = item.name;
            option.value = item.id;
            categories.appendChild(option);

            let option2 = document.createElement("option");
            option2.innerHTML = item.name;
            option2.value = item.id;
            filter.appendChild(option2);

            let option3 = document.createElement("option");
            option3.innerHTML = item.name;
            option3.value = item.id;
            modalCategories.appendChild(option3);
        });
    });
};

function addRecipe()
{
    if (document.querySelector("#category").selectedIndex == 0)
    {
        alert("Missing fields!");
        return;
    }

    let recipe = {
        userID: loggedUser[0].id,
        title: document.querySelector("#title").value,
        category: document.querySelector("#category").value,
        time: document.querySelector("#time").value,
        calories: document.querySelector("#calories").value,
        additions: document.querySelector("#additions").value
    };

    axios.post(`${serverUrl}/upload`, recipe).then(res => {
        alert(res.data);

        if(res.status == 200)
        {
            document.querySelector(".recipesContainer").innerHTML = "";
            getRecipes();
        }
    });
};

function Filter()
{
    let categories = document.getElementById("filter");
    let showMyRecipes = document.getElementById("showMyRecipes");

    let recipesContainer = document.querySelector(".recipesContainer");
    recipesContainer.innerHTML = "";

    if (showMyRecipes.selectedIndex == 0)
    {
        axios.get(`${serverUrl}/recipes`).then(res => {
            if (categories.selectedIndex == 0)
            {
                res.data.forEach(item => {
                    CreateRecipeCards(item);
                });
            }
            else
            {
                res.data.forEach(item => {
                    if (item.catID == categories.value)
                    {
                        CreateRecipeCards(item);
                    }
                });
            }
        });
    }
    else
    {
        axios.get(`${serverUrl}/recipes/${loggedUser[0].id}`).then(res => {
            if (categories.selectedIndex == 0)
            {
                res.data.forEach(item => {
                    CreateRecipeCards(item);
                });
            }
            else
            {
                res.data.forEach(item => {
                    if (item.catID == categories.value)
                    {
                        CreateRecipeCards(item);
                    }
                });
            }
        });
    }
}

function ModifyCardPopUp(data)
{
    document.querySelector("#titleModal").value = data.title;
    document.querySelector("#categoryModal").selectedIndex = data.catID - 1;
    document.querySelector("#timeModal").value = data.time;
    document.querySelector("#caloriesModal").value = data.calorie;
    document.querySelector("#additionsModal").value = data.additions;

    document.querySelector("#modalCardSaveBTN").onclick = function() {ModifyCard(data)};
};

function ModifyCard(data)
{
    let newData = {
        newCatID: document.querySelector("#categoryModal").selectedIndex + 1,
        newTitle: document.querySelector("#titleModal").value,
        newTime: document.querySelector("#timeModal").value,
        newCalorie: document.querySelector("#caloriesModal").value,
        newAdditions: document.querySelector("#additionsModal").value
    }

    axios.patch(`${serverUrl}/recipes/${data.id}`, newData).then(res => {
        alert(res.data);

        if(res.status == 200)
        {
            document.querySelector(".recipesContainer").innerHTML = "";
            getRecipes();
        }
    });
}

function DeleteCard(data)
{
    if (confirm("Are you sure?"))
    {
        axios.delete(`${serverUrl}/recipes/${data.id}`).then(res => {
            alert(res.data);
    
            if (res.status == 202)
            {
                getRecipes();
            }
        });
    }
};