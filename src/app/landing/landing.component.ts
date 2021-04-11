import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo, AuthenticationResult } from '@azure/msal-common';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private msalService: MsalService) { }

  account: AccountInfo;

  login() {
    this.msalService.loginPopup().subscribe( (response: AuthenticationResult) => {
      this.msalService.instance.setActiveAccount(response.account);
      this.account = this.msalService.instance.getActiveAccount();
    });
  }

  logout() {
    this.account = null;
    this.msalService.logout();
  }

  ngOnInit(): void {
    
  }

}
