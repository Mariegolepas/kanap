import {getDetailsProduct, sendOrder} from './services/modele.js';

class Cart {
    constructor() {
        this.productQuantity = 0;
        this.productTotalPrice = 0;
        this.validForm = false;
    }

    showCart() {
        const productInCart = JSON.parse(localStorage.getItem('cart'));
        let showProductInCart = document.querySelector('#cart__items');

        if (productInCart !== null) 
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

        this.getOrder();
    }
    
    deleteFromCart(productId, productColor) {
        let cartProduct = JSON.parse(localStorage.getItem('cart'));

        let newProductInCart = cartProduct.filter((product) => {
            return !(productId === product.id && productColor === product.color);
        });
        
        localStorage.setItem('cart', JSON.stringify(newProductInCart));
        document.location.reload();
    }

    getOrder() {
        const orderElement = document.getElementById('order');
        orderElement.addEventListener('click', (e) => {
            e.preventDefault();

            const firstNameValue = document.getElementById('firstName').value;
            const lastNameValue = document.getElementById('lastName').value;
            const addressValue = document.getElementById('address').value;
            const cityValue = document.getElementById('city').value;
            const emailValue = document.getElementById('email').value;

            const contact = {
                firstName: firstNameValue,
                lastName: lastNameValue,
                address: addressValue,
                city: cityValue,
                email: emailValue,
            }
            
            const products = JSON.parse(localStorage.getItem('cart'));
            let productsId = [];

            if (products !== null) productsId = products.map((product) => product.id);

            if (this.validForm && productsId.length > 0) {
                sendOrder(contact, productsId).then((order) => {
                    localStorage.removeItem('cart');
                    window.location.href = '/front/html/confirmation.html?orderId='+order.orderId;
                });                
            } else {
                alert("Merci de remplir correctement vos informations de contact ou de vous assurer d'avoir au moins un produit dans votre panier.");
            }

            
        });
    }
    
    changeQuantity(productId, productColor, productQuantity) {
        const cart = JSON.parse(localStorage.getItem('cart'));

        const productIndex = cart.findIndex((product) => product.id === productId && product.color === productColor);
        cart[productIndex].quantity = productQuantity;
        
        localStorage.setItem('cart', JSON.stringify(cart));
        document.location.reload();
    }

    contactForm() {
        const emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[a-z]{2,10}$');
        const letterRegExp = new RegExp('^[a-zA-ZÀ-ÖØ-öø-ÿ]*$');
        const addressRegExp = new RegExp('^[0-9]{1,3}\\s[a-zA-ZÀ-ÖØ-öø-ÿ\\s,-]*$', 'i');
        const cityRegExp = new RegExp('^[0-9]{2,}\\s[a-zA-ZÀ-ÖØ-öø-ÿ\\s,-]*$', 'i');
    
        let firstNameTest = false;
        let lastNameTest = false;
        let addressTest = false;
        let cityTest = false;
        let emailTest = false;
    
        const firstName = document.getElementById('firstName');
        firstName.addEventListener('change', () => {
            const firstNameValue = firstName.value;
            firstNameTest = letterRegExp.test(firstNameValue);
            const firstNameErrorMsg = document.getElementById('firstNameErrorMsg');
    
            firstNameErrorMsg.textContent = null;
    
            if (firstNameValue !== null) {
                if (!firstNameTest) {
                    firstNameErrorMsg.textContent = "Merci de saisir votre Prénom";
                }
            };

            this.statusForm(firstNameTest, lastNameTest, addressTest, cityTest, emailTest);
        });
    
        const lastName = document.getElementById('lastName');
        lastName.addEventListener('change', () => {
            const lastNameValue = lastName.value;
            lastNameTest = letterRegExp.test(lastNameValue);
            const lastNameErrorMsg = document.getElementById('lastNameErrorMsg');
    
            lastNameErrorMsg.textContent = null;
    
            if (lastNameValue !== null) {
                if (!lastNameTest) {
                    lastNameErrorMsg.textContent = "Merci de saisir votre Nom de Famille";
                }
            };

            this.statusForm(firstNameTest, lastNameTest, addressTest, cityTest, emailTest);
        });
        
    
        const address = document.getElementById('address');
        address.addEventListener('change', () => {
            const addressValue = address.value;
            addressTest = addressRegExp.test(addressValue);
            const addressErrorMsg = document.getElementById('addressErrorMsg');
    
            addressErrorMsg.textContent = null;
    
            if (addressValue !== null) {
                if (!addressTest) {
                    addressErrorMsg.textContent = "Merci de saisir une adresse valide";
                }
            };

            this.statusForm(firstNameTest, lastNameTest, addressTest, cityTest, emailTest);
        });
        
    
        const city = document.getElementById('city');
        city.addEventListener('change', () => {
            const cityValue = city.value;
            cityTest = cityRegExp.test(cityValue);
            const cityErrorMsg = document.getElementById('cityErrorMsg');
    
            cityErrorMsg.textContent = null;
    
            if (cityValue !== null) {
                if (!cityTest) {
                    cityErrorMsg.textContent = "Merci de saisir une ville valide";
                }
            };

            this.statusForm(firstNameTest, lastNameTest, addressTest, cityTest, emailTest);
        });
    
        const email = document.getElementById('email');
        email.addEventListener('change', () => {
            const emailValue = email.value;
            emailTest = emailRegExp.test(emailValue);
            const emailErrorMsg = document.getElementById('emailErrorMsg');
    
            emailErrorMsg.textContent = null;
    
            if (emailValue !== null) {
                if (!emailTest) {
                    emailErrorMsg.textContent = "Merci de saisir une adresse mail valide";
                }
            };

            this.statusForm(firstNameTest, lastNameTest, addressTest, cityTest, emailTest);
        });
    }

    statusForm(firstNameTest, lastNameTest, addressTest, cityTest, emailTest) {
        this.validForm = true;

        (!firstNameTest)? this.validForm = false : '';
        (!lastNameTest)? this.validForm = false : '';
        (!addressTest)? this.validForm = false : '';
        (!cityTest)? this.validForm = false : '';
        (!emailTest)? this.validForm = false : '';
    } 
}


let newCart = new Cart();
newCart.showCart();
newCart.contactForm();