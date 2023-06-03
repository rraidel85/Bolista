import { Routes } from "@angular/router";
import { ListComponent } from "./list.component";
import { MessageListComponent } from "./feature/message-list/message-list.component";
import { ContactListComponent } from "./feature/contact-list/contact-list.component";

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
        component: MessageListComponent,
    }   
];