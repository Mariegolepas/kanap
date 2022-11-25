showDetailProduct();

// Fetch de l'API récupérant les produits qui utilise le await pour attendre la réponse
export async function getDetailsProduct(productId) {
    try {
        const response = await fetch('http://localhost:3000/api/products/'+productId);
        const product = await response.json();
        return product;
    } catch (error) {
        console.log(error);
    }
}

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
    console.log(productColorArray);
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
        
        console.log("je suis présent");

        if(verifyCart(productSave) === 0) {
            alert('Vous devez saisir une couleur ou un nombre valide.');
            return;
        }

        let newProductInCart = [];
        let productInCart = JSON.parse(localStorage.getItem("cart"));

        if(productInCart == null) {
            newProductInCart.push(productSave);
        } else {
            newProductInCart = productInCart.map((product) => {
                if(product.id === productSave.id && product.color === productSave.color) {
                    product.quantity = Number(product.quantity) + Number(productSave.quantity);
                    return product;
                } else {
                    return product;
                }
            })
            let productFind = productInCart.find((product) => product.id === productSave.id && product.color === productSave.color);
            if(productFind === undefined) {
                newProductInCart.push(productSave);
            }
        }
        localStorage.setItem("cart", JSON.stringify(newProductInCart));
    })

    //Ajouter message produit bien ajouté + réfléchir à quel endroit le mettre
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