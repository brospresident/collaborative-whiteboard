import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RpcService } from 'src/app/services/rpc.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  page = 'login';
  email: any = '';
  password: any = '';
  confirmPassword: any = '';
  error: any = {};
  timeout: any;
  constructor(
    private rpcService: RpcService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit() {
    
  }

  login() {
    let params = {
      username: this.email,
      password: this.password
    };

    let that = this;

    this.rpcService.ask('auth.login', params, (err: any, result: any) => {
      if (err) {
        that.fillError(err);
      } else {
        that.tokenService.setToken(result.result);
        that.router.navigate(['/dashboard']);
      }
    });
  }

  register() {
    if (!this.email.length || !this.password.length || !this.confirmPassword.length) {
      this.fillError('Please fill all of the fields!');
      return;
    }

    if (this.confirmPassword !== this.password) {
      this.fillError('The passwords do not match!');
      return;
    }

    let params = {
      username: this.email,
      password: this.password
    };

    let that = this;

    this.rpcService.ask('auth.register', params, (err: any, result: any) => {
      if (err) {
        that.fillError(err);
      } else {
        that.tokenService.setToken(result.result);
        that.router.navigate(['/dashboard']);
      }
    });
  }

  fillError(message: string) {
    this.error.message = message;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.error = {};
    }, 3000);
  }

  switchPage(page: any) {
    this.page = page;
  }

}
