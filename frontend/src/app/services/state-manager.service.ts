import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateManagerService {
  state: any = {
    dashboard: {
      view: 'projects'
    }
  }

  public observer: Subject<any> = new Subject<any>;

  constructor() { }

  public getDashboardView() {
    return this.state.dashboard.view;
  }

  public setDashboardView(view: string) {
    this.state.dashboard.view = view;
  }
}
