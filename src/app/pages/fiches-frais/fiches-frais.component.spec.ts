import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichesFraisComponent } from './fiches-frais.component';

describe('FichesFraisComponent', () => {
  let component: FichesFraisComponent;
  let fixture: ComponentFixture<FichesFraisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichesFraisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichesFraisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
