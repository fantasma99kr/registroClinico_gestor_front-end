import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecetasPacienteComponent } from './recetas-paciente.component';

describe('RecetasPacienteComponent', () => {
  let component: RecetasPacienteComponent;
  let fixture: ComponentFixture<RecetasPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecetasPacienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecetasPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
