const serverUrl = 'http://localhost:3000';

let loggedUser = null;

async function render(view){
    let main = document.querySelector('main');
    main.innerHTML = await (await fetch(`Views/${view}.html`)).text();

    switch (view)
    {
        case "recipes":
            getRecipes();
            toggleAddRecipeVisibility();
            break;
        case "users":
            showUsers();
            break;
        case "statistics":
            getStats()
            break;
    }
};

function renderNavItems(){
    let lgdOutNavItems = document.querySelectorAll('.lgdOut');
    let lgdInNavItems = document.querySelectorAll('.lgdIn');
    let admNavItems = document.querySelectorAll('.lgdAdm');

    if (loggedUser == null)
    {
        lgdInNavItems.forEach(item =>{
            item.classList.add('d-none');
        });

        lgdOutNavItems.forEach(item => {
            item.classList.remove('d-none');
        });

        admNavItems.forEach(item => {
            item.classList.add('d-none');
        });
        return;
    }
    else
    {
        lgdInNavItems.forEach(item => {
            item.classList.remove('d-none');
        });
    
        lgdOutNavItems.forEach(item => {
            item.classList.add('d-none');
        });

        if (loggedUser[0].role == 'admin'){
            admNavItems.forEach(item => {
                item.classList.remove('d-none');
            });
        }
        else{
            admNavItems.forEach(item => {
                item.classList.add('d-none');
            });
        }
    }

    document.querySelector('#profile').innerHTML = loggedUser[0].name;
};

function logOut()
{
    localStorage.removeItem("onlineszakacskonyv");
    loggedUser = null;
    renderNavItems();
    render('login');
    document.querySelector('#profile').innerHTML = "";
};

function register()
{
    let newUser = {
        name: document.querySelector('#name').value,
        email: document.querySelector('#email').value,
        phone: document.querySelector('#phone').value,
        passwd: document.querySelector('#passwd').value,
        confirm: document.querySelector('#confirm').value
    }

    axios.post(`${serverUrl}/reg`, newUser).then(res => {
        alert(res.data);
    });

    document.querySelector('#name').innerHTML="";
    document.querySelector('#email').innerHTML="";
    document.querySelector('#passwd').innerHTML="";
    document.querySelector('#confirm').innerHTML="";
    render('login')
};

function login()
{
    let user = {
        email: document.querySelector('#email').value,
        passwd: document.querySelector('#passwd').value
    }

    axios.post(`${serverUrl}/login`, user).then(res => {
        if (res.status != 202){
            alert(res.data);
            return;
        }

        loggedUser = res.data;
        localStorage.setItem('onlineszakacskonyv', JSON.stringify(loggedUser));
        renderNavItems();
        render('recipes');
    });
};

if (localStorage.getItem('onlineszakacskonyv'))
{
    loggedUser = JSON.parse(localStorage.getItem('onlineszakacskonyv'));
    render('recipes');
}
else
{
    render('login');
};

renderNavItems();

function toggleAddRecipeVisibility()
{
    let newRecipe = document.querySelector("#newRecipe");

    if (loggedUser == null)
    {
        newRecipe.classList.add("d-none");
    }
    else
    {
        newRecipe.classList.remove("d-none");
    }
}

function authorize(){
    let res = {
         headers: { "Authorization": loggedUser[0].id }
    }
    return res;
}