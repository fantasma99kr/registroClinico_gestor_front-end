import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioMedicosComponent } from './inicio-medicos.component';

describe('InicioMedicosComponent', () => {
  let component: InicioMedicosComponent;
  let fixture: ComponentFixture<InicioMedicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioMedicosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioMedicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
