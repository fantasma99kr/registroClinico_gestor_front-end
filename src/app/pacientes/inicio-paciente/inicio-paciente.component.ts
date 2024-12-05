import { Component } from '@angular/core';
import { AuthService } from './../../servicios/auth/auth.service';
import { RouterLink, RouterOutlet, RouterLinkActive, Router } from '@angular/router';

//Componentes de la lubreria Angular material
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';

//Anotacion de la configuracion del componente
@Component({
  selector: 'app-inicio-paciente',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './inicio-paciente.component.html',
  styleUrl: './inicio-paciente.component.css'
})

//Clase del componente
export class InicioPacienteComponent {

  public constructor(private authService: AuthService, private router: Router){}

  logout(){
    this.authService.logout();
    this.router.navigate(['']);
  }

}
