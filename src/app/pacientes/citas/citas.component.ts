import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Citas } from '../../interface/citas';
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


//Anotacion de la configuracion del componente
@Component({
  selector: 'app-citas',
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
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.css'
})
export class CitasComponent implements AfterViewInit {
  //Columnas de la tabla
  displayedColumns: string[] = ['id_cita', 'nombre_consultorio', 'permiso_historial', 'horario', 'fecha', 'datos_adicionales', 'estado', 'tipo_cita'];
  //Interfaz de los datos del historial clinico
  dataSource = new MatTableDataSource<Citas>();
  //id paciente
  id_paciente = '';

  //Constructor
  //
  //
  constructor(private authService: AuthService) {
    this.id_paciente = this.authService.getId() + '';
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
    this.sort.sort({ id: 'id_cita', start: 'desc', disableClear: false}); // Orden descendente por defecto
    //Se carga el historial
    this.informacion();
  }

  //Obtiene todo el registro clinico del paciente
  //
  //
  async informacion() {
    try {
      const response = await fetch('http://localhost/api/consultorio/citaspaciente?id_paciente=' + this.id_paciente, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Origin': window.location.origin }
      });

      //Se detiene la ejecucion a espera de respuesta
      var result = await response.json();

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
