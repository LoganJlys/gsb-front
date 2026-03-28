import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteursComponent } from './visiteurs.component';

describe('VisiteursComponent', () => {
  let component: VisiteursComponent;
  let fixture: ComponentFixture<VisiteursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisiteursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisiteursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
