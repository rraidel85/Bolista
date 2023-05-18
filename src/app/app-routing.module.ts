import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ConfComponent } from './pages/conf/conf.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'Inicio',
    pathMatch: 'full'
  },
  {
    path: 'Inicio',
    component: InicioComponent,
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
