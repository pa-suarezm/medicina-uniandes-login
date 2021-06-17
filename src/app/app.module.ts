import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UnityComponent } from './unity/unity.component';
import { LoginFailedComponent } from './login-failed/login-failed.component';
import { LandingComponent } from './landing/landing.component';

import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

//MSAL
import {
  MsalModule,
  MsalService,
  MsalInterceptor,
  MsalInterceptorConfiguration,
  MsalGuardConfiguration,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
} from "@azure/msal-angular";
import { 
  IPublicClientApplication,
  PublicClientApplication,
  InteractionType,
  BrowserCacheLocation,
} from "@azure/msal-browser";
import { PerfilComponent } from './perfil/perfil.component';
import { DetalleCasoComponent } from './perfil/detalle-caso/detalle-caso.component';

export function MSALInstanceFactory(): IPublicClientApplication {

  return new PublicClientApplication({
    auth: {
      clientId: "e6428a2a-0043-4289-8679-74ea177249a0",
      authority: "https://login.microsoftonline.com/fabd047c-ff48-492a-8bbb-8f98b9fb9cca/",
      //Debe ser el root porque así fue configurado el redirectUri en Azure por la DSIT
      redirectUri: "https://medicina-uniandes-dev.vercel.app/",
      postLogoutRedirectUri: "https://medicina-uniandes-dev.vercel.app/",
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: false, // set to true for IE 11
    },    
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set("https://graph.microsoft.com/v1.0/me", ["user.read"]);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return { 
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ["user.read"]
    },
    loginFailedRoute: "login-failed"
  };
}
@NgModule({
  declarations: [
    AppComponent,
    UnityComponent,
    LandingComponent,
    LoginFailedComponent,
    PerfilComponent,
    DetalleCasoComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    MsalModule,
  ],
  providers: [
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    MsalService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
