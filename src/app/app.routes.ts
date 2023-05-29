import {  Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'Lista',
    pathMatch: 'full'
  },
  {
    path: 'Lista',
    loadChildren: () =>import('./pages//lista/list.routes').then(m => m.LIST_ROUTES)
  },
  {
    path: 'Configuración',
    loadComponent: () =>import('./pages/conf/conf.component').then(c => c.ConfComponent)
  }
  
];


