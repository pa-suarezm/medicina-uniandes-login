import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo, AuthenticationResult } from '@azure/msal-common';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private msalService: MsalService, private httpClient: HttpClient,
    private router: Router) { }

  ngOnInit(): void {
    this.msalService.instance.handleRedirectPromise().then(
      res => {
        if (res != null && res.account != null) {
          this.msalService.instance.setActiveAccount(res.account);
          this.router.navigate(["/simulador"]);
        }
      }
    );
  }

  apiResponse: string;

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

  callProfile() {
    this.httpClient.get("https://graph.microsoft.com/v1.0/me").subscribe( resp => {
      this.apiResponse = JSON.stringify(resp);
    });
  }

}
