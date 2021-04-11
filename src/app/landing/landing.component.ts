import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-common';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private msalService: MsalService) { }

  name: string;
  username: string;
  account: AccountInfo;

  ngOnInit(): void {
    this.account = this.msalService.instance.getActiveAccount();
    if (this.account != null) {
      this.name = this.account.name;
      this.username = this.account.username;
    }
  }

}
