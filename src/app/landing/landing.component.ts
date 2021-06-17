import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo, AuthenticationResult } from '@azure/msal-common';
import { RdbUsersService } from '../services/rdb-users.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(
    private msalService: MsalService,
    private httpClient: HttpClient,
    private router: Router,
    private rdb_users: RdbUsersService
  ) {}
 
  ngOnInit(): void {
    this.msalService.instance.handleRedirectPromise().then(
      res => {
        if (res != null && res.account != null) {
          this.msalService.instance.setActiveAccount(res.account);
          this.username = this.msalService.instance.getActiveAccount().username;
          this.name = this.msalService.instance.getActiveAccount().name;

          this.rdb_users.correoActual = this.username;
          this.rdb_users.nombreActual = this.name;

          this.rdb_users.getEstudiantePorCorreo(this.username).toPromise().then(
            resp => {
              if (resp == null) {
                this.rdb_users.registrarEstudiante().toPromise().then().catch(
                  error_registro => {
                    console.log("Error registrando a " + this.username);
                    console.log(error_registro);
                  }
                );
              }
            }
          ).catch(
            error => {
              console.log("Error recuperando la información de " + this.username);
              console.log(error);
            }
          );
        }
      }
    ).catch(
      error => {
        console.error("handleRedirectPromise() error: " + error);
      }
    );
  }

  username: string = "";
  name: string = "";

  isLoggedIn(): boolean {
    return this.msalService.instance.getActiveAccount() != null;
  }

  login() {
    this.msalService.loginRedirect();
  }

  logout() {
    this.msalService.logout();
    this.msalService.instance.setActiveAccount(null);
    this.rdb_users.correoActual = "";
    this.rdb_users.nombreActual = "";
  }

}
