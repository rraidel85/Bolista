import {  Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'lista',
    pathMatch: 'full'
  },
  {
    path: 'lista',
    loadChildren: () =>import('./pages/lista/list.routes').then(m => m.LIST_ROUTES)
  },
  {
    path: 'configuracion',
    loadComponent: () =>import('./pages/conf/conf.component').then(c => c.ConfComponent)
  }
  
];


