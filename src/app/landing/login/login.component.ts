import { AuthService } from './../../servicios/auth/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { signal } from '@angular/core';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

//Servicios
import { FuncionesValidate } from '../../servicios/funciones-validate.service';

//Anotacion de la configuracion del componente
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

//Clase del componente
export class LoginComponent {
  hide = signal(true);

  //Constructor
  constructor(private valf: FuncionesValidate, private snackBar: MatSnackBar, private authService: AuthService, private router: Router) {}

  //Funcion del login
  async login(event: Event,correo:string ,password:string){
    //Evita que se recargue la pagina al dar clic en el boton
    event.preventDefault();
    
    //Validacion de los campos
    if(!this.valf.empty(correo) && !this.valf.empty(password)){//Valida si los campos estan vacios
      if(this.valf.correoOk(correo)){
        //Realiza la peticion
        const formData: FormData = new FormData();
        formData.append('correo', correo);
        formData.append('password', password);
        try{
          const response = await fetch('http://localhost/api/login', {
            method: 'POST', 
            body: formData,
            credentials: 'include',
            headers: { 'Origin': window.location.origin }
          });

          //Se detiene la ejecucion a espera de respuesta
          const result = await response.json();

          console.log(result.user_type)
          
          if(response.ok){
            this.authService.login(result.user_type, result.id_user);
            this.alerta("Login correcto bienvenido " + result.user_type);
            if(result.user_type === "medico"){
              this.router.navigate(['/medico']);
            } else {
              this.router.navigate(['/paciente']);
            }

          } else {
            this.alerta(result.message);
          }

        } catch(error){
          console.error('Error POST:', error);
        }
      } else {
        this.alerta("El correo no esta registrado");
      }
    } else {
      this.alerta("Llena todos los campos");
    }
  }

  //Funcion para mandar la alerta del error
  alerta(mensaje: string){
    //Muestra la alerta
    this.snackBar.open(mensaje, 'x', {
      duration: 7000
    });
  }


  //Funcion del boton para mostrar la contrasña
  iconoPassword(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  
}
