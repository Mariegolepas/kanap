import {getDetailsProduct, verifyCart} from './services/modele.js';

showDetailProduct();

/**
 * Fonction permettant d'afficher le bon produit en fonction de la page où on est.
 * Cette fonction permet également de créer ce qui affichera le message de validation.
 * Fonction qui permet de faire l'ajout dans le panier.
*/
async function showDetailProduct() {
    let params = (new URL(document.location)).searchParams;
    //Permet de récupérer l'ID via l'URL
    let id = params.get('id');
    //Permet de récupérer le produit grâce à son ID
    let product = await getDetailsProduct(id);
    
    //Permet de nommer la page du produit avec le nom du produit en question
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

    //Créé la div pour ajouter le message de validation d'ajout au panier par la suite
    const divCartButton = document.querySelector('.item__content');
    const addValidationMessageDiv = document.createElement('div');
    const addValidationMessage = document.createElement('p');
    addValidationMessage.setAttribute('id', 'validationMessage');
    addValidationMessage.setAttribute('style', 'color: lightgreen; text-align: center;');
    divCartButton.appendChild(addValidationMessageDiv);
    addValidationMessageDiv.appendChild(addValidationMessage);

    //Affiche les différentes options du menu de couleurs du produit
    const productColorMenu = document.querySelector('#colors');
    const productColorArray = product.colors;
    
    for (let i = 0; i < productColorArray.length; i++) {
        let productColor = document.createElement('option');
        productColor.setAttribute('value', productColorArray[i]);
        productColor.textContent = productColorArray[i];
        productColorMenu.append(productColor);
    };
    
    //Appel de la fonction d'ajout au panier avec les éléments passés en argument de la fonction
    addProductToCart(product.name, product._id, product.imageUrl, product.altTxt);
}

/**
 * Fonction qui permet d'ajouter le produit au localStorage.
 * Permet également d'afficher les messages d'erreur quand nécessaire.
 * @param {string} productName 
 * @param {string} productId 
 * @param {string} productImage 
 * @param {string} productAltTxt 
 */
function addProductToCart(productName, productId, productImage, productAltTxt) {
    const cartButton = document.getElementById('addToCart');
    cartButton.addEventListener('click', () => {
        const color = document.getElementById('colors').value;
        const quantity = document.getElementById('quantity').value;
        
        //Ensemble des éléments que l'on récupère pour les stocker dans le LocalStorage
        const productSave = {
            name : productName,
            id : productId,
            color : color,
            quantity : Number(quantity), //La string concernée doit être analysée comme un nombre et pas comme un string
            image : productImage,
            altTxt : productAltTxt,
        }

        if(verifyCart(productSave) === 0) {
            alert('Vous devez saisir une couleur ou un nombre valide (compris entre 0 et 100) ou bien rassurez vous que la quantité totale du panier ne dépassera pas 100 unités.');
            return;
        }

        let newProductInCart = [];
        let productInCart = JSON.parse(localStorage.getItem("cart"));

        //Si le panier est actuellement vide, on push directement l'objet de notre produit. 
        //Sinon on va le mapper en vérifiant l'id du produit la couleur (si ils existent ou non) et changer/ajouter la quantité.
        if(productInCart == null) {
            newProductInCart.push(productSave);
            addValidation();
        } else {
            newProductInCart = productInCart.map((product) => {
                if(product.id === productSave.id && product.color === productSave.color) {
                    product.quantity = Number(product.quantity) + Number(productSave.quantity);
                    addValidation();
                    return product;
                } else {
                    addValidation();
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

/**
 * Permet d'ajouter notre message de validation lorsque le produit est ajouté au panier
 */
function addValidation() {
    const addValidationMessage = document.getElementById('validationMessage');
    addValidationMessage.textContent = 'Produit bien ajouté au panier !';
}