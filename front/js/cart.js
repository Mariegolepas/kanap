import {getDetailsProduct} from './services/modele.js';

class Cart {
    constructor() {
        this.productQuantity = 0;
        this.productTotalPrice = 0;
    }

    showCart() {
        const productInCart = JSON.parse(localStorage.getItem('cart'));
        let showProductInCart = document.querySelector('#cart__items');

        productInCart.forEach(async (product) => {
            let productId = product.id;
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
            deleteItem.addEventListener('click', () => {
                this.deleteFromCart(productId, product.color);
            });
            contentSettingsDelete.appendChild(deleteItem);

            const totalQuantity = document.getElementById('totalQuantity');
            totalQuantity.textContent = this.productQuantity;

            const totalPrice = document.getElementById('totalPrice');
            totalPrice.textContent = this.productTotalPrice;
        });

    }
    
    deleteFromCart(productId, productColor) {
        let cartProduct = JSON.parse(localStorage.getItem('cart'));

        let newProductInCart = cartProduct.filter((product) => {
            if (productId === product.id && productColor === product.color) {
                return false;
            } else {
                return true;
            };
        });
        
        localStorage.setItem('cart', JSON.stringify(newProductInCart));
        document.location.reload();
    }

    order() {
        const order = document.getElementById('order');
        order.addEventListener('click', () => {
            //window.location.href = '/confirmation.html?orderId='+'order.id'
            window.location.assign('/confirmation.html');
            this.orderAchieved();
        });
    }

    orderAchieved() {
        localStorage.deleteItem('cart');
    } 
    
    changeQuantity(product, quantity) {
        const effectiveQuantity = document.getElementsByClassName('itemQuantity');
        effectiveQuantity.addEventListener('onFormInput', () => {
            //Se servir de la méthode pour la suppression d'un produit
        }, captureEvents)
    }

}


let newCart = new Cart();
newCart.showCart();
contactForm();
        //ADD EVENT LISTENER POUR SUPPR ELEMENT PANIER

        //ADD EVENT LISTENER POUR ADD QTE PANIER


function contactForm() {
    const firstNameErrorMsg = document.getElementById('firstNameErrorMsg');
    firstNameErrorMsg.textContent = "Merci de saisir votre Prénom";

    const lastNameErrorMsg = document.getElementById('lastNameErrorMsg');
    lastNameErrorMsg.textContent = "Merci de saisir votre Nom de Famille";

    const addressErrorMsg = document.getElementById('addressErrorMsg');
    addressErrorMsg.textContent = "Merci de saisir une adresse valide";

    const cityErrorMsg = document.getElementById('cityErrorMsg');
    cityErrorMsg.textContent = "Merci de saisir une ville valide";

    const emailErrorMsg = document.getElementById('emailErrorMsg');
    emailErrorMsg.textContent = "Merci de saisir une adresse mail valide";
}