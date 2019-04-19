import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IMWidgetComponent } from './imwidget.component';

describe('IMWidgetComponent', () => {
  let component: IMWidgetComponent;
  let fixture: ComponentFixture<IMWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IMWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IMWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
