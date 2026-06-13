import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripsMyComponent } from './trips-my';

describe('TripsMyComponent', () => {
  let component: TripsMyComponent;
  let fixture: ComponentFixture<TripsMyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripsMyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TripsMyComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
