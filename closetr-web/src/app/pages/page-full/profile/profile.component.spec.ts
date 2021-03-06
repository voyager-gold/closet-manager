import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '../../../shared/shared.module';
import { AuthenticationService } from '../../../services/authentication.service';
import { UserService } from '../../../services/user.service';
import { ProfileComponent } from './profile.component';
import {
  MockDashboardComponent
} from '../../../../test/components';
import {
  mockUserOne,
  mockUserTwo,
} from '../../../../test/objects';
import {
  AuthenticationServiceMock,
  UserServiceMock
} from '../../../../test/services';
import {
  multTestCompare,
  clickBackAndTestNavigate
} from '../../../../test/utils';
import {
  toggleEditModeShouldToggle
} from '../../../../test/common-tests';

const currentUser = mockUserOne;
const updatedUser = mockUserTwo;

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userService: UserServiceMock;
  let authenticationService: AuthenticationServiceMock;
  let router: Router;
  let hostElement;
  let saveButton;
  let editButton;
  let usernameInput: HTMLInputElement;
  let nameInput: HTMLInputElement;
  let descriptionInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;

  const routes = [
    { path: 'dashboard', component: MockDashboardComponent }
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
        MockDashboardComponent,
        ProfileComponent
      ],
      providers: [
        ProfileComponent,
        { provide: UserService, useClass: UserServiceMock },
        { provide: AuthenticationService, useClass: AuthenticationServiceMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    hostElement = fixture.nativeElement;
    userService = TestBed.get(UserService);
    authenticationService = TestBed.get(AuthenticationService);
    router = TestBed.get(Router);
    spyOn(component, 'toggleEditMode').and.callThrough();
    spyOn(component, 'save').and.callThrough();
    spyOn(router, 'navigate').and.callThrough();
    spyOn(userService, 'update').and.callThrough();
    spyOn(localStorage, 'setItem').and.callThrough();
    fixture.detectChanges();
    saveButton = hostElement.querySelector('#save-button button');
    editButton = hostElement.querySelector('#edit-button button');
    usernameInput = hostElement.querySelector('#username-input input');
    nameInput = hostElement.querySelector('#name-input input');
    descriptionInput = hostElement.querySelector('#description-input textarea');
    passwordInput = hostElement.querySelector('#password-input input');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should navigate to dashboard component when
    back button is clicked`, () => {
    clickBackAndTestNavigate(hostElement, router, '/dashboard', fixture);
  });

  describe(`from the init method`, () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    })
    it(`should retrieve the current user from
      authentication service.`, () => {
      expect(component.currentUser).toEqual(currentUser);
    });
    it(`should have editMode as false initially.`, () => {
      expect(component.editMode).toBeFalsy();
    });
    it(`should populate the form fields properly.`, () => {
      fixture.whenStable().then(() => {
        expect(usernameInput.value).toEqual(currentUser.userID);
        expect(nameInput.value).toEqual(currentUser.userName);
        expect(descriptionInput.value).toEqual(currentUser.userDesc);
        expect(passwordInput.value).toEqual(currentUser.userPassword);
      });
    });
    it(`should have all fields disabled.`, () => {
      fixture.whenStable().then(() => {
        multTestCompare([
          usernameInput,
          nameInput,
          descriptionInput,
          passwordInput
        ], 'disabled', true);
      });
    });
    it(`should hide the save button`, () => {
      expect(saveButton.hidden).toBeTruthy();
    });
  });

  describe(`when edit button is clicked`, () => {
    beforeEach(() => {
      component.ngOnInit();
      editButton.click();
      fixture.detectChanges();
    });
    it(`should call toggleEditMode method, and change the
      editMode variable (multiple toggles).`, () => {
      toggleEditModeShouldToggle(component, fixture, editButton);
    });
    it(`should hide the save button when
      editMode is false.`, () => {
      expect(saveButton.hidden).toBeFalsy();
      editButton.click();
      fixture.detectChanges();
      expect(saveButton.hidden).toBeTruthy();
    });

    const fixtureStableInputTest = (inputs, property, result) => {
      fixture.whenStable().then(() => {
        multTestCompare(inputs, property, result);
      });
    };

    it(`should enable the name and description
      fields.`, () => {
      fixtureStableInputTest([nameInput, descriptionInput], 'disabled', false);
    });
    it(`should keep the username and password
      fields disabled.`, () => {
      fixtureStableInputTest([usernameInput, passwordInput], 'disabled', true);
    });
  });

  describe(`when the save button is clicked`, () => {
    beforeEach(() => {
      component.ngOnInit();
      editButton.click();
      saveButton.click();
      fixture.detectChanges();
    });
    it(`should call the save method`, () => {
      expect(component.save).toHaveBeenCalled();
    });
    it(`should call the userService's update method
      with the current user variable.`, () => {
      expect(userService.update).toHaveBeenCalledWith(currentUser);
    });
    it(`should set the currentUser variable, and
      the local storage user equal to the data
      returned (when user is edited).`, () => {
      expect(component.currentUser).toEqual(updatedUser);
      expect(localStorage.setItem).toHaveBeenCalled();
    });
    it(`should call toggleEditMode after data
      is recieved`, () => {
      expect(component.toggleEditMode).toHaveBeenCalledTimes(2);
    });
  });



});
