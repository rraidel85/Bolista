import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';

import { ListComponent } from './pages/lista/list.component';
import { ConfComponent } from './pages/conf/conf.component';
import { WinnersComponent } from './pages/winners/winners.component';

import { DayCardComponent } from './pages/lista/components/day-card/day-card.component';
import { NightCardComponent } from './pages/lista/components/night-card/night-card.component';
import { PayModalComponent } from './pages/conf/components/pay-modal/pay-modal.component';
import { LimitModalComponent } from './pages/conf/components/limit-modal/limit-modal.component';

import { HoraPipe } from './pipes/hora.pipe';




@NgModule({
  declarations: [AppComponent, ListComponent,ConfComponent,WinnersComponent,DayCardComponent,NightCardComponent,PayModalComponent,LimitModalComponent, HoraPipe],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}

