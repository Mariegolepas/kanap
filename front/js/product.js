// Fetch de l'API récupérant les produits qui utilise le await pour attendre la réponse
async function getDetailsProduct(productId) {
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
    let id = params.get('id');
    console.log("l'ID récupéré via l'URL est :", id);
    let product = await getDetailsProduct(id);
    console.log("le produit récupéré est :", product);
    
    //Ajout des éléments dans le DOM
    let itemImg = document.querySelector('.item__img');
    const imageKanap = document.createElement('img');
    imageKanap.setAttribute('src', product.imageURL);
    imageKanap.setAttribute('alt', product.altTxt);
    itemImg.appendChild(imageKanap);

    const pageName = document.querySelector('title');
    pageName.textContent = product.name;

    const productName = document.querySelector('#title');
    productName.textContent = product.name;

    const priceSpan = document.querySelector('#price');
    priceSpan.textContent = product.price;

    const productDescription = document.querySelector('#description');
    productDescription.textContent = product.description;

    const productColor = document.querySelector('option');
    productColor.textContent = product.colors;




}

showDetailProduct();
