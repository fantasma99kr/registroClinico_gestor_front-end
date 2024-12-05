export interface Consultorio {
        id_consultorio: number;
        nombre: string;
        direccion: string;
        latitud: number;
        longitud: number;
        abre_h: string;
        cierra_h: string;
        dias: { [key: string]: boolean };
        telefono: string;
        correo: string;
        especialidad: string;
        informacion: string;
}
