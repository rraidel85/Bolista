import { enableProdMode, importProvidersFrom } from '@angular/core';


import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { IonicRouteStrategy, IonicModule } from '@ionic/angular';
import { RouteReuseStrategy, provideRouter } from '@angular/router';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        importProvidersFrom(BrowserModule, IonicModule.forRoot()),
        provideRouter(APP_ROUTES)
    ]
})
  .catch(err => console.log(err));
