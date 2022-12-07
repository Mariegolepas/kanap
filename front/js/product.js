import {getDetailsProduct} from './services/modele.js';

showDetailProduct();
//Fonction permettant d'afficher le bon produit en fonction de la page où on est
async function showDetailProduct() {
    let params = (new URL(document.location)).searchParams;
    //Permet de récupérer l'ID via l'URL
    let id = params.get('id');
    //Permet de récupérer le produit grâce à son ID
    let product = await getDetailsProduct(id);
    
    document.title = product.name;

    let itemImg = document.querySelector('.item__img');
    const imageKanap = document.createElement('img');
    imageKanap.setAttribute('src', product.imageUrl);
    imageKanap.setAttribute('alt', product.altTxt);
    itemImg.appendChild(imageKanap);

    const productName = document.querySelector('#title');
    productName.textContent = product.name;

    const priceSpan = document.querySelector('#price');
    priceSpan.textContent = product.price;

    const productDescription = document.querySelector('#description');
    productDescription.textContent = product.description;

    //Affiche les différentes options du menu de couleurs du produit
    const productColorMenu = document.querySelector('#colors');
    const productColorArray = product.colors;
    
    for (let i = 0; i < productColorArray.length; i++) {
        let productColor = document.createElement('option');
        productColor.setAttribute('value', productColorArray[i]);
        productColor.textContent = productColorArray[i];
        productColorMenu.append(productColor);
    };
    
    addProductToCart(product.name, product._id, product.imageUrl, product.altTxt);
}

function addProductToCart(productName, productId, productImage, productAltTxt) {
    const cartButton = document.getElementById('addToCart');
    cartButton.addEventListener('click', () => {
        const color = document.getElementById('colors').value;
        const quantity = document.getElementById('quantity').value;
        
        const productSave = {
            name : productName,
            id : productId,
            color : color,
            quantity : Number(quantity),
            image : productImage,
            altTxt : productAltTxt,
        }

        if(verifyCart(productSave) === 0) {
            alert('Vous devez saisir une couleur ou un nombre valide (compris entre 0 et 100).');
            return;
        }

        let newProductInCart = [];
        let productInCart = JSON.parse(localStorage.getItem("cart"));

        if(productInCart == null) {
            newProductInCart.push(productSave);
            addValidation();
        } else {
            newProductInCart = productInCart.map((product) => {
                if(product.id === productSave.id && product.color === productSave.color) {
                    product.quantity = Number(product.quantity) + Number(productSave.quantity);
                    return product;
                } else {
                    return product;
                }
            });
            let productFind = productInCart.find((product) => product.id === productSave.id && product.color === productSave.color);
            if(productFind === undefined) {
                newProductInCart.push(productSave);
                addValidation();
            }
        }
        localStorage.setItem("cart", JSON.stringify(newProductInCart));
    })
}

function verifyCart(productSave) {
    if(productSave.quantity > 100 || productSave.quantity < 1 || productSave.color === "" || !Number.isInteger(productSave.quantity)) {
        return 0;
    } else {
        const productInCart = JSON.parse(localStorage.getItem("cart"));
        if(productInCart != null) {
            let productFind = productInCart.find((product) => product.id === productSave.id && product.color === productSave.color);
            if(productFind != undefined) {
                if(Number(productFind.quantity) + Number(productSave.quantity) > 100) return 0; 
            }
        }
        return 1; 
    }
}

function addValidation() {
    const cartButton = document.querySelector('#addToCart');
    const divCartButton = document.querySelector('.item__content__addButton');
    const addValidationMessageDiv = document.createElement('div');
    const addValidationMessage = document.createElement('p');
    addValidationMessage.setAttribute('style', 'color: lightgreen;')
    addValidationMessage.textContent = 'Produit bien ajouté au panier !';
    divCartButton.insertBefore(addValidationMessageDiv, cartButton);
    addValidationMessageDiv.appendChild(addValidationMessage);
}