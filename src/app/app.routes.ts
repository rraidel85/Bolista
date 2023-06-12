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
  },
  {
    path: 'ganadores',
    loadComponent: () =>import('./pages/winners/winners.component').then(c => c.WinnersComponent)
  },
  {
    path: 'acerca de',
    loadComponent: () =>import('./pages/about/about.component').then(c => c.AboutComponent)
  }
];


