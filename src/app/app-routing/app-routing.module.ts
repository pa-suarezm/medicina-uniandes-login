import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { LandingComponent } from '../landing/landing.component';
import { LoginFailedComponent } from '../login-failed/login-failed.component';
import { UnityComponent } from '../unity/unity.component';

const routes: Routes = [
    { path: 'simulador', component: UnityComponent, canActivate: [MsalGuard] },
    { path: 'login-failed', component: LoginFailedComponent},
    { path: '', component: LandingComponent}
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { useHash: false })
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class AppRoutingModule { }
