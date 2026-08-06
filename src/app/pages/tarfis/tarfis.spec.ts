import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tarfis } from './tarfis';

describe('Tarfis', () => {
  let component: Tarfis;
  let fixture: ComponentFixture<Tarfis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tarfis],
    }).compileComponents();

    fixture = TestBed.createComponent(Tarfis);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
