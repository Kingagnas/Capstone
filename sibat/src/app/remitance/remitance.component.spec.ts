import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemitanceComponent } from './remitance.component';

describe('RemitanceComponent', () => {
  let component: RemitanceComponent;
  let fixture: ComponentFixture<RemitanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemitanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemitanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
