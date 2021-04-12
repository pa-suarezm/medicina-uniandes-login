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

  ngOnInit(): void {
    this.msalService.instance.handleRedirectPromise().then(
      res => {
        if (res != null && res.account != null) {
          this.msalService.instance.setActiveAccount(res.account);
        }
      }
    );    
  }

  isLoggedIn(): boolean {
    return this.msalService.instance.getActiveAccount() != null;
  }

  login() {
    /*
    //PopUp
    this.msalService.loginPopup().subscribe( (response: AuthenticationResult) => {
      this.msalService.instance.setActiveAccount(response.account);
    });
    */
    //Redirect
    this.msalService.loginRedirect();
  }

  logout() {
    this.msalService.logout();
  }

}
