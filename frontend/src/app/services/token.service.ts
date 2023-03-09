import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  public setToken(token: string): void {
    window.localStorage.setItem('cw_token', token);
  }

  public getToken(): string {
    let token = window.localStorage.getItem('cw_token');
    if (token) return token;
    else return "";
  } 

  public checkToken(): boolean {
    return false;
  }

  public deleteToken() {
    if (this.getToken().length != 0) {
      window.localStorage.removeItem('cw_token');
    }
  }
}
