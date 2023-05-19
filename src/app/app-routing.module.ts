import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ListComponent } from './pages/lista/list.component';
import { ConfComponent } from './pages/conf/conf.component';

const routes: Routes = [
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

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
