export class Persona {
    constructor(id, nombre, apellido, edad) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
    }
    toString() {
        return `${this.id} ${this.nombre} ${this.apellido} ${this.nombre} ${this.edad}`;
    }
    toJson() {
        return JSON.stringify(this);
    }
}
export class Futbolista extends Persona {
    constructor(id, nombre, apellido, edad, equipo, posicion, cantidadGoles) {
        super(id, nombre, apellido, edad);
        this.equipo = equipo;
        this.posicion = posicion;
        this.cantidadGoles = cantidadGoles;
    }
    toJson() {
        return JSON.stringify(this);
    }
}

export class Profesional extends Persona {
    constructor(id, nombre, apellido, edad, titulo, facultad, añoGraduacion) {
        super(id, nombre, apellido, edad);
        this.titulo = titulo;
        this.facultad = facultad;
        this.añoGraduacion = añoGraduacion;
    }
    toJson() {
        return JSON.stringify(this);
    }
}

export function toObjs(jsonArray){
    let personas = jsonArray.map((item) => {
        if (item.hasOwnProperty("posicion") && item.hasOwnProperty("equipo") && item.hasOwnProperty("cantidadGoles")) {
            return new Futbolista(item.id, item.nombre, item.apellido, item.edad, item.equipo, item.posicion, item.cantidadGoles);
        } else if (item.hasOwnProperty("titulo") && item.hasOwnProperty("facultad") && item.hasOwnProperty("añoGraduacion")) {
            return new Profesional(item.id, item.nombre, item.apellido, item.edad, item.titulo, item.facultad, item.añoGraduacion);
        } else {
            return new Persona(item.id, item.nombre, item.apellido, item.edad);
        }
    });
    return personas;
}
