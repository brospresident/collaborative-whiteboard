import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from './services/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  constructor(private router: Router, private tokenService: TokenService) {
    if (tokenService.getToken().length == 0) {
      router.navigate(['/auth']);
    } else {
      router.navigate(['/dashboard'])
    }
  }

}
