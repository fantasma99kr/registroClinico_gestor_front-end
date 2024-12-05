import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioPacienteHomeComponent } from './inicio-paciente-home.component';

describe('InicioPacienteHomeComponent', () => {
  let component: InicioPacienteHomeComponent;
  let fixture: ComponentFixture<InicioPacienteHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioPacienteHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioPacienteHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
