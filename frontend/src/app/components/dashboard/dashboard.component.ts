import { Component, OnInit, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { RpcService } from 'src/app/services/rpc.service';
import { StateManagerService } from 'src/app/services/state-manager.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnChanges {
  view: any;
  closeResult = '';
  project_name = '';
  constructor(private userService: UserService,
              private tokenService: TokenService,
              private rpcService: RpcService,
              public stateManager: StateManagerService,
              private modalService: NgbModal,
              private router: Router) {}

  ngOnInit(): void {
    
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

  // generateProjectId() {
  //   return randomBytes(16).toString("hex").slice(0, 7);
  // }

  clickSave() {
    this.modalService.dismissAll('Saved');
    let project_id = (Math.random() * 10); // Provizoriu
    this.router.navigate(['/canvas'], { queryParams: { project_id: project_id }, queryParamsHandling: 'merge' })
    // TODO: Logica de salvare in db.
  }
}
