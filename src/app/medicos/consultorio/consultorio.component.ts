import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

//Componentes de angular material
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';

//Libreria leftlet
import * as L from 'leaflet';

//Servicios
import { FuncionesValidate } from '../../servicios/funciones-validate.service';
//Interfaz del consultorio
import { Consultorio } from '../../interface/consultorio';

@Component({
  selector: 'app-consultorio',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatCheckboxModule
  ],
  templateUrl: './consultorio.component.html',
  styleUrl: './consultorio.component.css'
})
export class ConsultorioComponent implements AfterViewInit {


  //Interfaz del consultorio
  con: Consultorio | null = null;

  //Variables de la latitud y longitud
  long!: number;
  lat!: number

  ///Mapa
  private map!: L.Map;
  @ViewChild('map', { static: true }) mapElement!: ElementRef<HTMLInputElement>;


  //Campos de los datos generales



  //Campos del formulario de los datos generales del consultorio]
  // Referencias a los checkboxes 
  @ViewChild('lunesCheckbox') lunesCheckbox!: ElementRef<HTMLInputElement>;
  @ViewChild('martesCheckbox') martesCheckbox!: ElementRef<HTMLInputElement>;
  @ViewChild('miercolesCheckbox') miercolesCheckbox!: ElementRef<HTMLInputElement>;
  @ViewChild('juevesCheckbox') juevesCheckbox!: ElementRef<HTMLInputElement>;
  @ViewChild('viernesCheckbox') viernesCheckbox!: ElementRef<HTMLInputElement>;
  @ViewChild('sabadoCheckbox') sabadoCheckbox!: ElementRef<HTMLInputElement>;
  @ViewChild('domingoCheckbox') domingoCheckbox!: ElementRef<HTMLInputElement>;



  //Constructor
  constructor(private snackBar: MatSnackBar, private valf: FuncionesValidate) { }

  //Funciones que se ejecutan una vez se carga el componente
  ngAfterViewInit() {
    this.initMap();
    this.get();
  }

