/**
 * Permet d'afficher l'ID de la commande à partir de l'URL de notre page de validation de commande généré par l'API
 */
function showOrderId() {
    const orderParams = (new URL(document.location)).searchParams;
    const orderId = orderParams.get('orderId');
    
    const orderIdSpan = document.getElementById('orderId');
    orderIdSpan.textContent = orderId;
}

showOrderId();