import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-login-failed',
  templateUrl: './login-failed.component.html',
  styleUrls: ['./login-failed.component.css']
})
export class LoginFailedComponent implements OnInit {

  constructor(private _msalService: MsalService) { }

  name: string;
  username:string;

  ngOnInit(): void {    
    const account = this._msalService.instance.getActiveAccount();
    this.name = account.name;
    this.username = account.username;
  }

}
