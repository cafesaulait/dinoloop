import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lignes } from './lignes';

describe('Lignes', () => {
  let component: Lignes;
  let fixture: ComponentFixture<Lignes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lignes],
    }).compileComponents();

    fixture = TestBed.createComponent(Lignes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
