import { Component, Input, OnInit } from '@angular/core';
import { PROJECT_TYPES } from 'src/app/constants';
import { RpcService } from 'src/app/services/rpc.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  projectTypes = PROJECT_TYPES;
  @Input() type: PROJECT_TYPES = this.projectTypes.INVITATION;
  @Input() project: any;
  user: any;

  constructor(private userService: UserService,
              private rpcService: RpcService) {}

  ngOnInit() {
    this.user = this.userService.getUser(); 
  }

  leaveProject(id: any) {
    
  }

  openInviteModal() {

  }
}
