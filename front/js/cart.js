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

/* class cart {
    constructor() {
        let cart = localStorage.getItem("cart");
        if (cart == null) {
            this.cart = [];
        } else {
            this.cart = JSON.parse(cart);
        }
    }

    save() {
        localStorage.setItem("cart", JSON.stringify(this.cart));
    }

    add() {
        let productFound = this.cart.find(p => p.id == product._id);
        
        if (productFound != undefined) {
            productFound.quantity++;
        } else {
            product.quantity = 1;
        }
        
        this.cart.push(product);
        save();
    }

    remove() {
        this.cart = this.cart.filter(p => p.id != product._id);
        save();
    }

    changeQuantity(product, quantity) {
        let productFound = this.cart.find(p => p.id == product._id);
    if (productFound != undefined) {
        productFound.quantity += quantity;
        if (productFound.quantity <= 0) {
            remove(productFound);
        }
    } save();
    }

    getProductNumber() {
        let number = 0;
        for (let product of this.cart) {
            number += product.quantity;
        } 
        return number;
    }
    
    getProductPrice() {
        let price = 0;
        for (let product of this.cart) {
            price += product.quantity * product.price;
        } 
        return price;
    }
} */

//Fonction qui affiche le tableau du panier sur notre page web
async function getCart() {
    const productCart = await getProduct();
    const productInCart = localStorage.getItem('cart');
    let showProductInCart = document.querySelector('#cart__items')
    showProductsInCart.forEach(product => {
        const article = document.createElement('article');
        article.className = 'cart__item';
        article.dataset.id = product._id;
        article.dataset.color = product.color;
        showProductInCart.appendChild(article);

        const imageDiv = document.createElement('div');
        imageDiv.className = 'cart__item__img';
        article.appendChild(imageDiv);

        const image = document.createElement('img');
        image.setAttribute('src', product.imageURL);
        image.setAttribute('alt', product.altTxt);
        imageDiv.appendChild(image);

        const content = document.createElement('div');

        //AJOUTER LES ELEMENTS AU DOM

        //ADD EVENT LISTENER POUR SUPPR ELEMENT PANIER

        //ADD EVENT LISTENER POUR ADD QTE PANIER

    });
}

showProducts();