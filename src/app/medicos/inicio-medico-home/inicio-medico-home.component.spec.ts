import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioMedicoHomeComponent } from './inicio-medico-home.component';

describe('InicioMedicoHomeComponent', () => {
  let component: InicioMedicoHomeComponent;
  let fixture: ComponentFixture<InicioMedicoHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioMedicoHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioMedicoHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
