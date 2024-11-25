import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCardsHomeComponent } from './admin-cards-home.component';

describe('AdminCardsHomeComponent', () => {
  let component: AdminCardsHomeComponent;
  let fixture: ComponentFixture<AdminCardsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCardsHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCardsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
