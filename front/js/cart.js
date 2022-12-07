import {getDetailsProduct, sendOrder} from './services/modele.js';

class Cart {
    constructor() {
        this.productQuantity = 0;
        this.productTotalPrice = 0;
        this.orderId = 0;
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
            productQuantityInput.addEventListener('change', () => {
                this.changeQuantity(productId, product.color, Number(productQuantityInput.value));
            });
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
            return !(productId === product.id && productColor === product.color);
        });
        
        localStorage.setItem('cart', JSON.stringify(newProductInCart));
        document.location.reload();
    }

    order() {
        const order = document.getElementById('order');
        order.addEventListener('click', () => {
            const firstNameValue = document.getElementById('firstName').value;
            const lastNameValue = document.getElementById('lastName').value;
            const addressValue = document.getElementById('address').value;
            const cityValue = document.getElementById('city').value;
            const emailValue = document.getElementById('email').value;

            const contact = {
                contactFirstName: firstNameValue,
                contactLastName: lastNameValue,
                contactAddress: addressValue,
                contactCity: cityValue,
                contactEmail: emailValue,
            }

            const cart = JSON.parse(localStorage.getItem('cart'));

            sendOrder(contact, cart, this.orderId)
            window.location.assign('/confirmation.html?orderId='+this.orderId);
            this.orderAchieved();
            this.orderId = this.orderId++;
        });
    }

    orderAchieved() {
        localStorage.deleteItem('cart');
    } 
    
    changeQuantity(productId, productColor, productQuantity) {
        const cart = JSON.parse(localStorage.getItem('cart'));

        const productIndex = cart.findIndex((product) => product.id === productId && product.color === productColor);
        cart[productIndex].quantity = productQuantity;
        
        localStorage.setItem('cart', JSON.stringify(cart));
        document.location.reload();
    }
}


let newCart = new Cart();
newCart.showCart();
contactForm();
newCart.order();

function contactForm() {
    const emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[a-z]{2,10}$');
    const letterRegExp = new RegExp('[a-zA-Z]');
    const addressRegExp = new RegExp('^[1-9]{1,3}\\s[a-z0-9\\s,\'-]*$', 'i')
    const cityRegExp = new RegExp('^[1-9]{5}\s[a-zA-Z]');

    const firstName = document.getElementById('firstName')
    firstName.addEventListener('change', () => {
        const firstNameValue = firstName.value;
        const firstNameTest = letterRegExp.test(firstNameValue);
        const firstNameErrorMsg = document.getElementById('firstNameErrorMsg');

        firstNameErrorMsg.textContent = null;

        if (firstNameValue !== null) {
            if (!firstNameTest) {
                firstNameErrorMsg.textContent = "Merci de saisir votre Prénom";
            }
        };
    });

    const lastName = document.getElementById('lastName');
    lastName.addEventListener('change', () => {
        const lastNameValue = lastName.value;
        const lastNameTest = letterRegExp.test(lastNameValue);
        const lastNameErrorMsg = document.getElementById('lastNameErrorMsg');

        lastNameErrorMsg.textContent = null;

        if (lastNameValue !== null) {
            if (!lastNameTest) {
                lastNameErrorMsg.textContent = "Merci de saisir votre Nom de Famille";
            }
        };
    });
    

    const address = document.getElementById('address');
    address.addEventListener('change', () => {
        const addressValue = address.value;
        const addressTest = addressRegExp.test(addressValue);
        const addressErrorMsg = document.getElementById('addressErrorMsg');

        addressErrorMsg.textContent = null;

        if (addressValue !== null) {
            if (!addressTest) {
                addressErrorMsg.textContent = "Merci de saisir une adresse valide";
            }
        };
    });
    

    const city = document.getElementById('city');
    city.addEventListener('change', () => {
        const cityValue = city.value;
        const cityTest = cityRegExp.test(cityValue);
        const cityErrorMsg = document.getElementById('cityErrorMsg');

        cityErrorMsg.textContent = null;

        if (cityValue !== null) {
            if (!cityTest) {
                cityErrorMsg.textContent = "Merci de saisir une ville valide";
            }
        };
    });

    const email = document.getElementById('email');
    email.addEventListener('change', () => {
        const emailValue = email.value;
        const emailTest = emailRegExp.test(emailValue);
        const emailErrorMsg = document.getElementById('emailErrorMsg');

        emailErrorMsg.textContent = null;

        if (emailValue !== null) {
            if (!emailTest) {
                emailErrorMsg.textContent = "Merci de saisir une adresse mail valide";
            }
        };
    });
}