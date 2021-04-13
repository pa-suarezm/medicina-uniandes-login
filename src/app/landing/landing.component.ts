import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo, AuthenticationResult } from '@azure/msal-common';
import { OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { authCodeFlowConfig } from '../sso.config';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private msalService: MsalService, private httpClient: HttpClient,
    private router: Router, private oauthService: OAuthService) { 
      this.configureSingleSignOn();
  }

  configureSingleSignOn() {
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler;
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

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
    //MSAL
    /*
    //PopUp
    this.msalService.loginPopup().subscribe( (response: AuthenticationResult) => {
      this.msalService.instance.setActiveAccount(response.account);
    });
    */
    //Redirect
    //this.msalService.loginRedirect();

    //OAuth
    this.oauthService.initImplicitFlow();
  }

  logout() {
    //MSAL
    //this.msalService.logout();
    
    //OAuth
    this.oauthService.logOut();
  }

  get token() {
    let claims:any = this.oauthService.getIdentityClaims();
    return claims ? claims : null;
  }

  callProfile() {
    this.httpClient.get("https://graph.microsoft.com/v1.0/me").subscribe( resp => {
      this.apiResponse = JSON.stringify(resp);
    });
  }

}
