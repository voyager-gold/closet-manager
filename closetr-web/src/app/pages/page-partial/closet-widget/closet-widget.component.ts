import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ClosetService } from '../../../services/closet.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { Clothing } from '../../../models/clothing.model';
import { User } from '../../../models/user.model';
import { ClosetFactory } from '../../../factories/closet.factory';

@Component({
  selector: 'app-closet-widget',
  templateUrl: './closet-widget.component.html'
})
export class ClosetWidgetComponent implements OnInit {
  closetList: Array<Clothing>;
  currentUser: User;
  filterOptions: Array<string>;
  sortOptions: Array<string>;

  constructor(private closetService: ClosetService,
              private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUserValue;
    this.getAllClothes();

    ({
      filterOptions: this.filterOptions,
      sortOptions: this.sortOptions
    } = this.closetService);
  }

  getAllClothes = (): Observable<any> => ClosetFactory.getAllClothes(this);
}
