import { AfterViewInit, Component, ViewChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { HistorialClinico } from '../../interface/historial-clinico';
import { AuthService } from '../../servicios/auth/auth.service';

//Componentes de angular material
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

//Servicios
import { FuncionesValidate } from '../../servicios/funciones-validate.service';

//Anotacion de la configuracion del componente
@Component({
  selector: 'app-historial-clinico',
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
  templateUrl: './historial-clinico.component.html',
  styleUrl: './historial-clinico.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

//Clase del componente
export class HistorialClinicoComponent implements AfterViewInit {
  //Columnas de la tabla
  displayedColumns: string[] = ['id_historial', 'titulo', 'descripcion', 'imagen', 'documento', 'editar', 'eliminar'];
  //Interfaz de los datos del historial clinico
  dataSource = new MatTableDataSource<HistorialClinico>();
  //Modal
  modalRef!: BsModalRef;
  //Imagen model
  imagenModal: string = "";
  //Numero del registro
  numRH: string = "";
  //Nombre del registro
  nomRH: string = "";
  //Descripcion
  descripcionUp: string = "";
  //Id hisotirial para actualizar
  id_historialUp: string = "";
  //id paciente
  id_paciente = '';

  //Constructor
  constructor(private snackBar: MatSnackBar, private modalService: BsModalService, private authService: AuthService, private valf: FuncionesValidate) {
    //Obtiene el id del paciente
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
    this.sort.sort({ id: 'id_historial', start: 'desc', disableClear: false}); // Orden descendente por defecto
    //Se carga el historial
    this.informacion();

    //Quita el texto base64 al buscar en la tabla
    this.dataSource.filterPredicate = (data: HistorialClinico, filter: string) => { 
      var transformedFilter = filter.trim().toLowerCase();
      //Buscara en base a los siguientes campos
      return data.id_historial.toString().includes(transformedFilter) || 
            data.titulo.toLowerCase().includes(transformedFilter) || 
            data.descripcion.toLowerCase().includes(transformedFilter) || 
            data.documento.toLowerCase().includes(transformedFilter);
    }
  }

  //Obtiene todo el registro clinico del paciente
  //
  //
  async informacion() {
    try {
      const response = await fetch('http://localhost/api/historial/getinfo?id_paciente=' + this.id_paciente, {
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

  //Abre el modal y cambia la imagen del modal
  //
  //
  openModal(template: TemplateRef<any>, id_historial: string, titulo: string, imagen: string) {
    //Datos que se mostraran en el modal
    this.numRH = id_historial;
    this.nomRH = titulo;
    this.imagenModal = "data:image/png;base64," + imagen;
    //Abre el modal
    this.modalRef = this.modalService.show(template, { class: 'modal-xl' });//se le agrega la clase modal xl para hacer el modal grande
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

  //Registro del historial
  //
  //
  async registro(event: Event, titulo: string, descripcion: string) {
    //Evita que se actualice la pagina
    event.preventDefault();

    //Valida que al menos se coloque el nombre y descripcion
    if (!this.valf.empty(titulo) && !this.valf.empty(descripcion)) {
      //Se crea el form data para mandar los parametros
      var formData = new FormData();
      formData.append('id_paciente', this.id_paciente);
      formData.append('titulo', titulo);
      formData.append('descripcion', descripcion);

      //Se obtiene el contenido del input del pdf
      var pdfInput = document.getElementById('pdf') as HTMLInputElement;
      var pdfFiles = pdfInput.files;

      //Se obtiene el contenido del input de la imagen
      var imageInput = document.getElementById('image') as HTMLInputElement;
      var imageFiles = imageInput.files;

      //Verificar si se seleccionó un archivo PDF y agregarlo al FormData
      if (pdfFiles && pdfFiles.length > 0) {
        formData.append('pdf', pdfFiles[0], pdfFiles[0].name);
      }
      // Verificar si se seleccionó una imagen y agregarla al FormData
      if (imageFiles && imageFiles.length > 0) {
        formData.append('image', imageFiles[0], imageFiles[0].name);
      }

      //Manda los datos del historial clinico
      try {
        //registro
        var response = await fetch('http://localhost/api/historial/save', {
          method: 'POST',
          body: formData,
          credentials: 'include',
          headers: { 'Origin': window.location.origin }
        });

        //Se detiene la ejecucion a espera de respuesta
        const result = await response.json();
        //Verifica que el registro del historial se registrara correctamente
        if (response.status == 201) {
          this.valf.limpiarInputs();
          this.informacion();
          this.alerta(result.message);
        } else {
          this.alerta(result.message);
        }
      } catch (error) {
        console.error('Error POST:', error);
      }
    } else {
      this.alerta("Se debe al menos llenar el campo de nombre y descripción");
    }
  }

  //Funcion para eliminar registros
  //
  //
  async eliminar(id_historial: string) {
    try {
      //Se crea un objeto formdata para mandar los datos
      var formData: FormData = new FormData();
      formData.append('id_historial', id_historial)

      //Consumo a la api
      const response = await fetch('http://localhost/api/historial/delete', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: { 'Origin': window.location.origin }
      });

      //Se detiene la ejecucion a espera de respuesta
      var result = await response.json();

      //Valida que la respuesta sea correcta al eliminar el registro
      if (response.status == 200) {
        this.informacion();
        this.alerta(result.message);
      } else {//Muestra que salio mal
        this.alerta(result.message);
      }

    } catch (error) {
      console.error('Error POST:', error);
    }
  }

  //Actualizar un registro
  //Actualiza la variable id_historialUp para poder indicar que historial se actualizara
  //
  modalEditar(updateModal: TemplateRef<any>, id_historial: string, titulo: string, descripcion: string){
    //Datos que se mostraran en el modal
    this.numRH = id_historial;
    this.nomRH = titulo;
    this.descripcionUp = descripcion;
    this.id_historialUp = id_historial;
    //Abre el modal
    this.modalRef = this.modalService.show(updateModal, { class: 'modal-xl' });//se le agrega la clase modal xl para hacer el modal grande
  }


  //if (this.modalRef) { this.modalRef.hide(); }


  //Actualizar un registro de historial
  //El editar no permite eliminar el documento solo se podra remplazar
  //
  async update(event: Event,titulo: string, descripcion: string){
    //Evita que se actualice la pagina
    event.preventDefault();
    
    //Valida que al menos se editara el titulo y la descripcion
    if (!this.valf.empty(titulo) && !this.valf.empty(descripcion)){

      //Se crea el objeto formdata para mandar los parametros
      var formData = new FormData();
      formData.append('id_historial', this.id_historialUp);
      formData.append('titulo', titulo);
      formData.append('descripcion', descripcion);

      //Se obtiene el contenido del input del pdf
      var pdfInput = document.getElementById('pdfUpdate') as HTMLInputElement;
      var pdfFiles = pdfInput.files;

      //Se obtiene el contenido del input de la imagen
      var imageInput = document.getElementById('imageUpdate') as HTMLInputElement;
      var imageFiles = imageInput.files;

      //Verificar si se seleccionó un archivo PDF y agregarlo al FormData
      if (pdfFiles && pdfFiles.length > 0) {
        formData.append('pdf', pdfFiles[0], pdfFiles[0].name);
      }
      // Verificar si se seleccionó una imagen y agregarla al FormData
      if (imageFiles && imageFiles.length > 0) {
        formData.append('image', imageFiles[0], imageFiles[0].name);
      }

      //Manda los datos del historial clinico
      try {
        //Actualizacion del registro
        var response = await fetch('http://localhost/api/historial/update', {
          method: 'POST',
          body: formData,
          credentials: 'include',
          headers: { 'Origin': window.location.origin }
        });

        //Se obtiene el resultado
        var result = await response.json();
        //Verifica que el registro del historial se actualice correctamente
        if (response.status == 201) {
          this.modalRef.hide()
          this.informacion();
          this.alerta(result.message);
        } else {
          this.alerta(result.message);
        }
      } catch (error) {
        console.error('Error POST:', error);
      }

    } else {
      this.alerta("Se debe al menos llenar el campo de nombre y descripción");
    }
  }

  //Descarga del documento
  //
  //
  async documento(event: Event,documento: string) {
    //Evita que se actualice la pagina
    event.preventDefault();
    try {
      const response = await fetch('http://localhost/api/historial/documento?documento=' + documento, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Origin': window.location.origin }
      });//Peticion fetch

      //Se detiene la ejecucion a espera de respuesta
      this.dataSource.data = result;
      
      if(response.ok){
        //Si la respuesta es correcta se obtiuene el blob del archivo
        var blob = await response.blob();
        //Se abre una ventana con el pdf
        window.open(URL.createObjectURL(blob), '_blank');
        
      } else {
        //Si la respuesta es diferente se obtiene la respuesta y se muestra el mensaje
        var result = await response.json();
        this.alerta(result.message)
      }

    } catch (error) {
      console.error('Error POST:', error);
    }
    this.informacion();
  }

  //Funcion para mandar la alertas con el snackbar de angular material
  //
  //
  alerta(mensaje: string) {
    //Muestra la alerta
    this.snackBar.open(mensaje, 'x', {
      duration: 7000,
      panelClass: 'custom-snackbar'
    });
  }
}
