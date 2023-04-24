import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PROJECT_TYPES } from 'src/app/constants';
import { EmiterService } from 'src/app/services/emiter.service';
import { ModalServiceService } from 'src/app/services/modal-service.service';
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

  invited_username: any;


  constructor(private userService: UserService,
              private rpcService: RpcService,
              private ngModalService: NgbModal,
              private router: Router) {
  }

  ngOnInit() {
    this.user = this.userService.getUser(); 
    console.log(this.user);
  }

  leaveProject(id: any, event: any) {
    if (event) {
      event.preventDefault();
    }

    let params = {
      project_id: this.project.projectId,
      username: this.user
    };

    this.rpcService.ask('users.leave_project', params, (error: any, result: any) => {
      if (error || result.error) {
        console.log(error || result.error);
        return;
      }

      window.location.reload();
    });
  }

  open(content: any, event: any) {
    if (event) {
      event.preventDefault();
    }

    this.ngModalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
			},
			(reason) => {
			},
		);
  }

  closeInvite() {
    this.ngModalService.dismissAll();
  }

  sendInvitation() {
    let params = {
      invited_by: this.user,
      invited_username: this.invited_username,
      project_id: this.project.projectId
    };

    console.log(params);

    this.rpcService.ask('users.send_invitation', params, (error: any, response: any) => {
      this.ngModalService.dismissAll();
    });
  }

  acceptInvite(event: any) {
    let that = this;
    if (event) {
      event.preventDefault();
    }

    let params = {
      username: this.user,
      projectId: this.project.projectId
    }

    this.rpcService.ask('users.accept_invite', params, (error: any, response: any) => {
      if (error || response.error) {
        console.log(error || response.error);
        return;
      }
      console.log('trece de if')
      this.router.navigateByUrl('/dashboard');
    });
  }

  rejectInvite(event: any) {
    if (event) {
      event.preventDefault();
    }

    let params = {
      username: this.user,
      projectId: this.project.projectId
    }

    this.rpcService.ask('users.reject_invite', params, (error: any, response: any) => {
      if (error || response.error) {
        console.log(error || response.error);
        return;
      }

      console.log('trece de if');

      this.router.navigateByUrl('/dashboard');

      window.location.reload();
    });
  }
}
