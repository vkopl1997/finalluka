// Copy menu for mobile
function copyMenu() {
  // Copy dpt category to departments
  let dptCategory = document.querySelector('.dpt-cat');
  let dptPlace = document.querySelector('.departments');
  dptPlace.innerHTML = dptCategory.innerHTML;

  // Copy nav info to off-canvas nav
  let mainNav = document.querySelector('.header-nav nav');
  let navPlace = document.querySelector('.off-canvas nav');
  navPlace.innerHTML = mainNav.innerHTML;

  // Copy .header-top .wrapper to thetop-nav
  let topNav = document.querySelector('.header-top .wrapper');
  let topPlace = document.querySelector('.off-canvas .thetop-nav');
  topPlace.innerHTML = topNav.innerHTML;
}

copyMenu();

// Show menu
const menuButton = document.querySelector('.trigger');
const closeButton = document.querySelector('.t-close');
const siteOff = document.querySelector('.site-off');

menuButton.addEventListener('click', function () {
  siteOff.classList.toggle('showmenu');
});

closeButton.addEventListener('click', function () {
  siteOff.classList.remove('showmenu');
});

// Show submenu on mobile
const subMenus = document.querySelectorAll('.has-child .icon-small');
subMenus.forEach(menu => menu.addEventListener('click', toggleSubMenu));

function toggleSubMenu(e) {
  e.preventDefault();
  console.log('Submenu icon clicked');
  subMenus.forEach(item => {
    if (item !== this) {
      item.closest('.has-child').classList.remove('expand');
    }
  });

  this.closest('.has-child').classList.toggle('expand');
}

// slider
const swiper = new Swiper('.swiper', {
  loop: true,
  pagination: {
    el: '.swiper-pagination',
  },
});

// Show & hide shopping cart
let cartButton = document.querySelector('.side-bar-show');
let cartSidebar = document.querySelector('.cart-sidebar');
let closeIcon = document.querySelector('.close-sidebar');

cartButton.addEventListener('click', function () {
  cartSidebar.style.right = '0';
});

closeIcon.addEventListener('click', function () {
  cartSidebar.style.right = '-400px';
});


let fetchedProducts = [];

function fetchProducts() {
  fetch('https://api.escuelajs.co/api/v1/products')
    .then(response => response.json())
    .then(data => {
      fetchedProducts = data;
      displayItems(fetchedProducts.slice(0, 30));
      addClickEventToShoppingCartIcon();
    })
    .catch(error => {
      console.error(error);
    });
}

fetchProducts();

const searchForm = document.querySelector('.search');
searchForm.addEventListener('submit', handleSearch);



function handleSearch(event) {
  event.preventDefault();

  const searchInput = document.querySelector('.search input');
  const query = searchInput.value.trim().toLowerCase();

  const searchResults = fetchedProducts.filter(product =>
    product.title.toLowerCase().includes(query)
  );

  searchInput.value = '';

  const popupContainer = document.getElementById('popupContainer');

  popupContainer.innerHTML = '';

  const firstSixResults = searchResults.slice(0, 6);

  if (firstSixResults.length > 0) {
    firstSixResults.forEach(product => {
      const popupContent = document.createElement('div');
      popupContent.classList.add('popup-content');

      popupContent.innerHTML = `
        <div class='row products mini'>
          <div class='item'>
            <div class="media">
              <div class="thumbnail object-cover">
                <a href="#">
                  <img src="${product.images[0]}" alt="${product.title}">
                </a>
              </div>
              <div class="hoverable">
                <ul>
                  <li class="active">
                    <i class="ri-shopping-cart-line shopping-cart-icon" data-id="${product.id}" data-image="${product.images[0]}" data-name="${product.title}" data-price="${product.price}"></i>
                  </li>
                  <li><a href=""><i class="ri-eye-line"></i></a></li>
                  <li><a href=""><i class="ri-shuffle-line"></i></a></li>
                </ul>
              </div>
            </div>
            <div class="content">
              <h3 class="main-links search-title"><a href="#">${product.title}</a></h3>
              <div class="price">
                <span class="current search-title">${product.price.toFixed(2)} $</span>
              </div>
              <div class="mini-text">
                <p>${product.id} sold</p>
                <p>Free Shipping</p>
              </div>
            </div>
          </div>
        </div>
      `;

      const cartIcon = popupContent.querySelector('.shopping-cart-icon');
      cartIcon.addEventListener('click', handleAddToCart);

      popupContainer.appendChild(popupContent);
    });

    popupContainer.style.display = 'grid';
  } else {
    popupContainer.style.display = 'none';
  }

  let searchX = document.querySelector('.search-x');

  if (firstSixResults) {
    searchX.style.display = 'block';
  } else {
    searchX.style.display = 'none';
  }

  let search_X = document.querySelector('.search-x');
  search_X.addEventListener('click', function () {
    const popupContainer = document.getElementById('popupContainer');
    popupContainer.innerHTML = '';
    popupContainer.style.display = 'none';
    searchX.style.display = 'none';
  });
}

function handleAddToCart(event) {
  event.stopPropagation();

  const id = this.dataset.id;
  const image = this.dataset.image;
  const name = this.dataset.name;
  const price = this.dataset.price;

  const newItem = {
    id: id,
    image: image,
    name: name,
    price: price,
    quantity: 1
  };

  addToCart(newItem);

  updateCartTotal();
  updateCartItemsCount();
}


