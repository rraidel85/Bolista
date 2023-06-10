import { enableProdMode, importProvidersFrom, LOCALE_ID, ENVIRONMENT_INITIALIZER } from '@angular/core';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { IonicRouteStrategy, IonicModule } from '@ionic/angular';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { initializeFactory } from './app/utils/initializer';
import { InitializeAppService } from './app/services/initialize.app.service';
import { DbnameVersionService } from './app/services/dbname-version.service';
import { BolistaDbService } from './app/services/bolista-db.service';
import { SQLiteService } from './app/services/sqlite.service';
import localeEs from "@angular/common/locales/es";
import { registerLocaleData } from "@angular/common";

registerLocaleData(localeEs, "es");

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, IonicModule.forRoot()),
    provideRouter(APP_ROUTES),
    provideHttpClient(),
    SQLiteService,
    InitializeAppService,
    BolistaDbService,
    DbnameVersionService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: ENVIRONMENT_INITIALIZER,
      useFactory: initializeFactory,
      deps: [InitializeAppService],
      multi: true
    },
    { provide: LOCALE_ID, useValue: "es" }
  ],
}).catch((err) => console.log(err));
