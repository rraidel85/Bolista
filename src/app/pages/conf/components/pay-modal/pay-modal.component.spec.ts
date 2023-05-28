import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PayModalComponent } from './pay-modal.component';

describe('PayModalComponent', () => {
  let component: PayModalComponent;
  let fixture: ComponentFixture<PayModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), PayModalComponent]
}).compileComponents();

    fixture = TestBed.createComponent(PayModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