function handleClear() {
  const popupContainer = document.getElementById('popupContainer');
  const searchInput = document.querySelector('.search input');

  // Reset the search input field
  searchInput.value = '';

  // Clear the previous content in the popup container
  popupContainer.innerHTML = '';

  // Hide the popup container
  popupContainer.style.display = 'none';
}


function displayItems(products) {
  const container = document.querySelectorAll('.row.products.mini');

  products.forEach((product, index) => {
    const itemElement = document.createElement('div');
    itemElement.className = 'item';
    itemElement.setAttribute('data-id', product.id);

    itemElement.innerHTML = `
      <div class="media">
          <div class="thumbnail object-cover">
              <a href="#">
                  <img src="${product.images[0]}" alt="${product.title}">
              </a>
          </div>
          <div class="hoverable">
              <ul>
              <li class="active"><i class="ri-shopping-cart-line shopping-cart-icon" data-id="${product.id}" data-image="${product.images[0]}" data-name="${product.title}" data-price="${product.price}"></i></li>
              <li><a href=""><i class="ri-eye-line"></i></a></li>
                  <li><a href=""><i class="ri-shuffle-line"></i></a></li>
              </ul>
          </div>
          <div class="discount circle flexcenter"><span>${product.id}%</span></div>
      </div>
      <div class="content">
          <h3 class="main-links"><a href="#">${product.title}</a></h3>
          <div class="price">
              <span class="current">${(product.price).toFixed(2)} $</span>
          </div>
          <div class="mini-text">
              <p>${product.id} sold</p>
              <p>Free Shipping</p>
          </div>
      </div>
    `;

    const containerIndex = index % container.length;
    container[containerIndex].appendChild(itemElement);
  });
}

function addClickEventToShoppingCartIcon() {
  const cartIcons = document.querySelectorAll('.shopping-cart-icon');
  cartIcons.forEach(icon => icon.addEventListener('click', handleAddToCart));
}


const cartItems = [];

function updateCartItemsCount() {
  const cartItemsCount = document.getElementById('cart-items-count');
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  cartItemsCount.textContent = totalQuantity;
}

updateCartItemsCount();


function handleAddToCart() {
  const id = this.dataset.id;
  const image = this.dataset.image;
  const name = this.dataset.name;
  const price = this.dataset.price;

  let existingCartItem = cartItems.find(item => item.id === id);

  if (existingCartItem) {
    existingCartItem.quantity++;
  } else {
    const newCartItem = {
      id: id,
      image: image,
      name: name,
      price: price,
      quantity: 1
    };

    cartItems.push(newCartItem);
  }

  updateCartTotal();
  updateCartItemsCount();

}

function updateCartTotal() {
  const cartBody = document.querySelector('.cart-body');
  const totalQuantityCart = document.querySelector('.total-quantity-cart');
  const totalPrice = document.querySelector('.total-price');
  const totalItems = cartItems.length;

  let totalQuantity = 0;
  let totalPriceSum = 0;

  cartBody.innerHTML = '';

  cartItems.forEach(item => {
    const cartItemElement = document.createElement('div');
    cartItemElement.className = 'cart-item';
    cartItemElement.setAttribute('data-id', item.id);

    cartItemElement.innerHTML = `
    <div class="cart-item" data-id="${item.id}">
    <div class="cart-img">
      <img src="${item.image}" alt="${item.name}" />
    </div>
    <div class="cart-desc">
      <div class="quantity">
        <div class="decrement quantity-el" onclick="decrementQuantity('${item.id}')">-</div>
        <span>${item.quantity}</span>
        <div class="increment quantity-el" onclick="incrementQuantity('${item.id}')">+</div>
      </div>
      <h5>${item.name}</h5>
      <h5 class="color-price">${item.price * item.quantity} $</h5>
      <div class="delete-button"><i class="ri-delete-bin-2-line"></i></div>
    </div>
  </div>
`;

    cartBody.appendChild(cartItemElement);

    const quantity = parseInt(item.quantity);
    const price = parseFloat(item.price);

    totalQuantity += quantity;
    totalPriceSum += price * quantity;
  });

  totalQuantityCart.textContent = `${totalQuantity} x items`;
  totalPrice.textContent = `total: ${totalPriceSum.toFixed(2)} $`;
}

function decrementQuantity(itemId) {
  const item = cartItems.find(item => item.id === itemId);
  if (item && item.quantity > 1) {
    item.quantity--;
    updateCartTotal();
    updateCartItemsCount();
  }
}

function incrementQuantity(itemId) {
  const item = cartItems.find(item => item.id === itemId);
  if (item) {
    item.quantity++;
    updateCartTotal();
    updateCartItemsCount();
  }
}

const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
  button.addEventListener('click', handleAddToCart);
});

document.addEventListener('click', function(event) {
  const deleteButton = event.target.closest('.delete-button');
  if (deleteButton) {
    const cartItem = deleteButton.closest('.cart-item');
    const itemId = cartItem.dataset.id;
    deleteCartItemById(itemId);
  }
});

function deleteCartItemById(itemId) {
  const index = cartItems.findIndex(item => item.id === itemId);

  if (index !== -1) {
    cartItems.splice(index, 1);
    updateCartTotal();
  }
  updateCartItemsCount();

}

fetchProducts();





