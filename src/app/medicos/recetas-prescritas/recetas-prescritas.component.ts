import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { AuthService } from '../../servicios/auth/auth.service';

//Componentes de angular material
import { MatCardModule } from '@angular/material/card';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';

import { Receta } from '../../interface/recetas';

//Anotacion de la configuracion del componente
//
//
@Component({
  selector: 'app-recetas-prescritas',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './recetas-prescritas.component.html',
  styleUrl: './recetas-prescritas.component.css'
})
export class RecetasPrescritasComponent implements AfterViewInit {
  //Columnas de la tabla
  displayedColumns: string[] = ['id_receta', 'nombre_paciente','edad', 'estatura', 'peso', 'fecha', 'alergias', 'temperatura', 'dig', 'tratamiento', 't_a'];
  //Interfaz de los datos del historial clinico
  dataSource = new MatTableDataSource<Receta>();
  //id medico
  id_medico = '';

  //Constructor
  //
  //
  constructor(private authService: AuthService) {
    //obtiene el id del medico
    this.id_medico = this.authService.getId() + "";
  }

  //Referencia a los elementos de angular material
  //Paginador de la tabla
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //Sort de la tabla
  @ViewChild(MatSort) sort!: MatSort;

  //Una vez se carga toda la vista se ejecuta
  //
  //
  ngAfterViewInit() {
    //Paginador 
    this.dataSource.paginator = this.paginator;
    //Sort
    this.dataSource.sort = this.sort;
    this.sort.sort({ id: 'id_receta', start: 'desc', disableClear: false}); // Orden descendente por defecto
    //Se carga el historial
    this.informacion();
  }

  //Obtiene todo el registro clinico del paciente
  //
  //
  async informacion() {
    try {
      const response = await fetch('http://localhost/api/consultorio/getrecetasmedico?id_medico='+this.id_medico , {
        method: 'GET',
        credentials: 'include',
        headers: { 'Origin': window.location.origin }
      });

      //Se detiene la ejecucion a espera de respuesta
      var result = await response.json();
      //Coloca los datos en la tabla
      this.dataSource.data = result;

    } catch (error) {
      console.error('Error POST:', error);
    }
  }

  //Busqueda en la tabla esta funcion es la proporcionada en la documentacion de angular material
  //
  //
  applyFilter(event: Event) {
    //Obtiene el valor del input de busqueda en la tabla
    const filterValue = (event.target as HTMLInputElement).value;
    //Quita el texto en balnco al inicio y al final y lo pasa a minusculas
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
