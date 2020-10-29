'use strict';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const closeModla = document.querySelector('.close');

// для  авторизации
const btnAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const loginForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const btnOut = document.querySelector('.button-out');
const local =  localStorage.getItem('delivery');
let login= local ? local : null;
//
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const  cardsMenu = document.querySelector('.cards-menu');
const restaurantTitle = document.querySelector('.restaurant-title');
const menuRating = document.querySelector('.menu-rating');
const menuPrice = document.querySelector('.menu-price');




const getData = async (url) =>{
  const response  = await fetch(url);
  if(!response.ok){
    throw new Error(' Err ${url}');
  }
  return await response.json();
}

/// FUNC
const toggleModal = (event) => {
  modal.classList.toggle("is-open");
}

///
/// BEGIN авториязация
///
const toggleModalAuth = () => {
  modalAuth.classList.toggle("is-open");
}

// проверка овтаризован или нет
const checkAuth = ()=>{
    if(login){
      autorize()
    }else{
      notAutorize()
    }  
};

// если авторизован
const autorize = ()=>{
  const logOut =()=>{
    login=null;
    btnAuth.style.display='';
    userName.style.display='';
    btnOut.style.display='';
    btnOut.removeEventListener('click',logOut);
    localStorage.removeItem('delivery');
    checkAuth();
  }

  btnAuth.style.display='none';
  userName.textContent=login;
  userName.style.display='inline';
  btnOut.style.display='block';
  btnOut.addEventListener('click',logOut);
  
}

// если еще не авторизован
const notAutorize = ()=>{
  
  const logIn =( event) =>{
    if(loginInput.value){
        event.preventDefault();   
        login = loginInput.value;
        localStorage.setItem('delivery',login);
        toggleModalAuth();
        btnAuth.removeEventListener('click', toggleModalAuth);
        closeAuth.removeEventListener('click', toggleModalAuth);
        loginForm.removeEventListener('submit',logIn);
        loginForm.reset();
        checkAuth();
    }
    else{
      event.preventDefault();
      loginInput.focus();
      loginInput.style.outline= '3px solid red';
    }
  };

  btnAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  loginForm.addEventListener('submit',logIn);
};
/// END авториязация
///


///
// CARDS 
const createCardsRest = (rest)=>{

  const card =`
  <a class="card card-restaurant" data-prod="${rest.products}">
    <img src=${rest.image} alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${rest.name}</h3>
        <span class="card-tag tag">${rest.time_of_delivery}</span>
      </div>
      <!-- /.card-heading -->
      <div class="card-info">
        <div class="rating">
          ${rest.stars}
        </div>
        <div class="price">От ${rest.price} ₽</div>
        <div class="category">${rest.kitchen}</div>
      </div>
      <!-- /.card-info -->
    </div>
    <!-- /.card-text -->
  </a>
  <!-- /.card -->`;

  cardsRestaurants.insertAdjacentHTML('afterbegin',card);
}


const createCardGoods = (goods)=>{

  const card =`	<div class="card">
          <img data-id=${goods.id} src=${goods.image} alt="${goods.name}" class="card-image"/>
          <div class="card-text">
            <div class="card-heading">
              <h3 class="card-title card-title-reg">${goods.name}</h3>
            </div>
            <!-- /.card-heading -->
            <div class="card-info">
              <div class="ingredients">${goods.description}</div>
            </div>
            <!-- /.card-info -->
            <div class="card-buttons">
              <button class="button button-primary button-add-cart">
                <span class="button-card-text">В корзину</span>
                <span class="button-cart-svg"></span>
              </button>
              <strong class="card-price-bold">${goods.price}</strong>
            </div>
          </div>
          <!-- /.card-text -->
        </div>
        <!-- /.card -->`;
        cardsMenu.insertAdjacentHTML('afterbegin',card)

};

const openGoods = (event)=>{
  const target = event.target;
  const restarant = target.closest('.card-restaurant');  
  const restName = restarant.querySelector('.card-title ');
  const restRate = restarant.querySelector('.rating');
  const restPrice = restarant.querySelector('.price');
 
 
  if(restarant){    
    cardsMenu.textContent='';
    containerPromo.classList.add('hide');
    restaurants.classList.add('hide');
    menu.classList.remove('hide');   
    restaurantTitle.textContent=restName.textContent;
    menuRating.textContent= restRate.textContent;
    menuPrice.textContent=restPrice.textContent;  
    getData(`./db/${restarant.dataset.prod}`).then(data => {
      data.forEach(createCardGoods);
    })  
    
  }
};

const init = () =>{

// all event
cartButton.addEventListener("click", event =>toggleModal(event));
closeModla.addEventListener("click", event =>toggleModal(event));
cardsRestaurants.addEventListener('click', openGoods);
logo.addEventListener('click',()=>{
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
})

/// all calls
getData('./db/partners.json').then(data => {
  data.forEach(createCardsRest);
})
checkAuth();
}

// main func
init();



