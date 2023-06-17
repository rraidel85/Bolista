import {  Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'lista',
    pathMatch: 'full'
  },
  {
    path: 'lista',
    loadComponent: () =>import('./pages/lista/list.component').then(c => c.ListComponent),
  },
  {
    path: 'lista/contactos',
    loadComponent: () =>import('./pages/lista/components/contact-list/contact-list.component').then(c => c.ContactListComponent),
  },
  {
    path: 'lista/contactos/:phone',
    loadComponent: () =>import('./pages/lista/components/sms-list/sms-list.component').then(c => c.SmsListComponent),
  },
  {
    path: 'lista/detalles',
    loadComponent: () =>import('./pages/lista/components/detail-option/detail-option.component').then(c => c.DetailOptionComponent),
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




