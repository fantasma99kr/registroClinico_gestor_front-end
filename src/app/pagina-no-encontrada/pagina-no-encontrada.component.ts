import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

//Anotacion de la configuracion del componente
@Component({
  selector: 'app-pagina-no-encontrada',
  standalone: true,
  imports: [
    MatIcon,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './pagina-no-encontrada.component.html',
  styleUrl: './pagina-no-encontrada.component.css'
})

//Clase del componente
export class PaginaNoEncontradaComponent {

  //Constructor
  constructor(private location: Location){}
  
  //Regresa a la pagina anterior del usuario
  return(){
    this.location.back();
  }
}
