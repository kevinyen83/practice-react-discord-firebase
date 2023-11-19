import { Component, OnInit } from '@angular/core';

import { LoginService } from "../../../core/services/auth/login/login.service";

@Component({
  selector: 'app-verifying-now',
  templateUrl: './verifying-now.component.html'
})
export class VerifyingNowComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
  }

  goToLogin() {
    this.loginService.signOut();
  }

}
