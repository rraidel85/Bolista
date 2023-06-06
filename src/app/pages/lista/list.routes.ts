import { Routes } from '@angular/router';
import { ListComponent } from './list.component';
import { ContactListComponent } from './components/contact-list/contact-list.component';
import { SmsListComponent } from './components/sms-list/sms-list.component';
import { DetailOptionComponent } from './components/detail-option/detail-option.component';

export const LIST_ROUTES: Routes = [
  {
    path: '',
    component: ListComponent,
  },
  {
    path: 'contactos',
    component: ContactListComponent,
  },
  {
    path: 'contactos/:phone',
    component: SmsListComponent,
  },
  {
    path: 'detalles',
    component: DetailOptionComponent,
  },
];
