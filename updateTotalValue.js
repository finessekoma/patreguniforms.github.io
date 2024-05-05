window.onload = function() {
    fetch('get_total_value.php')
        .then(response => response.text())
        .then(totalValue => {
            document.getElementById('totalValue').textContent = totalValue;
        })
        .catch(error => console.error('Error:', error));
};