  //Funcion que carga el mapa al terminar de cargar el componente
  private initMap(): void {
    //Define donde se abrira el mapa siempre al cargar la pagina
    //Coordenadas de San Juan Tlalpizahuac
    this.map = L.map('map').setView([19.324386, -98.952116], 15);

    //Carga los mosaicos (partes del mapa divididos en cuadrados) del mapa  OpenStretMap es la api de donde se obtienen los mosaicos
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '© OpenStreetMap contributors' }).addTo(this.map);
  }

  async get() {
    //Realiza la peticion
    try {
      var response = await fetch('http://localhost/api/consultorio/getinfocon?id_medico=1', {/////////////CAMBIAR ID DEL MEDICO////////////////////
        method: 'GET',
        credentials: 'include',
        headers: { 'Origin': window.location.origin }
      });

      //Verifica que la respuesta sea correcta
      if (response.ok) {
        //Limpia todos los input de la pagina
        //this.valf.limpiarInputs();
        //Carga los datos del consultorio

        var result = await response.json();

        this.con = result as Consultorio;
        console.log(result);
      } else {
        this.alerta("Error al obtener los datos");
      }
    } catch (error) {
      console.error('Error POST:', error);
    }
  }

  //Localizacion por la localizacion actual
  locateMe(): void {
    //Verifica que el navegador permite la geolocalizacion
    if (navigator.geolocation) {
      //Obtiene la latitud y longitud del navegador  
      navigator.geolocation.getCurrentPosition((position) => {

        //Latitud y longitud
        const lat = position.coords.latitude;
        const long = position.coords.longitude;

        this.obtenerDireccion(lat, long)

        this.clearMap();

        //Cambia la vista del mapa a las coordenadas
        this.map.setView([lat, long], 15);

        //Quita la sombra del marcador
        const icon = new L.Icon.Default();
        icon.options.shadowSize = [0, 0];

        //Agrega el marcador
        L.marker([lat, long], { icon: icon }).addTo(this.map).bindPopup('<strong>Estas aquí</strong>').
          openPopup();
      }, () => {
        this.alerta('No se pudo obtener tu ubicación');
      });
    } else {
      this.alerta('La geolocalización no es soportada por tu navegador');
    }
  }

  //Avtualiza los datos generales del consultorio
  //
  //
  async update(event: Event, nombre: string, telefono: string, correo: string, especialidad: string, informacion: string, abre: string, cierra: string) {
    event.preventDefault();

    console.log((document.querySelector('#lunesCheckbox') as HTMLInputElement).checked);

    //Valida que los campos no esten vacios
    if (!this.valf.empty(nombre) && !this.valf.empty(telefono) && !this.valf.empty(especialidad) && !this.valf.empty(abre) && !this.valf.empty(cierra)) {
      if (this.valf.telefonoOk(telefono)) {

        //Crea un dato de tipo FormData para mandar los datos
        const formData: FormData = new FormData();
        formData.append('id_medico', '1');/////////////CAMBIAR ID DEL MEDICO////////////////////
        formData.append('nombre', nombre);


        //Realiza la peticion
        try {
          var response = await fetch('http://localhost/api/consultorio/getinfocon?id_medico=1', {/////////////CAMBIAR ID DEL MEDICO////////////////////
            method: 'GET',
            body: formData,
            credentials: 'include',
            headers: { 'Origin': window.location.origin }
          });

          //Verifica que la respuesta sea correcta
          if (response.ok) {
            //Limpia todos los input de la pagina
            //this.valf.limpiarInputs();
            //Carga los datos del consultorio

            var result = await response.json();

            this.con = result as Consultorio;
            console.log(this.con);

            //Recarga los datos del paciente
            this.alerta("Contraseña actualizada correctamente");
          } else {
            this.alerta("Error al cambiar la contraseña");
          }
        } catch (error) {
          console.error('Error POST:', error);
        }

      } else {
        this.alerta("El teléfono no es valido");
      }
    } else {
      this.alerta("Llena todos los campos requeridos.");
    }
  }

  //Actualiza la direccion del consultorio
  //
  //
  async updateDirection() {
    if (!this.valf.empty(this.lat) && !this.valf.empty(this.long)) {
      try {
        //Manda la peticion de los datos
        var response = await fetch('http://localhost/api/medico/getinfo?id_medico=1', {/////////Cambiar el id///////////////////
          method: 'GET',
          credentials: 'include',
          headers: { 'Origin': window.location.origin }
        });

        var result = await response.json();
        //Verifica que la respuesta sea correcta
        if (response.status == 200) {
          //Se colocan los valores en los input y el mapa


        } else {
          this.alerta(result.message);
        }
      } catch (error) {
        console.error('Error POST:', error);
      }
    } else {
      this.alerta("Dirección no seleccionada");
    }
  }

  //Carga los datos del consultorio
  //
  //
  async loadData() {

  }

  // Función para obtener la dirección a partir de coordenadas
  //
  //
  async obtenerDireccion(lat: number, lon: number) {
    try {
      var response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=5`, { method: 'GET' });
      var result = await response.json();
      // Verifica que la respuesta sea correcta 
      if (response.status === 200) {
        return result.display_name;
      } else {
        this.alerta('No se pudo obtener la dirección.');
      }
    } catch (error) {
      console.error('Error GET:', error);
    }
  }

  // Función para limpiar el mapa 
  clearMap() {
    if (this.map) {
      this.map.eachLayer((layer) => { this.map.removeLayer(layer); });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { attribution: '© OpenStreetMap contributors' }).addTo(this.map);
    }
  }

  //Funcion para mandar la alerta del error
  alerta(mensaje: string) {
    //Muestra la alerta
    this.snackBar.open(mensaje, 'x', {
      duration: 7000
    });
  }
}
