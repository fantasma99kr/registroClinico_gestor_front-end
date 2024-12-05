import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

//Modal de bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
//Date piker
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), 
    provideAnimationsAsync(),
    importProvidersFrom(
      ModalModule.forRoot(),
      BsDatepickerModule.forRoot()
  ) 
  ]
};
