import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { BsDatepickerModule, BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';


// Define el idioma español para el datepicker 
defineLocale('es', esLocale);

// Componentes de angular material
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';

import { provideNativeDateAdapter } from '@angular/material/core';

//Servicios
import { FuncionesValidate } from '../../servicios/funciones-validate.service';

//Anoracion del componente
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatDividerModule,
    MatFormFieldModule,
    BsDatepickerModule
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

//Clase del componente
export class RegistroComponent {

  hide = signal(true);
  hide1 = signal(true);

  bsConfig!: Partial<BsDatepickerConfig>;

  maxDate = new Date();

  //Constructor se inyectan la el servicio de validacion y el snackbar para las alertas
  //
  //
  constructor(private valf: FuncionesValidate, private snackBar: MatSnackBar, private localeService: BsLocaleService) { 
    //Configuracion del datepiker
    this.bsConfig = { containerClass: 'theme-default', dateInputFormat: 'YYYY-MM-DD', maxDate: this.maxDate};
    //Cambia el idioma del datepiker
    this.localeService.use('es');
  }

  //Funcion de registro del paciente
  //
  //
  async registroPaciente(event: Event, correo: string, password: string, rpassword: string, nombre: string, apellidos: string, tel: string, fecha_nacimiento: string) {
    //Evita que se recargue la pagina al dar clic en el boton
    event.preventDefault();
    //Valida si alguno de los campos estan vacios
    if (!this.valf.empty(correo) && !this.valf.empty(password) && !this.valf.empty(rpassword) && !this.valf.empty(nombre) && !this.valf.empty(apellidos) && !this.valf.empty(tel) && !this.valf.empty(fecha_nacimiento)) {
      if (this.valf.correoOk(correo)) {//Formato de correo
        if (this.valf.passOk(password)) {//Formato de la contraseña
          if (password === rpassword) {//Que las contraseñas sean iguales
            if (this.valf.telefonoOk(tel)) {
              //Crea un dato de tipo FormData para mandar los datos
              const formData: FormData = new FormData();
              formData.append('correo', correo);
              formData.append('password', password);
              formData.append('nombre', nombre);
              formData.append('apellidos', apellidos);
              formData.append('telefono', tel);
              formData.append('fecha_nacimiento', fecha_nacimiento);

              //Realiza la peticion
              try {
                const response = await fetch('http://localhost/api/registro/paciente', {
                  method: 'POST',
                  body: formData,
                  credentials: 'include',
                  headers: { 'Origin': window.location.origin }
                });

                //Verifica que la respuesta sea correcta
                if (response.ok) {
                  this.alerta("Registro realizado con exito");
                  this.valf.limpiarInputs();
                } else {
                  this.alerta("Error al realizar el registro.");
                }
              } catch (error) {
                console.error('Error POST:', error);
              }
            } else {
              this.alerta("El telefono no es valido");
            }
          } else {
            this.alerta("Las contraseñas no coinciden");
          }
        } else {
          this.alerta("La contraseña no es valida");
        }
      } else {
        this.alerta("Correo no valido");
      }
    } else {
      this.alerta("Llena todos los campos");
    }
  }

  //Funcion de registro del medico
  //
  //
  async registroMedico(event: Event, correo: string, password: string, rpassword: string, nombre: string, apellidos: string) {
    //Evita que se recargue la pagina al dar clic en el boton
    event.preventDefault();
    //Valida si alguno de los campos estan vacios
    if (!this.valf.empty(correo) && !this.valf.empty(password) && !this.valf.empty(rpassword) && !this.valf.empty(nombre) && !this.valf.empty(apellidos)) {
      if (this.valf.correoOk(correo)) {//Formato de correo
        if (this.valf.passOk(password)) {//Que las contraseñas sean iguales
          if (password === rpassword) {//Valida que las contraseñas sean iguales
            //Crea un dato de tipo FormData para mandar los datos
            const formData: FormData = new FormData();
            formData.append('correo', correo);
            formData.append('password', password);
            formData.append('nombre', nombre);
            formData.append('apellidos', apellidos);

            //Realiza la peticion
            try {
              const response = await fetch('http://localhost/api/registro/medico', {
                method: 'POST',
                body: formData,
                credentials: 'include',
                headers: { 'Origin': window.location.origin } //Manda el en el header el origen
              });

              //Se detiene la ejecucion a espera de respuesta
              const result = await response.json();

              if (response.status === 201) {
                this.alerta("Registro realizado con exito");
                this.valf.limpiarInputs();
              } else {
                this.alerta(result.message);
              }

            } catch (error) {
              console.error('Error POST:', error);
            }

          } else {
            this.alerta("Las contraseñas no coinciden");
          }
        } else {
          this.alerta("La contraseña no es valida");
        }
      } else {
        this.alerta("Correo no valido");
      }
    } else {
      this.alerta("Llena todos los campos");
    }
  }

  //Funcion para mandar la alerta del error
  alerta(mensaje: string) {
    //Muestra la alerta
    this.snackBar.open(mensaje, 'x', {
      duration: 7000
    });
  }

  //Evento del botón para mostrar la contraseña form 1
  pass(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  passRepet(event: MouseEvent) {
    this.hide1.set(!this.hide1());
    event.stopPropagation();
  }


}
