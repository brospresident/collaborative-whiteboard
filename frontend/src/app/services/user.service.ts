import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  public getUser() {
    let username = window.localStorage.getItem('cw_user');
    return username ? username : "";
  }

  public setUser(username: string) {
    if (!username) {
      return false;
    }

    window.localStorage.setItem('cw_user', username);
    return true;
  }
}
