import { Component } from '@angular/core';
import { ApplicationRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        RouterLink,
        RouterLinkActive,
    ],
})
export class AppComponent {
 
  public selectedPage!: string;
  
  constructor(private appRef: ApplicationRef) {
  }

  close() {
    // Close the application
    this.appRef.destroy();
  
  }
}