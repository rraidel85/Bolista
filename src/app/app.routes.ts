import {  Routes } from '@angular/router';
import { ListComponent } from './pages/lista/list.component';
import { ConfComponent } from './pages/conf/conf.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'Lista',
    pathMatch: 'full'
  },
  {
    path: 'Lista',
    component: ListComponent,
  },
  {
    path: 'Configuración',
    component: ConfComponent,
  }
  
];


