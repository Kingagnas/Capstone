import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllErrandsComponent } from './all-errands.component';

describe('AllErrandsComponent', () => {
  let component: AllErrandsComponent;
  let fixture: ComponentFixture<AllErrandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllErrandsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllErrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
