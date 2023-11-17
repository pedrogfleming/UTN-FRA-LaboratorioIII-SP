import { inicializarManejadores} from "./vistaPrincipal.js";
import { HttpHandler } from "./httpHandler.js";
import { crearSpinner, quitarSpinner } from "./spinnerHelper.js"

Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

try {
    crearSpinner();
    const httpHandler = new HttpHandler();
    const personas = httpHandler.sendGetSync();
    localStorage.setObj("personas", personas);
    window.addEventListener('load', inicializarManejadores);
    quitarSpinner();
} catch (error) {
    alert("Error en el servidor: " + error.message);
}
finally{
    quitarSpinner();
}
