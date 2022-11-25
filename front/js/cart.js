import {getDetailsProduct} from './product.js';

/* // Fetch de l'API récupérant les produits qui utilise le await pour attendre la réponse
async function getProduct() {
    try {
        const response = await fetch('http://localhost:3000/api/products/');
        const product = await response.json();
        return product;
    } catch (error) {
        console.log(error);
    }
} => A ajouter dans la class */

class Cart {
    constructor() {
        this.productQuantity = 0;
        this.productTotalPrice = 0;
    }

    showCart() {
        const productInCart = JSON.parse(localStorage.getItem('cart'));
        let showProductInCart = document.querySelector('#cart__items');
        

        productInCart.forEach(async (product) => {
            const productDetail = await getDetailsProduct(product.id);
            this.productQuantity += product.quantity;
            this.productTotalPrice += product.quantity * productDetail.price;

            const article = document.createElement('article');
            article.className = 'cart__item';
            article.dataset.id = product.id;
            article.dataset.color = product.color;
            showProductInCart.appendChild(article);
    
            const imageDiv = document.createElement('div');
            imageDiv.className = 'cart__item__img';
            article.appendChild(imageDiv);
    
            const image = document.createElement('img');
            image.setAttribute('src', product.image);
            image.setAttribute('alt', product.altTxt);
            imageDiv.appendChild(image);
    
            const content = document.createElement('div');
            content.className = 'cart__item__content';
            article.appendChild(content);
    
            const contentDescription = document.createElement('div');
            contentDescription.className = 'cart__item__content__description';
            content.appendChild(contentDescription);
    
            const productName = document.createElement('h2');
            productName.textContent = product.name;
            contentDescription.appendChild(productName);
    
            const productColor = document.createElement('p');
            productColor.textContent = product.color;
            contentDescription.appendChild(productColor);
    
            const productPrice = document.createElement('p');
            productPrice.textContent = productDetail.price;
            contentDescription.appendChild(productPrice);
    
            const contentSettings = document.createElement('div');
            contentSettings.className = 'cart__item__content__settings';
            content.appendChild(contentSettings);
    
            const contentQuantity = document.createElement('div');
            contentQuantity.className = 'cart__item__content__settings__quantity';
            contentSettings.appendChild(contentQuantity);
    
            const productQuantity = document.createElement('p');
            productQuantity.textContent = 'Qté :';
            contentQuantity.appendChild(productQuantity);
    
            const productQuantityInput = document.createElement('input');
            productQuantityInput.setAttribute = ('type', 'number');
            productQuantityInput.className = 'itemQuantity';
            productQuantityInput.setAttribute = ('name', 'itemQuantity');
            productQuantityInput.setAttribute = ('min', 1);
            productQuantityInput.setAttribute = ('max', 100);
            productQuantityInput.value = product.quantity;
            contentQuantity.appendChild(productQuantityInput);
    
            const contentSettingsDelete = document.createElement('div');
            contentSettingsDelete.className = 'cart__item__content__settings__delete';
            contentSettings.appendChild(contentSettingsDelete);
    
            const deleteItem = document.createElement('p');
            deleteItem.className = 'deleteItem';
            deleteItem.textContent = "Supprimer";
            contentSettingsDelete.appendChild(deleteItem);

            const totalQuantity = document.getElementById('totalQuantity');
            totalQuantity.textContent = this.productQuantity;

            const totalPrice = document.getElementById('totalPrice');
            totalPrice.textContent = this.productTotalPrice;
        });

    }
}

let newCart = new Cart();
newCart.showCart();

//Fonction qui affiche le tableau du panier sur notre page web
        //ADD EVENT LISTENER POUR SUPPR ELEMENT PANIER

        //ADD EVENT LISTENER POUR ADD QTE PANIER

function getProductPrice(product) {
    const productInCart = localStorage.getItem('cart');
    let price = 0;
    for (let product of productInCart) {
        price += productInCart.quantity * product.price;
    } 
    return price;
}