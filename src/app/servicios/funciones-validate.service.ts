import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

//Servicio para validar campos en los formularios
export class FuncionesValidate {

  constructor() { }

  //Valida si la variable esta vacia si lo esta regresa true
  empty(variable: any):boolean{
    if (variable == null) {
      return true; // Es nulo o indefinido
    }

    if (typeof variable === 'string') {
      return variable.trim() === ''; // Comprueba cadenas vacías
    }

    if (Array.isArray(variable)) {
      return variable.length === 0; // Comprueba arreglos vacíos
    }

    if (typeof variable === 'object') {
      return Object.keys(variable).length === 0; // Comprueba objetos vacíos
    }

    return false; // Para otros tipos (números, booleanos, etc.), no se consideran vacíos
  }

  //Limpia todos los inpuit de la pagina
  limpiarInputs(): void { 
    var inputs = document.querySelectorAll('input'); inputs.forEach(input => input.value = ''); 
    var textareas = document.querySelectorAll('textarea'); textareas.forEach(textarea => textarea.value = '');
  }

  //Valida si el correo tiene un formato correcto
  correoOk(correo: string):boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(correo); // Devuelve true si el correo es válido
  }

  //Valida el formato de la contraseña minimo 5 caracteres y uno de los siguientes caracteres #, $, %, ^, o &
  passOk(password:string):boolean{
    const regex = /^(?=.*[#\$%\^&]).{5,}$/;
    return regex.test(password); // Retorna true si cumple con los requisitos
  }

  //Valida el numero de telefono
  telefonoOk(telefono:string):boolean{
    const regex = /^(\(\d{3}\)|\d{3})[-\s]?\d{3}[-\s]?\d{4}$/;
    return regex.test(telefono); // Retorna true si el número es válido
  }



}
