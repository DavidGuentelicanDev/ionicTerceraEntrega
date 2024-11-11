import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SedesPage } from './sedes.page';

describe('SedesPage', () => {
  let component: SedesPage;
  let fixture: ComponentFixture<SedesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SedesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
