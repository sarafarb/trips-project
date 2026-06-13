import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripsAll } from './trips-all';

describe('TripsAll', () => {
  let component: TripsAll;
  let fixture: ComponentFixture<TripsAll>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripsAll],
    }).compileComponents();

    fixture = TestBed.createComponent(TripsAll);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
