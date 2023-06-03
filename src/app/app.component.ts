import { Component } from '@angular/core';
import { ApplicationRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
 
  public selectedPage!: string;
  public horaActual!: string;
  
  constructor(private appRef: ApplicationRef, private http:HttpClient) {

  }


  close() {
    // Close the application
    this.appRef.destroy();
  
  }
}