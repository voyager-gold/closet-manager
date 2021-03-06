import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../../shared/shared.module';
import { ClosetService } from '../../../services/closet.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { ClothingFormComponent } from '../clothing-form/clothing-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EditClothingComponent } from './edit-clothing.component';
import {
  MockClosetManageComponent,
  MockClothingFormComponent
} from '../../../../test/components';
import {
  mockClothingOne,
  mockUserOne,
  mockClothingEmpty
} from '../../../../test/objects';
import {
  ClosetServiceMock
} from '../../../../test/services';
import {
  inputDispatch
} from '../../../../test/utils';

const clothingForEdit = mockClothingOne;
const currentUser = mockUserOne;

describe('EditClothingComponent', () => {
  let component: EditClothingComponent;
  let fixture: ComponentFixture<EditClothingComponent>;
  let closetService: ClosetServiceMock;
  let router;

  const routes = [
    { path: 'closet-manage', component: MockClosetManageComponent }
  ];

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
        SharedModule
      ],
      declarations: [
        ClothingFormComponent,
        EditClothingComponent,
        MockClosetManageComponent
      ],
      providers: [
        EditClothingComponent,
        { provide: ClosetService, useClass: ClosetServiceMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClothingComponent);
    component = fixture.debugElement.componentInstance;
    router = TestBed.get(Router);
    closetService = TestBed.get(ClosetService);
    spyOn(router, 'navigate');
    spyOn(closetService, 'getClothingForEdit').and.callThrough();
    spyOn(closetService, 'editClothing').and.callThrough();
    spyOn(component, 'save').and.callThrough();
    spyOn(component, 'back').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should navigate to closet manage component when
    back function is called`, () => {
    component.ngOnInit();
    component.back();
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/closet-manage']);
  });

  describe(`when the save function is called,`, () => {
    beforeEach(() => {
      component.clothing = clothingForEdit;
      component.save();
      fixture.detectChanges();
    });
    it(`should call closetService's editClothing method with
      the clothing for edit.`, () => {
      expect(closetService.editClothing).toHaveBeenCalledWith(clothingForEdit);
    });
    it(`should call the back function.`, () => {
      expect(component.back).toHaveBeenCalled();
    });
  });
  describe(`from the init method,`, () => {
    describe(`if there is a clothing for edit,`, () => {
      beforeEach(() => {
        component.ngOnInit();
        fixture.detectChanges();
      });
      it(`should set the clothing variable with the returned data
        (if it exists).`, () => {
        expect(closetService.getClothingForEdit).toHaveBeenCalled();
        expect(component.clothing).toEqual(clothingForEdit);
      });
    });
    describe(`if there is no clothing for edit,`, () => {
      beforeEach(() => {
        closetService.getClothingForEdit = () => { return null };
        spyOn(closetService, 'getClothingForEdit').and.callThrough();
        component.ngOnInit();
        fixture.detectChanges();
      });
      it(`should call closetService's getClothingForEdit method.`, () => {
        expect(closetService.getClothingForEdit).toHaveBeenCalled();
      });
      it(`should navigate to closet manage page.`, () => {
        expect(router.navigate).toHaveBeenCalledWith(['/closet-manage']);
      });
    });

  });
});
