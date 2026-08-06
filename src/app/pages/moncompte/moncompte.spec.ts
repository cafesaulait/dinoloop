import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Moncompte } from './moncompte';

describe('Moncompte', () => {
  let component: Moncompte;
  let fixture: ComponentFixture<Moncompte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Moncompte],
    }).compileComponents();

    fixture = TestBed.createComponent(Moncompte);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
