'use strict';

/* Elementos que usamos en el HTML */
const newFormElement = document.querySelector('.js-new-form');
const listElement = document.querySelector('.js-list');
const searchButton = document.querySelector('.js-button-search');
const buttonAdd = document.querySelector('.js-btn-add');
const buttonCancelForm = document.querySelector('.js-btn-cancel');
const inputDesc = document.querySelector('.js-input-desc');
const inputPhoto = document.querySelector('.js-input-photo');
const inputName = document.querySelector('.js-input-name');
const inputRace = document.querySelector('.js-input-race');
const linkNewFormElememt = document.querySelector('.js-button-new-form');
const labelMesageError = document.querySelector('.js-label-error');
const input_search_desc = document.querySelector('.js_in_search_desc');
const inputSearchRace = document.querySelector('.js_in_search_race');

/*Elementos API*/
const GITHUB_USER = 'martcastrillo';
const SERVER_URL = `https://dev.adalab.es/api/kittens/${GITHUB_USER}`;

//Objetos con cada gatito
const kittenData_1 = {
  image: 'https://ychef.files.bbci.co.uk/976x549/p07ryyyj.jpg',
  name: 'Anastacio',
  desc: 'Ruiseño, juguetón, le guta estar tranquilo y que nadie le moleste. Es una maravilla acariciarle!',
  race: 'Siamés',
};
const kittenData_2 = {
  image:
    'https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1200-630,f_auto,q_auto:best/newscms/2019_39/3021711/190923-cat-pet-stock-cs-1052a.jpg',
  name: 'Fiona',
  desc: 'Juguetón, le guta estar tranquilo y que nadie le moleste. Es una maravilla acariciarle!',
  race: 'British Shorthair',
};
const kittenData_3 = {
  image:
    'https://images.emedicinehealth.com/images/article/main_image/cat-scratch-disease.jpg',
  name: 'Cielo',
  desc: 'Ruiseño, juguetón, le guta estar tranquilo y que nadie le moleste. Es una maravilla acariciarle!',
  race: 'British Shorthair',
};

// const kittenDataList = [kittenData_1, kittenData_2, kittenData_3];
let kittenDataList = [];

//Guardar en local storage
const kittenListStored = JSON.parse(localStorage.getItem('kittensList'));

//Funciones

//coger la lista de gatitos del servidor e imprimirla por pantalla
//se usa GET y no POST porque solo vamos a OBTENER datos del servidor
//POST es para mandar y recibir datos
//dependerá de la documentación de la API
function getKittensFromApi() {

if (kittenListStored) {
  //si existe el listado de gatitos en el local storage
  // vuelve a pintar el listado de gatitos
  //...
  //completa el código...
  renderKittenList(kittenListStored);
} else {
  //sino existe el listado de gatitos en el local storage
  //haz la petición al servidor
  fetch(SERVER_URL, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.results);
      localStorage.setItem("kittensList", JSON.stringify(data.results));
      renderKittenList(data.results);
    })
    .catch((error) => {
      console.error(error);
    });
}
  
}

function renderKitten(kittenData) {
  const kitten = `<li class="card">
    <article>
      <img
        class="card_img"
        src=${kittenData.image}
        alt="gatito"
      />
      <h3 class="card_title">${kittenData.name}</h3>
      <h3 class="card_race">${kittenData.race}</h3>
      <p class="card_description">
      ${kittenData.desc}
      </p>
    </article>
    </li>`;
  return kitten;
}

function renderKittenList(kittenDataList) {
  listElement.innerHTML = '';
  kittenDataList.map(
    (kitten) => (listElement.innerHTML += renderKitten(kitten))
  ); /* 
  for (const kittenItem of kittenDataList) {
    listElement.innerHTML += renderKitten(kittenItem);
  } */
}

//Mostrar/ocultar el formulario
function showNewCatForm() {
  newFormElement.classList.remove('collapsed');
  labelMesageError.innerHTML = '';
}
function hideNewCatForm() {
  newFormElement.classList.add('collapsed');
  labelMesageError.innerHTML = '';
}

function handleClickNewCatForm(event) {
  event.preventDefault();
  if (newFormElement.classList.contains('collapsed')) {
    showNewCatForm();
  } else {
    hideNewCatForm();
  }
}
//Adicionar nuevo gatito
function addNewKitten(event) {
  event.preventDefault();
  const valueDesc = inputDesc.value;
  const valuePhoto = inputPhoto.value;
  const valueName = inputName.value;
  const valueRace = inputRace.value;
  const newKittenDataObject = {
    image: valuePhoto,
    name: valueName,
    desc: valueDesc,
    race: valueRace,
  };

  if (valueDesc === '' && valuePhoto === '' && valueName === '') {
    labelMesageError.innerHTML = 'Debe rellenar todos los valores';
  } else {
    if (valueDesc !== '' && valuePhoto !== '' && valueName !== '') {
      //que añada el gatito
   
        fetch(SERVER_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newKittenDataObject),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            //Completa y/o modifica el código:
            //Agrega el nuevo gatito al listado
            if (kittenListStored){
              kittenListStored.push(newKittenDataObject);
            }
        
            //Guarda el listado actualizado en el local stoarge
            localStorage.setItem("kittensList", JSON.stringify(newKittenDataObject));
            //Visualiza nuevamente el listado de gatitos
            renderKittenList(newKittenDataObject);
    
            //Limpia los valores de cada input
            resetDataList();
            labelMesageError.innerHTML = 'Mola! Un nuevo gatito en Adalab!';
          } else {
            labelMesageError.innerHTML = 'No se ha podido añadir un nuevo gatito';
          }
         });
  
   
    }
  }
}
//Cancelar la búsqueda de un gatito
function cancelNewKitten(event) {
  event.preventDefault();
  newFormElement.classList.add('collapsed');
  inputDesc.value = '';
  inputPhoto.value = '';
  inputName.value = '';
}

//Filtrar por descripción
function filterKitten(event) {
  event.preventDefault();
  const descrSearchText = input_search_desc.value.toLowerCase();
  const raceSearchText = inputSearchRace.value.toLowerCase();
  listElement.innerHTML = '';
  const kittenDataFilter = kittenDataList
    .filter((kitten) => kitten.desc.toLowerCase().includes(descrSearchText))
    .filter((kitten) => kitten.race.toLowerCase().includes(raceSearchText));
  renderKittenList(kittenDataFilter);
}

function resetDataList() {
  inputDesc.value = '';
  inputPhoto.value = '';
  inputName.value = '';
  inputRace.value = '';
}

//Mostrar el litado de gatitos en ell HTML
getKittensFromApi();




//Eventos
linkNewFormElememt.addEventListener('click', handleClickNewCatForm);
searchButton.addEventListener('click', filterKitten);
buttonAdd.addEventListener('click', addNewKitten);
buttonCancelForm.addEventListener('click', cancelNewKitten);
