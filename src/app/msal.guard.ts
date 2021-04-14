import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MsalGuard implements CanActivate, CanLoad {

  constructor(private msalService: MsalService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (this.msalService.instance.getActiveAccount() == null) {
      //Regrese a home
      this.router.navigate(["/"]);
      return false;
    }
    
    return true;
  }
  
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (this.msalService.instance.getActiveAccount() == null) {
      //Regrese a home
      this.router.navigate(["/"]);
      return false;
    }
    
    return true;
  }
}
