import { Component } from '@angular/core';
import { ApplicationRef } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
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