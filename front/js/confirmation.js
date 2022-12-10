async function showOrderId() {
    const orderParams = (new URL(document.location)).searchParams;
    const orderId = orderParams.get('orderId');
    
    const orderIdSpan = document.getElementById('orderId');
    orderIdSpan.textContent = orderId;
}

showOrderId();