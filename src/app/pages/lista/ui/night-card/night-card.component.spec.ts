import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NightCardComponent } from './night-card.component';

describe('NightCardComponent', () => {
  let component: NightCardComponent;
  let fixture: ComponentFixture<NightCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), NightCardComponent]
}).compileComponents();

    fixture = TestBed.createComponent(NightCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
