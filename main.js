//* Duzenleme Secenekleri
let editFlag = false; //*duzenleme modun da olup olmadigini belirtir
let editElement; //duzenleme yapilan ogeyi temsil encodeURI.
let editId = "";
//* gerekli HTML elementlerini secme 
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const list = document.querySelector(".grocery-list");
const alert = document.querySelector(".alert");
const submitBtn = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn");


//! Fonksiyonlar
const displayAlert = (text, action) => {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 2000);

};
const addItem = (e) => {
  e.preventDefault(); //Formun gonderilma olainda sayfanin yenilenmesini engeller.
  const value = grocery.value; //* Inputun icine girilen degeri aldik.
  const id = new Date().getTime().toString(); //* benzersiz bir id olusturduk.


  //* Eger inputun icerisi bos degilse ve duzenleme modunda degilse
  if (value !== "" && !editFlag) {
    const element = document.createElement("article"); //* Yeni bir article ogesi olustur.
    let attr = document.createAttribute("data-id"); //* Yeni bir veri kimligi olustur
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("grocery-item");
    element.innerHTML = `
        <p class="title">${value}</p>
        <div class="btn-container">
          <button type="button" class="edit-btn">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button type="button" class="delete-btn">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
        `;
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    list.appendChild(element);
    displayAlert("Basariyla Eklenildi", "success");
    setBackToDefault();
  } else if (value !== "" && editFlag) {
    editElement.innerHTML = value;
    displayAlert("Basariyla Degistirildi", "success");
    console.log(editId);
   editLocalStorage(editId, value);
   setBackToDefault();
  }
};

const setBackToDefault = () => {
  grocery.value = "";
  editFlag = false;
  editId = "";
  submitBtn.textContent = "Ekle";
};

const deleteItem = (e) => {

  const element = e.target.parentElement.parentElement.parentElement;
  const id =element.dataset.id;
  console.log(element);
  list.removeChild(element);
  displayAlert("Basariyla Kaldirildi", "danger");

  removeFromLocalStorage(id);
  };
const editItem = (e) => {
  const element = e.target.parentElement.parentElement.parentElement;
  editElement = (e.target.parentElement.parentElement.previousElementSibling);
  grocery.value = editElement.innerText;
  editFlag = true;
  editId = element.dataset.id;
  submitBtn.textContent = "Duzenle";
  console.log(editId);
};

const clearItems = () => {
  const items = document.querySelectorAll(".grocery-item");
  //* Listede article etiketi var mı
  if (items.length > 0) {
    items.forEach((item) => list.removeChild(item));
  }
  clearBtn.style.display = "none"
  displayAlert("Liste Bos", "danger");
  localStorage.removeItem("list");
};

const addToLocalStorage = (id, value) => {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  console.log(items);
  localStorage.setItem("list", JSON.stringify(items));
};

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

const removeFromLocalStorage=(id)=>{
  let items = getLocalStorage();
  items= items.filter((item) => item.id !== id);
  localStorage.setItem("list",JSON.stringify(items));
};

const editLocalStorage =(id,value)=>{
let items = getLocalStorage();

items.map((item) => {
  if(item.id === id){
    item.value =value;
  }
  return item;
}) ;
console.log(items);
localStorage.setItem("list",JSON.stringify(items));
};


const createlistItem = (id, value) => {
  const element = document.createElement("article"); //* Yeni bir article ogesi olustur.
  let attr = document.createAttribute("data-id"); //* Yeni bir veri kimligi olustur
  attr.value = id;
  element.setAttributeNode(attr);
  element.classList.add("grocery-item");
  element.innerHTML = `
        <p class="title">${value}</p>
        <div class="btn-container">
          <button type="button" class="edit-btn">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button type="button" class="delete-btn">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
        `;
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);
  list.appendChild(element);
};

const setupItems = () => {
  let items = getLocalStorage();
 
  if (items.length > 0) {
    items.forEach((item) => {
      createlistItem(item, id, item.value);
    });
  }
};

//! Olay Izleyicileri

//* Form gonderildiginde addItem fonksiyonu calisir.
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);