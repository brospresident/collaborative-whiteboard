import { Component, OnInit, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { RpcService } from 'src/app/services/rpc.service';
import { StateManagerService } from 'src/app/services/state-manager.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PROJECT_TYPES } from 'src/app/constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnChanges {
  view: any;
  closeResult = '';
  project_name = '';
  userProjects: any[] = [];
  loading: boolean = true;
  projectType!: PROJECT_TYPES;
  userInvitations: any[] = [];

  constructor(private userService: UserService,
              private tokenService: TokenService,
              private rpcService: RpcService,
              public stateManager: StateManagerService,
              private modalService: NgbModal,
              private router: Router) {}

  ngOnInit(): void {
    let that = this;
    this.rpcService.ask('users.getUserProjects', {username: that.userService.getUser()}, (error: any, result: any) => {
      if (error) {
        console.log('eroare la get projects', error);
        return;
      }

      let projectIds = result.result;

      console.log('projectIds', projectIds);

      that.rpcService.ask('projects.get_projects_data', {projectIds: projectIds}, (err: any, res: any) => {
        if (res.error) {
          console.log(res.error);
          return
        }

        that.userProjects = res.result;
        console.log(that.userProjects);

        that.rpcService.ask('users.getUserInvitations', {username: that.userService.getUser()}, (error: any, result: any) => {
          if (error || result.error) {
            console.log('eroare la get invitations', error);
            return;
          }

          let invitationsIds = result.result;
          console.log('invids', invitationsIds);
  
          that.rpcService.ask('projects.get_projects_data', {projectIds: invitationsIds}, (err: any, res: any) => {
            if (res.error) {
              console.log(res.error);
              // return
            } 
    
            if (res.result) {
              that.userInvitations = res.result;
            } else {
              that.userInvitations = [];
            }

            console.log(that.userInvitations);
    
            if (that.stateManager.getDashboardView() == 'projects') {
              that.projectType = PROJECT_TYPES.PROJECT;
            } else {
              that.projectType = PROJECT_TYPES.INVITATION;
            }
          });
        });
      });
    });
  }

  ngOnChanges() {

  }

  open(content: any) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}

  clickSave() {
    // this.modalService.dismissAll('Saved');
    // let project_id = (Math.random() * 10); // Provizoriu
    // this.router.navigate(['/canvas'], { queryParams: { project_id: project_id }, queryParamsHandling: 'merge' })
    // TODO: Logica de salvare in db.

    let that = this;
    this.rpcService.ask('projects.add_project', {createdBy: this.userService.getUser(), name: this.project_name}, (error: any, result: any) => {
      if (result.error || error) {
        console.log(result.error);
        return;
      }

      that.modalService.dismissAll();
      that.ngOnInit();
    });
  }
}
