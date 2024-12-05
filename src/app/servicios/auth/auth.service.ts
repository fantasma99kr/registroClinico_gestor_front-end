//Sevicio para la autenticacion
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

//Clase del servicio de autenticacion
export class AuthService {

  //Se crea la sesion del usuario con el tipo nombre y id
  login(type: 'medico'|'paciente', id:string){
    //Define en localstorage el tipo de usuario
    localStorage.setItem('usertype', type);
    localStorage.setItem('id', id);
  }
  
  //cerrar sesion
  logout() { 
    //Elimina el item usertype del local storage 
    localStorage.removeItem('usertype'); 
    localStorage.removeItem('id');
  }

  //Obtener el tipo de usuario
  getType(): 'medico' | 'paciente' | null {
    //Obtiene el valor del item del localstorage
    return localStorage.getItem('usertype') as 'medico' | 'paciente' | null;
  }

  //Obtiene el id del usuario
  getId(){
    return localStorage.getItem('id');
  }

  //Valida si es o no un medico
  isMedico(): boolean {
    //Si es medico retorna true
    return localStorage.getItem('usertype') === 'medico';
  }

  //Valida si es o no un paciente
  isPaciente(): boolean {
    //Si es paciente retorna true
    return localStorage.getItem('usertype') === 'paciente';
  }

  //Valida si se inico sesion
  isLoggedIn(): boolean {
    //Valida que el tipo de usuario este definido
    return localStorage.getItem('usertype') != null;
  }
}
