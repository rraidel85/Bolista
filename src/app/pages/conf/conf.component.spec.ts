import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConfComponent } from './conf.component';

describe('ConfComponent', () => {
  let component: ConfComponent;
  let fixture: ComponentFixture<ConfComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), ConfComponent]
}).compileComponents();

    fixture = TestBed.createComponent(ConfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
