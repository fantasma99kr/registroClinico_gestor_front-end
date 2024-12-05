import { AfterViewInit, Component, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../servicios/auth/auth.service';

//Bootstrap
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BsDatepickerModule, BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';

//Componentes de angular material
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';

//Libreria leftlet
import * as L from 'leaflet';

//Interface de los consultorios
import { Consultorio } from '../../interface/consultorio';

//Servicios
import { FuncionesValidate } from '../../servicios/funciones-validate.service';

//Anoracion del 
@Component({
  selector: 'app-nueva-cita',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatSelectModule,
    BsDatepickerModule,

  ],
  templateUrl: './nueva-cita.component.html',
  styleUrl: './nueva-cita.component.css'
})

//Clase del componente
export class NuevaCitaComponent implements AfterViewInit {

  //Configuracion del datepiker de bootstrap
  bsConfig!: Partial<BsDatepickerConfig>;
  //Datos del consultorio
  infoCon!: Consultorio;
  ///Mapa
  private map!: L.Map;
  //Id del paciente
  id_paciente = '';
  //Modal
  modalRef!: BsModalRef;

  @ViewChild('fechaCita') fechaCita!: ElementRef<HTMLInputElement>;

  //constructor
  //
  //
  constructor(private valf: FuncionesValidate, private snackBar: MatSnackBar, private localeService: BsLocaleService, private authService: AuthService, private modalService: BsModalService) {
    //Obtiene la fecha actual
    var date = new Date();
    //Configuracion del datepiker
    this.bsConfig = {
      containerClass: 'theme-dark-blue',//Tema del datepiker
      dateInputFormat: 'YYYY-MM-DD',//Formato de la fecha
      minDate: date
    };
    //Cambia el idioma del datepiker
    this.localeService.use('es');
    //Obtiene el valor del id del paciente
    this.id_paciente = authService.getId() + '';
  }

  //Funciones que se ejecutaran cuando cargue el componente
  //
  //
  ngAfterViewInit() {
    this.initMap();
  }

  //Funcion que carga el mapa al terminar de cargar el componente
  private initMap(): void {
    //Define donde se abrira el mapa siempre al cargar la pagina
    //Coordenadas de San Juan Tlalpizahuac
    this.map = L.map('map').setView([19.324386, -98.952116], 15);

    //Carga los mosaicos o imagenes del mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(this.map);

    //Carga los puntos en el mapa
    this.loadConsultorios();
  }

