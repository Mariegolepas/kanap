import {getDetailsProduct, sendOrder, verifyCart} from './services/service.js';

/**
 * Classe permettant d'agir sur notre page panier.
 * Elle comporte plusieurs méthodes : 
 * - l'affichage du panier
 * - le fait de pouvoir supprimer un produit du panier
 * - le fait de passer la commande
 * - le fait de changer la quantité du produit directement depuis le panier
 * - le fait de faire une validation automatique du formulaire de contact et d'afficher un message d'erreur lorsque celui-ci n'est pas correct
 * - la vérification du statut du formulaire (valide/non valide)
 */
class Cart {
    constructor() {
        this.productQuantity = 0; //Initialise la quantité à zéro
        this.productTotalPrice = 0; //Initialise le prix total à payer à zéro
        this.validForm = false; //Indique que de base le formulaire est invalide et empêche de valider la commande lorsque celui-ci n'est pas rempli
    }

    /**
     * Affiche les éléments du panier
     */
    showCart() {
        const productInCart = JSON.parse(localStorage.getItem('cart')); //On parse le panier pour récupérer l'array et en faire une boucle ensuite
        let showProductInCart = document.querySelector('#cart__items');
        this.productQuantity = 0;
        this.productTotalPrice = 0;
        // Supprime tous les enfant d'un élément
        while (showProductInCart.firstChild) {
            showProductInCart.removeChild(showProductInCart.firstChild);
        };

        if (productInCart !== null) 
            productInCart.forEach(async (product) => {
                let productId = product.id;
                const productDetail = await getDetailsProduct(productId); //On récupère dans le localStorage 

                let productObject = {
                    id : productDetail._id,
                    name : productDetail.name,
                    color : product.color,
                    altTxt : productDetail.altTxt,
                    image : productDetail.imageUrl,
                    quantity : product.quantity,
                };

                this.productQuantity += product.quantity;
                this.productTotalPrice += product.quantity * productDetail.price;

                const article = document.createElement('article');
                article.className = 'cart__item';
                article.dataset.id = productId;
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
                    productObject.quantity = Number(productQuantityInput.value);
                    if (verifyCart(productObject) === 0) {
                        alert('Merci de saisir une valeur entière comprise entre 1 et 100');
                        this.showCart();
                    } else {
                        this.changeQuantity(productId, product.color, productObject.quantity);
                    }
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

        //On indique qu'on exécute notre méthode getOrder qui permet le passage de la commande
        this.getOrder();
    }
    
    /**
     * Supprime un produit du panier 
     * @param {string} productId 
     * @param {string} productColor 
     */
    deleteFromCart(productId, productColor) {
        let cartProduct = JSON.parse(localStorage.getItem('cart'));

        let newProductInCart = cartProduct.filter((product) => {
            return !(productId === product.id && productColor === product.color);
        });
        
        localStorage.setItem('cart', JSON.stringify(newProductInCart));
        this.showCart();
    }

    /**
     * Permet de passer la commande et d'envoyer à l'API les valeurs correspondantes
     */
    getOrder() {
        const orderElement = document.getElementById('order');
        orderElement.addEventListener('click', (e) => {
            e.preventDefault();

            const firstNameValue = document.getElementById('firstName').value;
            const lastNameValue = document.getElementById('lastName').value;
            const addressValue = document.getElementById('address').value;
            const cityValue = document.getElementById('city').value;
            const emailValue = document.getElementById('email').value;

            //On créé directement notre objet contact ici pour le passer en argument de la méthode post de l'API
            const contact = {
                firstName: firstNameValue,
                lastName: lastNameValue,
                address: addressValue,
                city: cityValue,
                email: emailValue,
            }
            
            //On parse notre localStorage
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
    
    /**
     * Méthode qui nous permet de changer la quantité du produit à partir du produit
     * @param {string} productId 
     * @param {string} productColor 
     * @param {number} productQuantity 
     */
    changeQuantity(productId, productColor, productQuantity) {
        const cart = JSON.parse(localStorage.getItem('cart'));
        const productIndex = cart.findIndex((product) => product.id === productId && product.color === productColor);
        cart[productIndex].quantity = productQuantity;
            
        localStorage.setItem('cart', JSON.stringify(cart));
        this.showCart();
    }

    /**
     * Méthode qui permet de vérifier le formulaire et d'indiquer un message d'erreur si les valeurs entrées ne correspondent pas à notre RegExp
     */
    contactForm() {
        //Nos expressions régulières pour la validation des entrées du formulaire
        const emailRegExp = new RegExp('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$');
        const letterRegExp = new RegExp('^[a-zA-ZÀ-ÖØ-öø-ÿ]+$');
        const addressRegExp = new RegExp('^[0-9]{1,3}\\s[a-zA-ZÀ-ÖØ-öø-ÿ\\s,-]*$', 'i');
        const cityRegExp = new RegExp('^[0-9\\s?]*[a-zA-ZÀ-ÖØ-öø-ÿ\\s,-]+$', 'i');
    
        //initialement tous nos tests sont faux, cela évite les faux positifs
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

    /**
     * Méthode de validation du formulaire avant l'envoi à l'API et la validation de la commande
     * @param {boolean} firstNameTest 
     * @param {boolean} lastNameTest 
     * @param {boolean} addressTest 
     * @param {boolean} cityTest 
     * @param {boolean} emailTest 
     */
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