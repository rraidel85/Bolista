import {  Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'Lista',
    pathMatch: 'full'
  },
  {
    path: 'Lista',
    loadComponent: () =>import('./pages/lista/list.component').then(c => c.ListComponent)
  },
  {
    path: 'Configuración',
    loadComponent: () =>import('./pages/conf/conf.component').then(c => c.ConfComponent)
  }
  
];


