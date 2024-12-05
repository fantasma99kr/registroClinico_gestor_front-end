export interface Medico {
    id_medico: string;
    nombre:string;
    apellidos:string;
    correo:string;
    password:string;
    cedula:string;
    validation_code?:string;///? indica que es opcional
}