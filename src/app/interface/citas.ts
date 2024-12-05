export interface Citas {
    id_cita: string;
    id_paciente: string;
    nombre_paciente?:string;
    id_consultorio?: string;// Dato opcional
    nombre_consultorio?: string;// Dato opcional 
    permiso_historial: string;
    horario: string;
    fecha: string;
    datos_adicionales: string;
    estado: string;
    tipo_cita: string;
}
