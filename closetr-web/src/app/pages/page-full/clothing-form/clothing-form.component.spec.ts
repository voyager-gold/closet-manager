import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ClothingFormComponent } from './clothing-form.component';
import {
  mockClothingOne,
  mockClothingEmpty
} from '../../../../test/objects';
import {
  multInputDispatchAndChange,
  inputDispatch
} from '../../../../test/utils';

describe('ClothingFormComponent', () => {
  let component: ClothingFormComponent;
  let fixture: ComponentFixture<ClothingFormComponent>;
  let hostElement;
  let saveButton;
  let nameInput: HTMLInputElement;
  let costInput: HTMLInputElement;
  let categoryInput: HTMLInputElement;
  let wornInput: HTMLInputElement;
  let purchaseDateInput: HTMLInputElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        SharedModule
      ],
      declarations: [ ClothingFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClothingFormComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    hostElement = fixture.nativeElement;
    saveButton = hostElement.querySelector('#save-button button');
    nameInput = hostElement.querySelector('#name-input input');
    costInput = hostElement.querySelector('#cost-input input')
    categoryInput = hostElement.querySelector('#category-input select');
    wornInput = hostElement.querySelector('#worn-input input');
    purchaseDateInput = hostElement.querySelector('#purchase-date-input input');
    spyOn(component.save, 'emit').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe(`the save button`, () => {
    beforeEach(() => {
      saveButton = hostElement.querySelector('#save-button button');
      component.clothing = mockClothingEmpty;
    });
    describe(`should be disabled when`, () => {
      describe(`clothing name field is filled,`, () => {
        beforeEach(() => {
          inputDispatch(nameInput, 'name');
          fixture.detectChanges();
        });
        it(`and all else is empty`, () => {});
        describe(`and clothing worn field is filled,`, () => {
          beforeEach(() => {
            inputDispatch(wornInput, '0');
            fixture.detectChanges();
          });
          it(`and all else is empty`, () => {});
          it(`and clothing cost field is filled, and all else is empty.`, () => {
            inputDispatch(costInput, '0');
            fixture.detectChanges();
          });
        });
        afterEach(() => {
          expect(saveButton.disabled).toBeTruthy();
        })
      });
    });
    describe(`when all fields are filled,`, () => {
      beforeEach(() => {
        multInputDispatchAndChange([
          { input: nameInput, value: 't-shirt' },
          { input: costInput, value: 10 },
          { input: categoryInput, value: 'Top' },
          { input: wornInput, value: 10 },
          { input: purchaseDateInput, value: '2019-02-02' }
        ], fixture);
      });
      it(`should be enabled when all fields are filled.`, () => {
        expect(saveButton.disabled).toBeFalsy();
      });
      it(`when clicked, should call the save function.`, () => {
        saveButton.click();
        fixture.detectChanges();
        expect(component.save.emit).toHaveBeenCalled();
      });
    });
  });

});
