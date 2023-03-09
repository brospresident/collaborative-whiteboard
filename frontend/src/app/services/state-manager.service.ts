import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateManagerService {
  state: any = {
    dashboard: {
      view: 'projects'
    }
  }
  constructor() { }

  public getDashboardView() {
    return this.state.dashboard.view;
  }

  public setDashboardView(view: string) {
    this.state.dashboard.view = view;
  }
}
