import { Component, Input, OnInit } from '@angular/core';
import { StateManagerService } from 'src/app/services/state-manager.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  username: any;
  @Input() stateManager: any;
  constructor(private userService: UserService,
              private tokenService: TokenService) {

  }

  ngOnInit() {
    this.username = this.userService.getUser();
  }

  logout() {
    this.tokenService.deleteToken();
    window.location.reload();
  }

  changeView(view: string) {
    this.stateManager.setDashboardView(view);
  }
}
