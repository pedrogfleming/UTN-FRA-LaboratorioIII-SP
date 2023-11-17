export {
    crearSpinner,
    quitarSpinner
}

function crearSpinner() {
    document.getElementById('spinner').style.display = 'block';
}

function quitarSpinner() {
    document.getElementById('spinner').style.display = 'none';
}