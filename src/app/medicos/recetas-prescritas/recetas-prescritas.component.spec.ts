import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecetasPrescritasComponent } from './recetas-prescritas.component';

describe('RecetasPrescritasComponent', () => {
  let component: RecetasPrescritasComponent;
  let fixture: ComponentFixture<RecetasPrescritasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecetasPrescritasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecetasPrescritasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
