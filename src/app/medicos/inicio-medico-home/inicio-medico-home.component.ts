import { Component, signal, ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { AuthService } from '../../servicios/auth/auth.service';
import { FormsModule } from '@angular/forms'

//Componentes de angular material
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';

import { provideNativeDateAdapter } from '@angular/material/core';

//Interfaz
import { Medico } from '../../interface/medico';

//Servicios
import { FuncionesValidate } from '../../servicios/funciones-validate.service';


//Anotacion de la configuracion del componente
@Component({
  selector: 'app-inicio-medico-home',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
  ],
  templateUrl: './inicio-medico-home.component.html',
  styleUrl: './inicio-medico-home.component.css'
})

//Clase del componente
export class InicioMedicoHomeComponent implements AfterViewInit {
  hide = signal(true);
  hide1 = signal(true);

  medico: Medico | null = null;
  //Id del paciente
  id_medico = '';

  //Referencia de los elementos del los input de los datos generales
  @ViewChild('nombre') nombreInput!: ElementRef<HTMLInputElement>;
  @ViewChild('apellidos') apellidosInput!: ElementRef<HTMLInputElement>;
  @ViewChild('cedula') cedulaInput!: ElementRef<HTMLInputElement>;


  //Constructor
  //
  //
  constructor(private valf: FuncionesValidate, private snackBar: MatSnackBar, private authService: AuthService, private changeDetectorRef: ChangeDetectorRef) {
    //obtiene el id del medico
    this.id_medico = this.authService.getId() + "";
  }

  //Funcion que se ejecutara cuando cargue el componente
  //
  //
  ngAfterViewInit() {
    //Carga los datos del medico
    this.get();
  }

  //Obtiene los datos generales del medico
  //
  //
  async get() {
    try {
      //Manda la peticion de los datos
      var response = await fetch('http://localhost/api/medico/getinfo?id_medico=' + this.id_medico, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Origin': window.location.origin }
      });

      //Verifica que la respuesta sea correcta
      if (response.status == 200) {
        var result = await response.json();
        this.medico = result as Medico;

        //Se colocan los valores en los input
        this.nombreInput.nativeElement.value = this.medico.nombre;
        this.apellidosInput.nativeElement.value = this.medico.apellidos;
        this.cedulaInput.nativeElement.value = this.medico.cedula;

        this.changeDetectorRef.detectChanges();
      } else {
        this.alerta(result.message);
      }
    } catch (error) {
      console.error('Error POST:', error);
    }
  }


  //Actualiza los datos del medico
  //
  //
  async update(event: Event, nombre: string, apellidos: string, cedula: string) {
    //Evita que se recargue la pagina
    event.preventDefault();
    if (!this.valf.empty(nombre) && !this.valf.empty(apellidos) && !this.valf.empty(cedula)) {
      const formData: FormData = new FormData();
      formData.append('id_medico', this.id_medico);
      formData.append('nombre', nombre);
      formData.append('apellidos', apellidos);
      formData.append('cedula', cedula);

      //Realiza la peticion
      try {
        var response = await fetch('http://localhost/api/medico/update', {
          method: 'POST',
          body: formData,
          credentials: 'include',
          headers: { 'Origin': window.location.origin }
        });

        //Verifica que la respuesta sea correcta
        if (response.status == 200) {
          //Limpia los inputs
          this.valf.limpiarInputs();
          //Obtiene los datos actualizados
          this.get();
          this.alerta("Datos actualizados correctamente");
        } else {
          this.alerta("Error al actualizar los datos");
        }
      } catch (error) {
        console.error('Error POST:', error);
      }
    } else {
      this.alerta("Llena todos los campos");
    }
  }

  //Actualiza la contraseña del medico
  //
  //
  async passUpdate(event: Event, password: string, repeatPassword: string) {
    //Evita que se recargue la pagina al dar clic en el boton
    event.preventDefault();

    //Verifica que los campos esten llenos
    if (!this.valf.empty(password) && !this.valf.empty(repeatPassword)) {

      //Verifica que las contraseñas sean iguales
      if (password === repeatPassword) {

        //Verifica que la contraseña sea valida
        if (this.valf.passOk(password)) {
          //Crea un dato de tipo FormData para mandar los datos
          const formData: FormData = new FormData();
          formData.append('id_medico', this.id_medico);
          formData.append('password', password);

          //Realiza la peticion
          try {
            var response = await fetch('http://localhost/api/medico/changepass', {
              method: 'POST',
              body: formData,
              credentials: 'include',
              headers: { 'Origin': window.location.origin }
            });

            //Verifica que la respuesta sea correcta
            if (response.status == 200) {
              //Limpia todos los input de la pagina
              this.valf.limpiarInputs();
              //Carga los datos del paciente
              this.get();
              //Recarga los datos del paciente
              this.alerta("Contraseña actualizada correctamente");
            } else {
              this.alerta("Error al cambiar la contraseña");
            }
          } catch (error) {
            console.error('Error POST:', error);
          }
        } else {
          this.alerta("La contraseña no es valida");
        }
      } else {
        this.alerta("Las contraseñas no son iguales");
      }
    } else {
      this.alerta("Llena todos los campos de contraseña");
    }
  }


  //Evento del botón para mostrar la contraseña form
  pass(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  passRepet(event: MouseEvent) {
    this.hide1.set(!this.hide1());
    event.stopPropagation();
  }

  //Funcion para mandar la alerta del error
  //
  //
  alerta(mensaje: string) {
    //Muestra la alerta
    this.snackBar.open(mensaje, 'x', {
      duration: 7000
    });
  }
}
