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

//Fetch POST du panier vers l'API