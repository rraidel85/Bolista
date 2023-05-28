import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DayCardComponent } from './day-card.component';

describe('DayCardComponent', () => {
  let component: DayCardComponent;
  let fixture: ComponentFixture<DayCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), DayCardComponent]
}).compileComponents();

    fixture = TestBed.createComponent(DayCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
