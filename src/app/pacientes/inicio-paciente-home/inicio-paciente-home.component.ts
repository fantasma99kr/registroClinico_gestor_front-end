import { Component, signal, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { BsDatepickerModule, BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { AuthService } from '../../servicios/auth/auth.service';

// Define el idioma español para el datepicker 
defineLocale('es', esLocale);

//Componentes de angular material
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';

//Interfaz
import { Paciente } from '../../interface/paciente';

import { provideNativeDateAdapter } from '@angular/material/core';

//Servicios
import { FuncionesValidate } from '../../servicios/funciones-validate.service';

//Anotacion para la congfiguracion del componente
@Component({
  selector: 'app-inicio-paciente-home',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    BsDatepickerModule
  ],
  templateUrl: './inicio-paciente-home.component.html',
  styleUrl: './inicio-paciente-home.component.css',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

//Clase del componente
export class InicioPacienteHomeComponent implements AfterViewInit {
  //Interfaz del paciente
  paciente: Paciente | null = null;
  //Id del paciente
  id_paciente =  '';
  //Variables de la contraseña
  hide = signal(true);
  hide1 = signal(true);
  //Config del datapiker
  bsConfig!: Partial<BsDatepickerConfig>;
  //Fecha limite del datapiker
  maxDate = new Date();

  //Referencia de los elementos del los input de los datos generales
  @ViewChild('Pnombre') Pnombre!: ElementRef<HTMLInputElement>; 
  @ViewChild('Papellidos') Papellidos!: ElementRef<HTMLInputElement>; 
  @ViewChild('Ptelefono') Ptelefono!: ElementRef<HTMLInputElement>; 
  @ViewChild('fechaNacimiento') fechaNacimiento!: ElementRef<HTMLInputElement>;


  //Constructor
  //
  //
  constructor(private valf: FuncionesValidate, private snackBar: MatSnackBar, private localeService: BsLocaleService, private authService: AuthService, private changeDetectorRef: ChangeDetectorRef) {
    //Configuracion del datepiker
    this.bsConfig = { containerClass: 'theme-default', dateInputFormat: 'YYYY-MM-DD', maxDate: this.maxDate};
    //Cambia el idioma del datepiker
    this.localeService.use('es');
    //Obtiene el valor del id del paciente
    this.id_paciente = this.authService.getId() + '';
  }

  //Funciones que se ejecutaran cuando cargue el componente
  //
  //
  ngAfterViewInit() {
    this.getInfo();
  }

  //Obtener info generla del paciente
  //
  //
  async getInfo() {
    try {
      //Manda la peticion de los datos
      var response = await fetch('http://localhost/api/paciente/getinfo?id_paciente=' + this.id_paciente, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Origin': window.location.origin }
      });

      //Verifica que la respuesta sea correcta
      if (response.status == 200) {
        var result = await response.json();
        
        this.paciente = result as Paciente;

        this.Pnombre.nativeElement.value = this.paciente.nombre;
        this.Papellidos.nativeElement.value = this.paciente.apellidos;
        this.Ptelefono.nativeElement.value = this.paciente.no_telefono;
        this.fechaNacimiento.nativeElement.value = this.paciente.fecha_nacimiento;

        this.changeDetectorRef.detectChanges();
      } else {
        this.alerta(result.message);
      }
    } catch (error) {
      console.error('Error POST:', error);
    }
  }

  //Actualizar datos
  //
  //
  async actualizar(event: Event, password: string, rpassword: string, nombre: string, apellidos: string, tel: string, fecha_nacimiento: string) {
    //Evita que se recargue la pagina al dar clic en el boton
    event.preventDefault();

    //Valida si alguno de los campos estan vacios
    if (!this.valf.empty(nombre) && !this.valf.empty(apellidos) && !this.valf.empty(tel) && !this.valf.empty(fecha_nacimiento)) {

      if (this.valf.telefonoOk(tel)) {
        //Crea un dato de tipo FormData para mandar los datos
        const formData: FormData = new FormData();
        formData.append('id_paciente', this.id_paciente);
        formData.append('nombre', nombre);
        formData.append('apellidos', apellidos);
        formData.append('telefono', tel);
        formData.append('fecha_nacimiento', fecha_nacimiento);

        //Realiza la peticion
        try {
          var response = await fetch('http://localhost/api/paciente/update', {
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
            this.getInfo();
            this.alerta("Datos actualizados correctamente");
          } else {
            this.alerta("Error al actualizar los datos");
          }
        } catch (error) {
          console.error('Error POST:', error);
        }
      } else {
        this.alerta("El telefono no es valido");
      }
    } else {
      this.alerta("Llena todos los campos");
    }
  }

  async changepass(event: Event, pass: string, repeatpass: string) {
    //Evita que se recargue la pagina al dar clic en el boton
    event.preventDefault();

    //Verifica que los campos esten llenos
    if (!this.valf.empty(pass) && !this.valf.empty(repeatpass)) {

      //Verifica que las contraseñas sean iguales
      if (pass === repeatpass) {

        //Verifica que la contraseña sea valida
        if (this.valf.passOk(pass)) {
          //Crea un dato de tipo FormData para mandar los datos
          const formData: FormData = new FormData();
          formData.append('id_paciente', this.id_paciente);
          formData.append('password', pass);

          //Realiza la peticion
          try {
            var response = await fetch('http://localhost/api/paciente/updatepass', {
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
              this.getInfo();
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


  //Evento del botón para mostrar la contraseña form 1
  pass(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  passRepet(event: MouseEvent) {
    this.hide1.set(!this.hide1());
    event.stopPropagation();
  }

  //Funcion para mandar la alerta del error
  alerta(mensaje: string) {
    //Muestra la alerta
    this.snackBar.open(mensaje, 'x', {
      duration: 7000
    });
  }
}
