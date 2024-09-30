function getRecipes()
{
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

    let container = document.querySelector(".recipesContainer")
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

    axios.get(`${serverUrl}/categories`).then(res => {
        for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].id == data.catID)
            {
                categoryTitle.innerHTML = res.data[i].name;
                break;
            }
        }
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
    card.append(additions);

    container.appendChild(card);
};

function getCategories()
{
    let categories = document.getElementById("category");
    categories.innerHTML = "";

    let filter = document.getElementById('filter');
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

function sortByCategory() {

    let filter = document.getElementById("filter")

    let recipesContainer=document.querySelector(".recipesContainer")
    recipesContainer.innerHTML="";

    axios.get(`${serverUrl}/recipes`).then(res => {
        for (let i = 0; i < res.data.length; i++) {

            if (filter.value == res.data[i].catID){
                CreateRecipeCards(res.data[i]);
            }
            
        }
    });
    if (filter.selectedIndex==0) {
        getRecipes()
    }
}