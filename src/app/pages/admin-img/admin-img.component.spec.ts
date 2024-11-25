import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminImgComponent } from './admin-img.component';

describe('AdminImgComponent', () => {
  let component: AdminImgComponent;
  let fixture: ComponentFixture<AdminImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminImgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
