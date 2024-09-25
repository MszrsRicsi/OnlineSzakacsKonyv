function getRecipes()
{
    axios.get(`${serverUrl}/recipes`).then(res => {
        for (let i = 0; i < res.data.length; i++) {
            CreateRecipeCards(res.data[i]);
        }
    });

}

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

function addRecipe()
{
    //axios.post(`${serverUrl}/upload`);
}