import { Component, OnInit } from '@angular/core';
//Componentes de angular material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';

//Libreria leftlet
import * as L from 'leaflet';

//Interface de los consultorios
import { Consultorio } from '../../interface/consultorio';

@Component({
  selector: 'app-inicio-general',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
  ],
  templateUrl: './inicio-general.component.html',
  styleUrl: './inicio-general.component.css'
})

//Clase del componente
export class InicioGeneralComponent implements OnInit {
  //Variables
  ///Mapa
  private map!: L.Map;

  //Constructor
  constructor(private snackBar: MatSnackBar) { }

  //Funciones que se ejecutan una vez se carga el componente
  ngOnInit(): void {
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
        const icon = new L.Icon.Default();
        icon.options.shadowSize = [0, 0];


        results.forEach((con: Consultorio) => { 
          
          con.dias = JSON.parse(con.dias as unknown as string);//Pasa los dias de string a objeto
          //Agrega el marcador
          L.marker([con.latitud, con.longitud], { icon: icon }).addTo(this.map)
            .on('click', () => { this.updateInfo(con) })//Funcion para mandar los datos al componente de los datos
            .bindPopup("<strong>" + con.nombre + "</strong>");//Informacion del marcador
        });
      } else {
        alert("Error al mostrar los consultorios");
      }

    } catch (error) {
      console.error('Error POST:', error);
    }
  }

  //Actualiza los datos del componente de la informacion del consultorio
  updateInfo(con: Consultorio): void {
    (document.querySelector('#direccion') as HTMLElement).textContent = con.direccion;
    (document.querySelector('#telefono') as HTMLElement).textContent = con.telefono;
    (document.querySelector('#especialidad') as HTMLElement).textContent = con.especialidad;
    (document.querySelector('#informacion') as HTMLElement).textContent = con.informacion;
    (document.querySelector('#horario') as HTMLElement).textContent = con.abre_h + ' - ' + con.cierra_h;
    
    var dias = document.querySelectorAll('#dias button');
    dias.forEach(dia => {
      dia.removeAttribute('hidden'); // Elimina el atributo hidden
    });
    console.log(con.dias['Lunes']);
    if(!con.dias['Lunes']){
      (document.querySelector('#lu') as HTMLElement).setAttribute("hidden","");
    }
    if(!con.dias['Martes']){
      (document.querySelector('#ma') as HTMLElement).setAttribute("hidden","");
    }
    if(!con.dias['Miercoles']){
      (document.querySelector('#mi') as HTMLElement).setAttribute("hidden","");
    }
    if(!con.dias['Jueves']){
      (document.querySelector('#ju') as HTMLElement).setAttribute("hidden","");
    }
    if(!con.dias['Viernes']){
      (document.querySelector('#vi') as HTMLElement).setAttribute("hidden","");
    }
    if(!con.dias['Sabado']){
      (document.querySelector('#sa') as HTMLElement).setAttribute("hidden","");
    }
    if(!con.dias['Domingo']){
      (document.querySelector('#do') as HTMLElement).setAttribute("hidden","");
    }

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


  //Funcion para mandar la alertas
  alerta(mensaje: string) {
    //Muestra la alerta
    this.snackBar.open(mensaje, 'x', {
      duration: 7000
    });
  }


  // //Busqueda por el nombre del lugar
  // async searchPlace(event:Event,$lugar:string) {
  //   event.preventDefault();

  //   //Si no escribe nada
  //   if ($lugar) {
  //     try {
  //       //Consulta de la direccion
  //       const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${$lugar}&format=jsonv2&limit=1`);
  //       const data = await response.json();

  //       //Verifica que se mandaran las coordenadas
  //       if (data.length > 0) {

  //         const lat = data[0].lat;
  //         const lon = data[0].lon;
  //         this.map.setView([lat, lon], 13);
  //         L.marker([lat, lon]).addTo(this.map)
  //           .bindPopup(data[0].display_name)
  //           .openPopup();
  //       } else {
  //         this.alerta("No se encontraron resultados");
  //       }
  //     } catch (error) {
  //       console.error('Error en la búsqueda:', error);
  //     }
  //   } else {
  //     this.alerta("Por favor, ingresa la direccion.");
  //   }
  // }
}