  async loadConsultorios() {
    try {
      var response = await fetch('http://localhost/api/consultorio/getconsultorios', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Origin': window.location.origin }
      });

      //Se detiene la ejecucion a espera de respuesta
      //Status de la respuesta 
      // console.log(response.status);

      //Quita la sombra del marcador
      var icon = new L.Icon.Default();
      icon.options.shadowSize = [0, 0];

      //Verifica que la respuesta sea correcta
      if (response.status == 201) {
        //Castea los datos a .json
        var results = await response.json();
        //Quita la sombra del marcador
        var icon = new L.Icon.Default();
        icon.options.shadowSize = [0, 0];


        results.forEach((con: Consultorio) => {

          con.dias = JSON.parse(con.dias as unknown as string);//Pasa los dias de string a objeto

          //Agrega el marcador
          L.marker([con.latitud, con.longitud], { icon: icon }).addTo(this.map)
            .on('click', () => { this.updateInfo(con) })//Funcion para mandar los datos al componente de los datos
            .bindPopup("<strong>" + con.nombre + "</strong>");//Informacion del marcador
        });
      } else {
        this.alerta("Error al mostrar los consultorios");
      }

    } catch (error) {
      console.error('Error POST:', error);
    }
  }

  //Actualiza los datos del componente de la informacion del consultorio
  updateInfo(con: Consultorio): void {
    //Obtiene los datos del consultorio seleccionado para utilizarlos en el modal en caso de ser eleccionado
    this.infoCon = con;
    //Muestra los datos del consultorio
    (document.querySelector('#direccion') as HTMLElement).textContent = con.direccion;
    (document.querySelector('#telefono') as HTMLElement).textContent = con.telefono;
    (document.querySelector('#especialidad') as HTMLElement).textContent = con.especialidad;
    (document.querySelector('#correo') as HTMLElement).textContent = con.correo;
    (document.querySelector('#horario') as HTMLElement).textContent = con.abre_h + ' - ' + con.cierra_h;

    //Selecciona la lista de botones de los dias
    var dias = document.querySelectorAll('#dias button');

    //Se elimina el atributo hidden de los botones de los dias
    dias.forEach(dia => {
      dia.removeAttribute('hidden'); //Elimina el atributo hidden
    });

    //Dependiendo de si se abre o no ese dia se agrega un hidden al boton para indicar los dias disponibles
    if (!con.dias['Lunes']) {
      (document.querySelector('#lu') as HTMLElement).setAttribute("hidden", "");
    }
    if (!con.dias['Martes']) {
      (document.querySelector('#ma') as HTMLElement).setAttribute("hidden", "");
    }
    if (!con.dias['Miercoles']) {
      (document.querySelector('#mi') as HTMLElement).setAttribute("hidden", "");
    }
    if (!con.dias['Jueves']) {
      (document.querySelector('#ju') as HTMLElement).setAttribute("hidden", "");
    }
    if (!con.dias['Viernes']) {
      (document.querySelector('#vi') as HTMLElement).setAttribute("hidden", "");
    }
    if (!con.dias['Sabado']) {
      (document.querySelector('#sa') as HTMLElement).setAttribute("hidden", "");
    }
    if (!con.dias['Domingo']) {
      (document.querySelector('#do') as HTMLElement).setAttribute("hidden", "");
    }

  }

  // Método para deshabilitar días específicos en el datepicker 
  disableDays(dias: { [key: string]: boolean }) {
    //Dias de la semana
    var daysDisabled: number[] = [];
    //Iterador del for
    var dayIndex = 0;

    //For utilizado para obtener los dias en los que no abre el consultorio para desactivarlos
    for (var habilitado of Object.values(dias)) {
      //console.log(habilitado);
      //Si no es true se agrega el dia
      if (!habilitado) {
        daysDisabled.push(dayIndex);
      }
      dayIndex++;
    }
    //Actualiza la configuración del datepicker para deshabilitar los días
    this.bsConfig.daysDisabled = daysDisabled;
  }

  //Abre el modal y configura los input de acuerdo a los datos del consultorio
  //
  //
  async openModal(template: TemplateRef<any>) {
    //Valida si se selecciono un consultorio
    if (!this.valf.empty(this.infoCon)) {
      var dias = this.infoCon.dias;

      //Array de los dias desactivados cambia los dias disponibles en el datepiker
      this.disableDays(this.infoCon.dias);


      //Abre el modal
      this.modalRef = this.modalService.show(template, { class: 'modal-xl', backdrop: false });//se le agrega la clase modal xl para hacer el modal grande
    } else {
      this.alerta("Selecciona un consultorio");
    }
  }

  //Evento al dar clic sobre un dia del calendario
  //Cambia los horarios de forma dinamica y muestra solo los horarios disponibles
  //
  async onDateChange(event: Date) {
    //Retardo para obtener la fecha
    setTimeout(async () => {
      //Fecha seleccionada
      var fecha = this.fechaCita.nativeElement.value;

      //Se manda una peticion para obtener los horarios disponibles
      try {
        const response = await fetch('http://localhost/api/consultorio/horarios?id_consultorio=' + this.infoCon.id_consultorio + '&fecha=' + fecha, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Origin': window.location.origin }
        });//Peticion fetch

        //Si la respuesta es correcta muestra los horarios
        if (response.ok) {
          var result = await response.json();

          (document.querySelector('#horariocita') as HTMLElement).innerHTML = `<option value="" disabled selected>Seleccione un horario</option>`;

          //Valida que se mandaran horarios disponibles ese dia
          if (!this.valf.empty(result)) {
            this.alerta("Horarios disponibles por favor seleccione un horario");
            
            result.forEach((horario: string) => {
              (document.querySelector('#horariocita') as HTMLElement).innerHTML += `<option value="${horario}">${horario}</option>`;
            });

          } else {
            this.alerta("!No hay horarios disponibles ese día por favor seleccione otro día!");
          }
        } else {
          //Si la respuesta es diferente se obtiene la respuesta y se muestra el mensaje
          var result = await response.json();
          this.alerta(result.message)
        }

      } catch (error) {
        console.error('Error POST:', error);
      }
    }, 0);
  }

  //Se registra la nueva cita
  async nuevaCita(event: Event, fecha: string, horario: string, tipo: string, infoAdicional: string, permisos:string) {
    event.preventDefault();

    //Valida que los campos no esten vacios
    if (!this.valf.empty(fecha) && !this.valf.empty(horario) && !this.valf.empty(tipo)) {
      //Se crea el objeto formdata para mandar los parametros
      var id_consultorio = this.infoCon.id_consultorio + '';
      var formData = new FormData();
      formData.append('id_paciente', this.id_paciente);
      formData.append('id_consultorio', id_consultorio);
      formData.append('horario', horario);
      formData.append('permiso_historial', permisos);
      formData.append('fecha', fecha);
      formData.append('datos_adicionales', infoAdicional);  
      formData.append('tipo_cita', tipo);
        

      //Manda los datos del historial clinico
      try {
        //Actualizacion del registro
        var response = await fetch('http://localhost/api/consultorio/newcita', {
          method: 'POST',
          body: formData,
          credentials: 'include',
          headers: { 'Origin': window.location.origin }
        });

        //Se obtiene el resultado
        var result = await response.json();
        //Verifica que el registro del historial se actualice correctamente
        if (response.ok) {
          //Cierra el modal
          this.modalRef.hide();
          
          this.alerta("Cita registrada correctamente.");

        } else {
          this.alerta(result.message);
        }
      } catch (error) {
        console.error('Error POST:', error);
      }

    } else {
      this.alerta("Llena todos los campos.");
    }
  }

  //Funcion para mandar la alertas con el snackbar de angular material
  //
  //
  alerta(mensaje: string) {
    //Muestra la alerta
    this.snackBar.open(mensaje, 'x', {
      duration: 9000,
      panelClass: 'custom-snackbar'
    });
  }

  //Localizacion por la localizacion actual
  locateMe(): void {
    //Verifica que el navegador permite la geolocalizacion
    if (navigator.geolocation) {
      //Obtiene la latitud y longitud del navegador  
      navigator.geolocation.getCurrentPosition((position) => {

        const lat = position.coords.latitude;
        const long = position.coords.longitude;

        //Cambia la vista del mapa a las coordenadas
        this.map.setView([lat, long], 15);

        //Quita la sombra del marcador
        const icon = new L.Icon.Default();
        icon.options.shadowSize = [0, 0];

        //Agrega el marcador
        L.marker([lat, long], { icon: icon }).addTo(this.map).bindPopup('Estas aqui').
          openPopup();
      }, () => {
        alert('No se pudo obtener tu ubicación');
      });
    } else {
      alert('La geolocalización no es soportada por tu navegador');
    }
  }

}
