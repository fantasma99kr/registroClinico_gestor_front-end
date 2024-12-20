import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioPacienteComponent } from './inicio-paciente.component';

describe('InicioPacienteComponent', () => {
  let component: InicioPacienteComponent;
  let fixture: ComponentFixture<InicioPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioPacienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
