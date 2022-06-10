// ***** select items ***** //
const alert = document.querySelector(".alert")
const form = document.querySelector(".form-shop")
const itemsInput = document.querySelector("#items")
const submitBtn = document.querySelector(".submit-btn")
const container = document.querySelector(".list-container")
const list = document.querySelector(".items-shop-list")
const clearBtn = document.querySelector(".clear-btn")
const tempBtn = document.querySelector("#btnTemp")
const resetBtn = document.querySelector("#reset")
const lightMode = document.querySelector("#light")
const darkMode = document.querySelector("#dark")
// edit options //


let editElement;
let editFlag = false;
let editID = "";



// EVENT LISTENERS //
//submit form
form.addEventListener("submit", addItem)
// borrar todos los items
clearBtn.addEventListener("click", clearItems)

//mostrar temperatura
tempBtn.addEventListener("click", () => {
    let key = "0ca063b746578ffb14d9f9455bdb165a"

            let ciudad = document.querySelector('#ciudad').value
            ciudad = encodeURIComponent(ciudad)

            let url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${key}`

            console.log(url)

            if (ciudad != "") {
                fetch(url)
                    .then((data) => {
                        return data.json()
                    })
                    .then((clima) => {
                        console.log(clima)
                        let temp = clima.main.temp
                        let tempC = temp - 273.15;
                        let html = document.querySelector("#temperatura")
                        html.innerHTML = `La temperatura actual en ${ciudad} es de ${tempC.toFixed(0)} °C`


                        if (tempC <= 15) {
                            html.className = "frio"
                        } else {
                            html.className = "calor"
                        }

                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
            resetBtn.reset()
})

// load items
window.addEventListener("DOMContentLoaded", setupList)

// functions

function addItem(e){
    e.preventDefault();
    const value = itemsInput.value;

    const id = new Date().getTime().toString()

if(value && !editFlag){
createListItem(id,value)

            //display alert
            // toastify
            Toastify({

                text: "Item agregado",
                style:{
                    background: "green"
                },
                className: "toast-center",
                duration: 1000
                
                }).showToast();
            //displayAlert("item agregado con exito", "success");
            // show container
            container.classList.add("show-container")
            // add to local storage
            addToLocalStorage(id,value);
            // set back to default
            setBackToDefault()
 
}
else if(value && editFlag ){
    editElement.innerHTML = value;
    //toastify
    Toastify({

        text: "Item modificado",
        style:{
            background: "green"
        },
        className: "toast-center",
        duration: 1000
        
        }).showToast();

    //displayAlert("item modificado", "success");
    // edit local storage
    editLocalStorage(editID,value);
    setBackToDefault();
}
else{
    //toastify
    Toastify({

        text: "Por favor ingrese un valor",
        style:{
            background: "red"
        },
        className:"animate__animated animate__wobble toast-center",
        duration: 1000
        
        }).showToast();
   //displayAlert("Por favor,ingrese un valor", "danger")
}
}

// display alerts
// function displayAlert(text,action){

//     alert.textContent = text
//     alert.classList.add(`alert-${action}`, "d-inline")
    
// // remover alert
// setTimeout(function(){
//     alert.textContent = ""
//     alert.classList.remove(`alert-${action}`)

// },1000)

// }


// borra todos los items
function clearItems(){
    const items = document.querySelectorAll(".list-item");

    if(items.length > 0){
        items.forEach(function(item){
            list.removeChild(item); 
        })
    }
    container.classList.remove("show-container");
//sweet alert
Swal.fire(
    'Eliminado',
    'Tu lista fue borrada',
    'error'
  )
    //displayAlert("lista borrada exitosamente!", "success");
    setBackToDefault();
    localStorage.removeItem("lista")
}

// edit funcion
function editItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    //set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    // set form value
    itemsInput.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = "Modificar";


   
    
}
// delete function
function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if(list.children.length === 0){
        container.classList.remove("show-container")
    }
    //Toastify
    Toastify({

        text: "Item borrado",
        style:{
            background: "red"
        },
        className: "toast-center",
        duration: 1000
        
        }).showToast();

    //displayAlert("item borrado", "danger");
    setBackToDefault();
    //remove from local storage
    removeFromLocalStorage(id)
}


// set back to default
function setBackToDefault(){
    itemsInput.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "Agregar"
}





// local storage functions

function addToLocalStorage(id,value){
    const miLista = {id,value};
    let items = getLocalStorage();

    items.push(miLista);
    localStorage.setItem("lista", JSON.stringify(items))

}
function removeFromLocalStorage(id){
    let items = getLocalStorage();

    items = items.filter(function(item){
        if(item.id !== id){
            return item
        }
    })
    localStorage.setItem("lista", JSON.stringify(items))

}
function editLocalStorage(id,value){
let items = getLocalStorage();
items = items.map(function(item){
    if(item.id === id){
        item.value = value
    }
    return item;
})
localStorage.setItem("lista", JSON.stringify(items))

}
function getLocalStorage(){
    return localStorage.getItem("lista") ? JSON.parse(localStorage.getItem("lista")) : [];
}



// memo
// localStorage.setItem("lista", JSON.stringify(["item2", "item3"]))
// const lista = JSON.parse(localStorage.getItem("lista"))
// console.log(lista)





// setup list
function setupList(){
    let items = getLocalStorage();
if(items.length > 0){
items.forEach(function(item){
    createListItem(item.id, item.value)
})
container.classList.add("show-container")
}
}

function createListItem(id, value){
    const element = document.createElement("article");
// add class
element.classList.add("list-item")
// add id class
const attr = document.createAttribute("data-id");
attr.value = id;
element.setAttributeNode(attr);
element.innerHTML = `
            <p class="title"> ${value} </p>
            <div class="btn-container">
                <button type="button" title="Editar" class="edit-btn nb-btn">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button type="button" title="Eliminar" class="delete-btn nb-btn">
                    <i class="bi bi-trash3"></i>
                </button>
            </div>`;

        const deleteBtn = element.querySelector(".delete-btn")
        const editBtn = element.querySelector(".edit-btn")

        deleteBtn.addEventListener("click", deleteItem);
        editBtn.addEventListener("click", editItem);

            // apend child
            list.appendChild(element);
}


// modo oscuro y modo luminoso

darkMode.addEventListener("click", () => {
    const section = document.querySelector(".section-center")

    section.classList.remove("light-mode")
    section.classList.add("dark-mode")
})

lightMode.addEventListener("click", () => {
    const section = document.querySelector(".section-center")

    section.classList.remove("dark-mode")
    section.classList.add("light-mode")
})