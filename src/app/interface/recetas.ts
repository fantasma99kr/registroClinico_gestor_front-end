export interface Receta {
    id_receta: number;
    id_medico: number;
    nombre_medico?: string;
    apellidos_medico?: string;
    id_consultorio: number;
    nombre_consultorio?: string;
    id_paciente: number;
    nombre_paciente?: string;
    apellidos_paciente?: string;
    edad: number;
    estatura: number;
    peso: number;
    diagnostico: string;
    fecha: Date;
    alergias: string;
    temperatura: string;
    tratamiento: string;
    t_a: string;
}
  