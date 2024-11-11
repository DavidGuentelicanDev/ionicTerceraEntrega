import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActualizacionDatosPage } from './actualizacion-datos.page';

describe('ActualizacionDatosPage', () => {
  let component: ActualizacionDatosPage;
  let fixture: ComponentFixture<ActualizacionDatosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualizacionDatosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
