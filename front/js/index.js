fetch('http://localhost:3000/api/products')

for (let product in products) {
    let items = document.getElementsByClassName('items')

    items.innerHTML = '<a href="./product.html?id={product.id}"><article><img src="{product.imageUrl}"><h3 class="productName"></h3><p class="productDescription"></p></article></a>'

    document
        .getElementsByClassName('productName').innerHTML = {product.name}
        .getElementsByClassName('productDescription').innerHTML = {product.description}

}