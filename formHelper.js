import { Persona, Futbolista, Profesional, toObjs } from "./persona.js"
import Arr_Update from "./arrayHelper.js"
import { HttpHandler } from "./httpHandler.js";
import { crearSpinner, quitarSpinner } from "./spinnerHelper.js"

const entidades = "personas";

const opcionesTipos = ["Profesional", "Futbolista", "Elegir tipo"];
const opcionesIndices = {
    Profesional: 0,
    Futbolista: 1,
    ElegirTipo: 2
};

export function crearFormBaja(formulario, obj) {
    formulario.innerText = "Formulario Eliminacion";
    let elementos = [];
    let opciones = opcionesTipos;
    const selectorTipo = crearSelector(opciones);
    selectorTipo.disabled = true;

    if (obj instanceof Profesional) selectorTipo.selectedIndex = opcionesIndices["Profesional"];
    else if (obj instanceof Futbolista) selectorTipo.selectedIndex = opcionesIndices["Futbolista"];

    elementos.push(selectorTipo);
    if (obj === null) {
        obj = new Persona("", "", "", "");
    }

    let props = Object.getOwnPropertyNames(obj);
    props.forEach(p => {
        let soloLectura = false;
        if (p == "id") {
            soloLectura = true;
        }
        let ret = agregarCampos(p, obj[p], soloLectura);
        elementos.push(ret.nuevoLabel);
        elementos.push(ret.nuevoInput);
    });

    const botonAceptar = document.createElement('button');
    botonAceptar.innerText = "Aceptar";
    elementos.push(botonAceptar);

    const botonCancelar = document.createElement('button');
    botonCancelar.innerText = "Cancelar";
    elementos.push(botonCancelar);

    botonCancelar.addEventListener('click', () => {
        const eventRefrescar = new CustomEvent('refrescarTablaPersonas');
        document.dispatchEvent(eventRefrescar);
    });

    botonAceptar.addEventListener('click', (e) => {
        e.preventDefault();
        let inputs = [];
        props.forEach(p => {
            inputs[p] = document.getElementsByTagName("input")[p].value;
        });

        let obj_a_eliminar = null;

        if (!validarInputs(inputs, selectorTipo.selectedOptions[0].value)) {
            alert("Datos incorrectos");
            return;
        }
        if (obj instanceof Profesional) {
            obj_a_eliminar = new Profesional(obj.id, inputs["nombre"], inputs["apellido"], inputs["edad"], inputs["titulo"], inputs["facultad"], inputs["añoGraduacion"]);
        }
        else if (obj instanceof Futbolista) {
            obj_a_eliminar = new Futbolista(obj.id, inputs["nombre"], inputs["apellido"], inputs["edad"], inputs["equipo"], inputs["posicion"], inputs["cantidadGoles"]);
        }
        if (obj_a_eliminar) {
            try {
                const httpHandler = new HttpHandler();
            
                crearSpinner();
                console.log("Antes del fetch");
                let responsePromise = httpHandler.sendDeleteAsync(obj_a_eliminar);
                responsePromise.then(response => {
                    if (response.ok) {
                        return response.text();
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                })
                .then(response => {
                    console.log(response);
                    let LS_Personas = toObjs(localStorage.getObj(entidades));
                    LS_Personas = LS_Personas.filter((elemento) => elemento.id !== obj.id);
                
                    localStorage.removeItem(entidades);
                    localStorage.setObj(entidades, LS_Personas);
                
                    console.log("Quitando spiner...");
                    quitarSpinner();
                    const event = new CustomEvent('refrescarTablaPersonas');
                    document.dispatchEvent(event);
                })
                .catch(err => {
                    console.log(err);
                    alert(err);
                    quitarSpinner();
                    const event = new CustomEvent('refrescarTablaPersonas');
                    document.dispatchEvent(event);
                });
                
            }
            catch (error) {
                alert(JSON.stringify(error));
            }
        }
    });
    elementos.forEach((e) => formulario.appendChild(e));
}

export function crearFormUpdate(formulario, obj) {
    formulario.innerText = "Formulario Modificacion";
    let elementos = [];
    let opciones = opcionesTipos;
    const selectorTipo = crearSelector(opciones);
    selectorTipo.disabled = true;

    if (obj instanceof Profesional) selectorTipo.selectedIndex = opcionesIndices["Profesional"];
    else if (obj instanceof Futbolista) selectorTipo.selectedIndex = opcionesIndices["Futbolista"];

    elementos.push(selectorTipo);
    if (obj === null) {
        obj = new Persona("", "", "", "");
    }

    let props = Object.getOwnPropertyNames(obj);
    props.forEach(p => {
        let soloLectura = false;
        if (p == "id") {
            soloLectura = true;
        }
        let ret = agregarCampos(p, obj[p], soloLectura);
        elementos.push(ret.nuevoLabel);
        elementos.push(ret.nuevoInput);
    });

    const botonGuardar = document.createElement('button');
    botonGuardar.innerText = "Aceptar";
    elementos.push(botonGuardar);

    const botonCancelar = document.createElement('button');
    botonCancelar.innerText = "Cancelar";
    elementos.push(botonCancelar);

    botonCancelar.addEventListener('click', () => {
        const eventRefrescar = new CustomEvent('refrescarTablaPersonas');
        document.dispatchEvent(eventRefrescar);
    });

    botonGuardar.addEventListener('click', (e) => {
        e.preventDefault();
        let inputs = [];
        props.forEach(p => {
            inputs[p] = document.getElementsByTagName("input")[p].value;
        });

        let objModificado = null;

        if (!validarInputs(inputs, selectorTipo.selectedOptions[0].value)) {
            alert("Datos incorrectos");
            return;
        }
        if (obj instanceof Profesional) {
            objModificado = new Profesional(obj.id, inputs["nombre"], inputs["apellido"], inputs["edad"], inputs["titulo"], inputs["facultad"], inputs["añoGraduacion"]);
        }
        else if (obj instanceof Futbolista) {
            objModificado = new Futbolista(obj.id, inputs["nombre"], inputs["apellido"], inputs["edad"], inputs["equipo"], inputs["posicion"], inputs["cantidadGoles"]);
        }
        if (objModificado) {

            const httpHandler = new HttpHandler();

            crearSpinner();
            console.log("Antes del fetch");

            httpHandler.sendPost(objModificado)
                .then(response => response.text())
                .then(responseText => {
                    let LS_Personas = toObjs(localStorage.getObj(entidades));
                    LS_Personas = LS_Personas.filter((elemento) => elemento.id !== obj.id);
                    LS_Personas.push(objModificado);

                    localStorage.removeItem(entidades);
                    localStorage.setObj(entidades, LS_Personas);

                    console.log("Quitando spiner...");
                    quitarSpinner();

                    const event = new CustomEvent('refrescarTablaPersonas');
                    document.dispatchEvent(event);
                })
                .catch(err => {
                    alert(err.message);
                    quitarSpinner();
                    const event = new CustomEvent('refrescarTablaPersonas');
                    document.dispatchEvent(event);
                });
        }
    });

    elementos.forEach((e) => formulario.appendChild(e));
}


export function crearFormAlta(formulario) {
    formulario.innerText = "Formulario Alta";
    let obj = new Persona("", "", "", "");
    let elementos = [];

    // RENDERIZADO DE FORM
    let opciones = opcionesTipos;
    const selectorTipo = document.createElement("select");

    for (var i = 0; i < opciones.length; i++) {
        var option = document.createElement("option");
        option.value = opciones[i];
        option.text = opciones[i];
        selectorTipo.appendChild(option);
        elementos.push(selectorTipo);
    }


    selectorTipo.selectedIndex = opcionesIndices["ElegirTipo"]; // "Elegir tipo"
    selectorTipo.addEventListener("change", (event) => {
        botonGuardar.disabled = false;
        let nuevosFormFields = [];
        removerCampos();

        if (selectorTipo.selectedOptions[0].value == "Futbolista") {
            if (!formulario["equipo"]) {
                let ret = agregarCampos("equipo", "", false);
                nuevosFormFields.push(ret.nuevoLabel);
                nuevosFormFields.push(ret.nuevoInput);
            }
            if (!formulario["posicion"]) {
                let ret = agregarCampos("posicion", "", false);
                nuevosFormFields.push(ret.nuevoLabel);
                nuevosFormFields.push(ret.nuevoInput);
            }
            if (!formulario["cantidadGoles"]) {
                let ret = agregarCampos("cantidadGoles", "", false);
                nuevosFormFields.push(ret.nuevoLabel);
                nuevosFormFields.push(ret.nuevoInput);
            }
            obj = new Futbolista(obj.id, obj.nombre, obj.apellido, obj.edad, "", "", "");
        }
        else if (selectorTipo.selectedOptions[0].value == "Profesional") {
            if (!formulario["titulo"]) {
                let ret = agregarCampos("titulo", "", false);
                nuevosFormFields.push(ret.nuevoLabel);
                nuevosFormFields.push(ret.nuevoInput);
            }
            if (!formulario["facultad"]) {
                let ret = agregarCampos("facultad", "", false);
                nuevosFormFields.push(ret.nuevoLabel);
                nuevosFormFields.push(ret.nuevoInput);
            }
            if (!formulario["añoGraduacion"]) {
                let ret = agregarCampos("añoGraduacion", "", false);
                nuevosFormFields.push(ret.nuevoLabel);
                nuevosFormFields.push(ret.nuevoInput);
            }
            obj = new Profesional(obj.id, obj.nombre, obj.apellido, obj.edad, "", "", "");
        }
        nuevosFormFields.forEach((e) => formulario.appendChild(e));
    })
    selectorTipo.selectedIndex = opcionesIndices["ElegirTipo"]; // "Elegir tipo"
    let props = Object.getOwnPropertyNames(obj);
    props.forEach(p => {
        let soloLectura = false;
        if (p == "id") {
            soloLectura = true;
        }
        let ret = agregarCampos(p, obj[p], soloLectura);
        elementos.push(ret.nuevoLabel);
        elementos.push(ret.nuevoInput);
    });

    const botonGuardar = document.createElement('button');
    botonGuardar.innerText = "Aceptar";
    botonGuardar.disabled = true;
    elementos.push(botonGuardar);

    // GUARDAR CAMBIOS
    botonGuardar.addEventListener('click', (e) => {
        e.preventDefault();
        let inputs = [];
        props = Object.getOwnPropertyNames(obj);
        props.forEach(p => {
            inputs[p] = document.getElementsByTagName("input")[p].value;
        });
        if (!validarInputs(inputs, selectorTipo.selectedOptions[0].value)) {
            alert("Datos incorrectos");
            return;
        }
        if (selectorTipo.selectedIndex == opcionesIndices["Futbolista"]) {
            obj = new Futbolista(undefined, inputs["nombre"], inputs["apellido"], inputs["edad"], inputs["equipo"], inputs["posicion"], inputs["cantidadGoles"]);
        }
        else if (selectorTipo.selectedIndex == opcionesIndices["Profesional"]) {
            obj = new Profesional(undefined, inputs["nombre"], inputs["apellido"], inputs["edad"], inputs["titulo"], inputs["facultad"], inputs["añoGraduacion"]);
        }
        if (obj) {
            crearSpinner();
            console.log("Antes del fetch");

            try {
                const httpHandler = new HttpHandler();

                let response = httpHandler.sendPutAsync(obj);
                response.then(response => {
                    response.json().then(response => {
                        console.log(response.id);
                        obj.id = response.id;
                        let LS_Personas = toObjs(localStorage.getObj(entidades));
                        LS_Personas.push(obj);

                        localStorage.removeItem(entidades);
                        localStorage.setObj(entidades, LS_Personas);

                        // let siguienteId = obj.id;
                        // siguienteId++;
                        // localStorage.setItem('nextId', siguienteId);

                        console.log("Quitando spiner...");
                        quitarSpinner();
                        const event = new CustomEvent('refrescarTablaPersonas', { detail: LS_Personas });
                        document.dispatchEvent(event);
                    });
                })
                    .catch(err => {
                        console.log(err);
                    })
            } catch (error) {
                alert(JSON.stringify(error));
            }
            quitarSpinner();
        };

    });

    const botonCancelar = document.createElement('button');
    botonCancelar.innerText = "Cancelar";
    elementos.push(botonCancelar);

    botonCancelar.addEventListener('click', () => {
        const eventRefrescar = new CustomEvent('refrescarTablaPersonas');
        document.dispatchEvent(eventRefrescar);
    });

    elementos.forEach((e) => formulario.appendChild(e));
}

function agregarCampos(innerText, value, soloLectura) {
    const nuevoLabel = document.createElement('label');
    const nuevoInput = document.createElement("input");
    nuevoLabel.innerText = innerText;
    nuevoLabel.id = innerText;
    nuevoInput.value = value;
    nuevoInput.readOnly = soloLectura;
    nuevoInput.id = innerText;
    return { nuevoLabel, nuevoInput };
}

function removerCampos() {
    const formulario = document.getElementById("formDatos");
    // propiedades de las clases hijas no presentes en la clase padre
    const elementosAEliminar = ["equipo", "posicion", "cantidadGoles", "titulo", "facultad", "añoGraduacion"];

    // Filtra los hijos del formulario que no deben ser eliminados
    const hijosFiltrados = Array.from(formulario.children).filter((hijo) => {
        return !elementosAEliminar.includes(hijo.id);
    });

    // Reemplaza los hijos del formulario con los hijos filtrados
    while (formulario.firstChild) {
        formulario.removeChild(formulario.firstChild);
    }

    hijosFiltrados.forEach((hijo) => {
        formulario.appendChild(hijo);
    });
}

function validarInputs(inputs, objType) {
    let datosInvalidos = []
    datosInvalidos["nombre"] = inputs["nombre"] !== undefined && inputs["nombre"] !== '';
    datosInvalidos["apellido"] = inputs["apellido"] !== undefined && inputs["apellido"] !== '';
    datosInvalidos["edad"] = inputs["edad"] > 15 && inputs["edad"] < 125;
    if (objType === "Futbolista") {
        datosInvalidos["equipo"] = inputs["equipo"] !== undefined && inputs["equipo"] !== '';
        datosInvalidos["posicion"] = inputs["posicion"] !== undefined && inputs["posicion"] !== '';
        datosInvalidos["cantidadGoles"] = inputs["cantidadGoles"] > -1;
    }
    else if (objType === "Profesional") {
        datosInvalidos["titulo"] = inputs["titulo"] !== undefined && inputs["titulo"] !== '';
        datosInvalidos["facultad"] = inputs["facultad"] !== undefined && inputs["facultad"] !== '';
        datosInvalidos["añoGraduacion"] = inputs["añoGraduacion"] > 1950;
    }
    return !Object.values(datosInvalidos).some(value => value === false);
}

export function crearSelector(opciones) {
    const selectorTipo = document.createElement("select");
    for (var i = 0; i < opciones.length; i++) {
        var o = document.createElement("option");
        o.value = opciones[i];
        o.text = opciones[i];
        selectorTipo.appendChild(o);
    }
    return selectorTipo;
}