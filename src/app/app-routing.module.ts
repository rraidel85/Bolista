import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ListComponent } from './pages/lista/list.component';
import { ConfComponent } from './pages/conf/conf.component';
import { WinnersComponent } from './pages/winners/winners.component';
import { DetailOptionComponent } from './pages/lista/components/detail-option/detail-option.component';

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
    path: 'Ganadores',
    component: WinnersComponent,
  },
  {
    path: 'Configuración',
    component: ConfComponent,
  },
  {
    path: 'Lista/Detalles',
    component: DetailOptionComponent,
  }
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
