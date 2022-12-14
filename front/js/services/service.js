/**
 * Fetch de l'API récupérant les produits qui utilise le await pour attendre la réponse
 * @param {string} productId 
 * @returns les informations de notre produit à partir de son ID
 */
export async function getDetailsProduct(productId) {
    try {
        const response = await fetch('http://localhost:3000/api/products/'+productId);
        const product = await response.json();
        return product;
    } catch (error) {
        console.log(error);
    }
}

/**
 * Fetch POST du panier vers l'API
 * @param {*} contact objet JSON
 * @param {*} productsId tableau de produits
 * @returns le numéro de commande
 */
export async function sendOrder(contact, productsId) {
    try {
        const fetchMethod = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({contact: contact, products : productsId}), //On définit dans un objet JSON notre objet contact et notre tableau de produit qui sera envoyé à l'API
        }
        const response = await fetch('http://localhost:3000/api/products/order', fetchMethod);
        const order = await response.json();
        return order;
    } catch(error) {
        console.log(error);
    }
}

/**
 * Fonction qui permet de vérifier que notre panier contient uniquement des chiffres entiers et une quantité entre 1 et 100.
 * Elle vérifie également que la couleur a bien été rentrée.
 * @param {*} productSave 
 * @returns 0 si la quantité n'est pas celle attendue ; 1 si elle est correcte.
 */ 
export function verifyCart(productSave) {
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