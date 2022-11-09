
async function getListProduct() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        const listProducts = await response.json();
        return listProducts;
    } catch (error) {
        console.log(error);
    }
}

//Fonction qui affiche les produits sur notre page web
async function showProducts() {
    const listProducts = await getListProduct();
    let items = document.querySelector('.items')
    listProducts.forEach(product => {
        const link = document.createElement('a');
        link.setAttribute('href', `./product.html?id=${product._id}`);
        items.appendChild(link);

        const article = document.createElement('article');
        link.appendChild(article);

        const image = document.createElement('img');
        image.setAttribute('src', product.imageUrl);
        image.setAttribute('alt', product.altTxt);
        article.appendChild(image);

        const title = document.createElement('h3');
        title.className = 'productName';
        title.textContent = product.name;
        article.appendChild(title);

        const description = document.createElement('p');
        description.className = 'productDescription';
        description.textContent = product.description;
        article.appendChild(description);

    });
}

showProducts();