import { enableProdMode, importProvidersFrom, LOCALE_ID, ENVIRONMENT_INITIALIZER, APP_INITIALIZER } from '@angular/core';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import { BrowserModule, HAMMER_GESTURE_CONFIG, bootstrapApplication } from '@angular/platform-browser';
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
import { IonicGestureConfig } from './app/utils/IonicGestureConfig';

registerLocaleData(localeEs, "es");
import 'hammerjs';

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
    { provide: APP_INITIALIZER,
      useFactory: initializeFactory,
      deps: [InitializeAppService],
      multi: true
    },
    { provide: LOCALE_ID, useValue: "es" },
    {provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig}
  ],
}).catch((err) => console.log(err));
