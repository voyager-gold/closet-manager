import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  editMode: boolean;
  currentUserSubscription: Subscription;
  currentUser: User;

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private userService: UserService) {
    this.editMode = false;
    this.currentUser = new User();
  }

  ngOnInit() {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(
      user => {
        this.currentUser = user;
        console.log(this.currentUser);
      }
    )
  }

  checkSubmit(): boolean {
    return true;
  }

  /*
  Go back to the previous page.
  */
  back(): void {
    this.router.navigate(['/dashboard']);
  }

  /*
  Saves updated user into database.
  */
  save(): void {
    this.userService.update(this.currentUser).subscribe(
      (data: any) => {
        console.log(data);
        this.currentUser = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /*
  Toggle edit mode
  */
  toggleEditMode(): void {
    console.log(this.currentUser);
    this.editMode = !this.editMode;
  }


}
