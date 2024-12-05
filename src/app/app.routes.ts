import { Routes } from '@angular/router';
import { authGuard } from './servicios/guards/auth.guard';


//Bienvenida
import { InicioComponent } from './landing/inicio/inicio.component';
import { LoginComponent } from './landing/login/login.component';
import { RegistroComponent } from './landing/registro/registro.component';
import { InfoComponent } from './landing/info/info.component';

//Ruta no encontrada
import { PaginaNoEncontradaComponent } from './pagina-no-encontrada/pagina-no-encontrada.component';

//Paginas del medico
import { InicioMedicosComponent } from './medicos/inicio-medicos/inicio-medicos.component';
import { InicioMedicoHomeComponent } from './medicos/inicio-medico-home/inicio-medico-home.component';


//Paginas del paciente
import { InicioPacienteHomeComponent } from './pacientes/inicio-paciente-home/inicio-paciente-home.component';
import { InicioPacienteComponent } from './pacientes/inicio-paciente/inicio-paciente.component';
import { InicioGeneralComponent } from './landing/inicio-general/inicio-general.component';
import { HistorialClinicoComponent } from './pacientes/historial-clinico/historial-clinico.component';
import { NuevaCitaComponent } from './pacientes/nueva-cita/nueva-cita.component';
import { RecetasPacienteComponent } from './pacientes/recetas-paciente/recetas-paciente.component';
import { CitasComponent } from './pacientes/citas/citas.component';
import { ConsultorioComponent } from './medicos/consultorio/consultorio.component';
import { GestorCitasComponent } from './medicos/gestor-citas/gestor-citas.component';
import { RecetasPrescritasComponent } from './medicos/recetas-prescritas/recetas-prescritas.component';

//Rutas //canActivate: [authGuard]
export const routes: Routes = [
    {path: '', component:InicioComponent, canActivate: [authGuard],
        children:[
            {path:'', component:InicioGeneralComponent},
            {path:'info', component:InfoComponent},
            {path:'login', component:LoginComponent},
            {path:'registro', component:RegistroComponent},
        ]
    },//Medicos
    {path:'medico', component:InicioMedicosComponent, canActivate: [authGuard],
        children:[
            {path:'',component:InicioMedicoHomeComponent},
            {path:'consultorio', component:ConsultorioComponent},
            {path:'gestor-citas', component: GestorCitasComponent},
            {path:'recetas-prescritas', component:RecetasPrescritasComponent}
        ]
    },//Pacientes
    {
        path:'paciente', component:InicioPacienteComponent, canActivate: [authGuard],
        children:[
            {path:'', component:InicioPacienteHomeComponent},
            {path:'citas', component:CitasComponent},
            {path:'new-cita', component: NuevaCitaComponent},
            {path:'recetas', component: RecetasPacienteComponent},
            {path:'historial-clinico-paciente', component:HistorialClinicoComponent},
        ]
    },
    {//Pagina no encontrada
        path:'**', component:PaginaNoEncontradaComponent
    }
];
