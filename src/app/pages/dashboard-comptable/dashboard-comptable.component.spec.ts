import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComptableComponent } from './dashboard-comptable.component';

describe('DashboardComptableComponent', () => {
  let component: DashboardComptableComponent;
  let fixture: ComponentFixture<DashboardComptableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComptableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComptableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
