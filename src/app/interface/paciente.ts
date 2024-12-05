export interface Paciente {
    id_paciente: number;
    nombre: string;
    apellidos: string;
    no_telefono: string;
    direccion?: string;
    correo: string;
    fecha_nacimiento: string;
    latitud?: number;
    longitud?: number;
    password: string;
    validation_code?: string;
  }
  