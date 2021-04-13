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
    this.oauthService.oidc = false;

    var json_jwks = JSON.parse('{"keys":[{"kty":"RSA","use":"sig","kid":"nOo3ZDrODXEK1jKWhXslHR_KXEg","x5t":"nOo3ZDrODXEK1jKWhXslHR_KXEg","n":"oaLLT9hkcSj2tGfZsjbu7Xz1Krs0qEicXPmEsJKOBQHauZ_kRM1HdEkgOJbUznUspE6xOuOSXjlzErqBxXAu4SCvcvVOCYG2v9G3-uIrLF5dstD0sYHBo1VomtKxzF90Vslrkn6rNQgUGIWgvuQTxm1uRklYFPEcTIRw0LnYknzJ06GC9ljKR617wABVrZNkBuDgQKj37qcyxoaxIGdxEcmVFZXJyrxDgdXh9owRmZn6LIJlGjZ9m59emfuwnBnsIQG7DirJwe9SXrLXnexRQWqyzCdkYaOqkpKrsjuxUj2-MHX31FqsdpJJsOAvYXGOYBKJRjhGrGdONVrZdUdTBQ","e":"AQAB","x5c":["MIIDBTCCAe2gAwIBAgIQN33ROaIJ6bJBWDCxtmJEbjANBgkqhkiG9w0BAQsFADAtMSswKQYDVQQDEyJhY2NvdW50cy5hY2Nlc3Njb250cm9sLndpbmRvd3MubmV0MB4XDTIwMTIyMTIwNTAxN1oXDTI1MTIyMDIwNTAxN1owLTErMCkGA1UEAxMiYWNjb3VudHMuYWNjZXNzY29udHJvbC53aW5kb3dzLm5ldDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKGiy0/YZHEo9rRn2bI27u189Sq7NKhInFz5hLCSjgUB2rmf5ETNR3RJIDiW1M51LKROsTrjkl45cxK6gcVwLuEgr3L1TgmBtr/Rt/riKyxeXbLQ9LGBwaNVaJrSscxfdFbJa5J+qzUIFBiFoL7kE8ZtbkZJWBTxHEyEcNC52JJ8ydOhgvZYykete8AAVa2TZAbg4ECo9+6nMsaGsSBncRHJlRWVycq8Q4HV4faMEZmZ+iyCZRo2fZufXpn7sJwZ7CEBuw4qycHvUl6y153sUUFqsswnZGGjqpKSq7I7sVI9vjB199RarHaSSbDgL2FxjmASiUY4RqxnTjVa2XVHUwUCAwEAAaMhMB8wHQYDVR0OBBYEFI5mN5ftHloEDVNoIa8sQs7kJAeTMA0GCSqGSIb3DQEBCwUAA4IBAQBnaGnojxNgnV4+TCPZ9br4ox1nRn9tzY8b5pwKTW2McJTe0yEvrHyaItK8KbmeKJOBvASf+QwHkp+F2BAXzRiTl4Z+gNFQULPzsQWpmKlz6fIWhc7ksgpTkMK6AaTbwWYTfmpKnQw/KJm/6rboLDWYyKFpQcStu67RZ+aRvQz68Ev2ga5JsXlcOJ3gP/lE5WC1S0rjfabzdMOGP8qZQhXk4wBOgtFBaisDnbjV5pcIrjRPlhoCxvKgC/290nZ9/DLBH3TbHk8xwHXeBAnAjyAqOZij92uksAv7ZLq4MODcnQshVINXwsYshG1pQqOLwMertNaY5WtrubMRku44Dw7R"],"issuer":"https://login.microsoftonline.com/77c59514-17af-4ce4-9592-08f2aa4c457c/v2.0"},{"kty":"RSA","use":"sig","kid":"l3sQ-50cCH4xBVZLHTGwnSR7680","x5t":"l3sQ-50cCH4xBVZLHTGwnSR7680","n":"sfsXMXWuO-dniLaIELa3Pyqz9Y_rWff_AVrCAnFSdPHa8__Pmkbt_yq-6Z3u1o4gjRpKWnrjxIh8zDn1Z1RS26nkKcNg5xfWxR2K8CPbSbY8gMrp_4pZn7tgrEmoLMkwfgYaVC-4MiFEo1P2gd9mCdgIICaNeYkG1bIPTnaqquTM5KfT971MpuOVOdM1ysiejdcNDvEb7v284PYZkw2imwqiBY3FR0sVG7jgKUotFvhd7TR5WsA20GS_6ZIkUUlLUbG_rXWGl0YjZLS_Uf4q8Hbo7u-7MaFn8B69F6YaFdDlXm_A0SpedVFWQFGzMsp43_6vEzjfrFDJVAYkwb6xUQ","e":"AQAB","x5c":["MIIDBTCCAe2gAwIBAgIQWPB1ofOpA7FFlOBk5iPaNTANBgkqhkiG9w0BAQsFADAtMSswKQYDVQQDEyJhY2NvdW50cy5hY2Nlc3Njb250cm9sLndpbmRvd3MubmV0MB4XDTIxMDIwNzE3MDAzOVoXDTI2MDIwNjE3MDAzOVowLTErMCkGA1UEAxMiYWNjb3VudHMuYWNjZXNzY29udHJvbC53aW5kb3dzLm5ldDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALH7FzF1rjvnZ4i2iBC2tz8qs/WP61n3/wFawgJxUnTx2vP/z5pG7f8qvumd7taOII0aSlp648SIfMw59WdUUtup5CnDYOcX1sUdivAj20m2PIDK6f+KWZ+7YKxJqCzJMH4GGlQvuDIhRKNT9oHfZgnYCCAmjXmJBtWyD052qqrkzOSn0/e9TKbjlTnTNcrIno3XDQ7xG+79vOD2GZMNopsKogWNxUdLFRu44ClKLRb4Xe00eVrANtBkv+mSJFFJS1Gxv611hpdGI2S0v1H+KvB26O7vuzGhZ/AevRemGhXQ5V5vwNEqXnVRVkBRszLKeN/+rxM436xQyVQGJMG+sVECAwEAAaMhMB8wHQYDVR0OBBYEFLlRBSxxgmNPObCFrl+hSsbcvRkcMA0GCSqGSIb3DQEBCwUAA4IBAQB+UQFTNs6BUY3AIGkS2ZRuZgJsNEr/ZEM4aCs2domd2Oqj7+5iWsnPh5CugFnI4nd+ZLgKVHSD6acQ27we+eNY6gxfpQCY1fiN/uKOOsA0If8IbPdBEhtPerRgPJFXLHaYVqD8UYDo5KNCcoB4Kh8nvCWRGPUUHPRqp7AnAcVrcbiXA/bmMCnFWuNNahcaAKiJTxYlKDaDIiPN35yECYbDj0PBWJUxobrvj5I275jbikkp8QSLYnSU/v7dMDUbxSLfZ7zsTuaF2Qx+L62PsYTwLzIFX3M8EMSQ6h68TupFTi5n0M2yIXQgoRoNEDWNJZ/aZMY/gqT02GQGBWrh+/vJ"],"issuer":"https://login.microsoftonline.com/77c59514-17af-4ce4-9592-08f2aa4c457c/v2.0"},{"kty":"RSA","use":"sig","kid":"DqUu8gf-nAgcyjP3-SuplNAXAnc","x5t":"DqUu8gf-nAgcyjP3-SuplNAXAnc","n":"1n7-nWSLeuWQzBRlYSbS8RjvWvkQeD7QL9fOWaGXbW73VNGH0YipZisPClFv6GzwfWECTWQp19WFe_lASka5-KEWkQVzCbEMaaafOIs7hC61P5cGgw7dhuW4s7f6ZYGZEzQ4F5rHE-YNRbvD51qirPNzKHk3nji1wrh0YtbPPIf--NbI98bCwLLh9avedOmqESzWOGECEMXv8LSM-B9SKg_4QuBtyBwwIakTuqo84swTBM5w8PdhpWZZDtPgH87Wz-_WjWvk99AjXl7l8pWPQJiKNujt_ck3NDFpzaLEppodhUsID0ptRA008eCU6l8T-ux19wZmb_yBnHcV3pFWhQ","e":"AQAB","x5c":["MIIC8TCCAdmgAwIBAgIQYVk/tJ1e4phISvVrAALNKTANBgkqhkiG9w0BAQsFADAjMSEwHwYDVQQDExhsb2dpbi5taWNyb3NvZnRvbmxpbmUudXMwHhcNMjAxMjIxMDAwMDAwWhcNMjUxMjIxMDAwMDAwWjAjMSEwHwYDVQQDExhsb2dpbi5taWNyb3NvZnRvbmxpbmUudXMwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDWfv6dZIt65ZDMFGVhJtLxGO9a+RB4PtAv185ZoZdtbvdU0YfRiKlmKw8KUW/obPB9YQJNZCnX1YV7+UBKRrn4oRaRBXMJsQxppp84izuELrU/lwaDDt2G5bizt/plgZkTNDgXmscT5g1Fu8PnWqKs83MoeTeeOLXCuHRi1s88h/741sj3xsLAsuH1q9506aoRLNY4YQIQxe/wtIz4H1IqD/hC4G3IHDAhqRO6qjzizBMEznDw92GlZlkO0+AfztbP79aNa+T30CNeXuXylY9AmIo26O39yTc0MWnNosSmmh2FSwgPSm1EDTTx4JTqXxP67HX3BmZv/IGcdxXekVaFAgMBAAGjITAfMB0GA1UdDgQWBBQ2r//lgTPcKughDkzmCtRlw+P9SzANBgkqhkiG9w0BAQsFAAOCAQEAsFdRyczNWh/qpYvcIZbDvWYzlrmFZc6blcUzns9zf7sUWtQZrZPu5DbetV2Gr2r3qtMDKXCUaR+pqoy3I2zxTX3x8bTNhZD9YAgAFlTLNSydTaK5RHyB/5kr6B7ZJeNIk3PRVhRGt6ybCJSjV/VYVkLR5fdLP+5GhvBESobAR/d0ntriTzp7/tLMb/oXx7w5Hu1m3I8rpMocoXfH2SH1GLmMXj6Mx1dtwCDYM6bsb3fhWRz9O9OMR6QNiTnq8q9wn1QzBAnRcswYzT1LKKBPNFSasCvLYOCPOZCL+W8N8jqa9ZRYNYKWXzmiSptgBEM24t3m5FUWzWqoLu9pIcnkPQ=="],"issuer":"https://login.microsoftonline.com/77c59514-17af-4ce4-9592-08f2aa4c457c/v2.0"},{"kty":"RSA","use":"sig","kid":"OzZ5Dbmcso9Qzt2ModGmihg30Bo","x5t":"OzZ5Dbmcso9Qzt2ModGmihg30Bo","n":"01re9a2BUTtNtdFzLNI-QEHW8XhDiDMDbGMkxHRIYXH41zBccsXwH9vMi0HuxXHpXOzwtUYKwl93ZR37tp6lpvwlU1HePNmZpJ9D-XAvU73x03YKoZEdaFB39VsVyLih3fuPv6DPE2qT-TNE3X5YdIWOGFrcMkcXLsjO-BCq4qcSdBH2lBgEQUuD6nqreLZsg-gPzSDhjVScIUZGiD8M2sKxADiIHo5KlaZIyu32t8JkavP9jM7ItSAjzig1W2yvVQzUQZA-xZqJo2jxB3g_fygdPUHK6UN-_cqkrfxn2-VWH1wMhlm90SpxTMD4HoYOViz1ggH8GCX2aBiX5OzQ6Q","e":"AQAB","x5c":["MIIC8TCCAdmgAwIBAgIQQrXPXIlUE4JMTMkVj+02YTANBgkqhkiG9w0BAQsFADAjMSEwHwYDVQQDExhsb2dpbi5taWNyb3NvZnRvbmxpbmUudXMwHhcNMjEwMzEwMDAwMDAwWhcNMjYwMzEwMDAwMDAwWjAjMSEwHwYDVQQDExhsb2dpbi5taWNyb3NvZnRvbmxpbmUudXMwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDTWt71rYFRO0210XMs0j5AQdbxeEOIMwNsYyTEdEhhcfjXMFxyxfAf28yLQe7Fcelc7PC1RgrCX3dlHfu2nqWm/CVTUd482Zmkn0P5cC9TvfHTdgqhkR1oUHf1WxXIuKHd+4+/oM8TapP5M0Tdflh0hY4YWtwyRxcuyM74EKripxJ0EfaUGARBS4Pqeqt4tmyD6A/NIOGNVJwhRkaIPwzawrEAOIgejkqVpkjK7fa3wmRq8/2Mzsi1ICPOKDVbbK9VDNRBkD7FmomjaPEHeD9/KB09QcrpQ379yqSt/Gfb5VYfXAyGWb3RKnFMwPgehg5WLPWCAfwYJfZoGJfk7NDpAgMBAAGjITAfMB0GA1UdDgQWBBTECjBRANDPLGrn1p7qtwswtBU7JzANBgkqhkiG9w0BAQsFAAOCAQEAq1Ib4ERvXG5kiVmhfLOpun2ElVOLY+XkvVlyVjq35rZmSIGxgfFc08QOQFVmrWQYrlss0LbboH0cIKiD6+rVoZTMWxGEicOcGNFzrkcG0ulu0cghKYID3GKDTftYKEPkvu2vQmueqa4t2tT3PlYF7Fi2dboR5Y96Ugs8zqNwdBMRm677N/tJBk53CsOf9NnBaxZ1EGArmEHHIb80vODStv35ueLrfMRtCF/HcgkGxy2U8kaCzYmmzHh4zYDkeCwM3Cq2bGkG+Efe9hFYfDHw13DzTR+h9pPqFFiAxnZ3ofT96NrZHdYjwbfmM8cw3ldg0xQzGcwZjtyYmwJ6sDdRvQ=="],"issuer":"https://login.microsoftonline.com/77c59514-17af-4ce4-9592-08f2aa4c457c/v2.0"}]}');

    this.oauthService.loginUrl = "https://login.microsoftonline.com/77c59514-17af-4ce4-9592-08f2aa4c457c/oauth2/v2.0/authorize";
    this.oauthService.tokenEndpoint = "https://login.microsoftonline.com/77c59514-17af-4ce4-9592-08f2aa4c457c/oauth2/v2.0/token";
    this.oauthService.responseType = "code id_token";
    this.oauthService.redirectUri = "https://medicina-uniandes-dev.vercel.app/";
    this.oauthService.userinfoEndpoint = "https://graph.microsoft.com/oidc/userinfo";
    this.oauthService.issuer = "https://login.microsoftonline.com/77c59514-17af-4ce4-9592-08f2aa4c457c/v2.0";
    this.oauthService.clientId = "9718a786-ef92-46b9-9987-49ed9cf15fca";
    this.oauthService.jwks = json_jwks;
    this.oauthService.scope = 'openid profile offline_access';

    this.oauthService.tokenValidationHandler = new JwksValidationHandler;
    this.oauthService.tryLogin().then( resp => {
      console.log("tryLogin(): " + resp);
    });
  }

  ngOnInit(): void {
    this.msalService.instance.handleRedirectPromise().then(
      res => {
        console.log("handleRedirectPromise() res start");
        if (res != null && res.account != null) {
          this.msalService.instance.setActiveAccount(res.account);
          this.router.navigate(["/simulador"]);
        }
        console.log("handleRedirectPromise() res end");
      }
    ).catch(
      error => {
        console.log("handleRedirectPromise() error start");
        console.log("handleRedirectPromise() error: " + error);
        console.log("handleRedirectPromise() error end");
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
    this.msalService.instance.handleRedirectPromise().then(
      res => {
        console.log("handleRedirectPromise() res start");
        if (res != null && res.account != null) {
          this.msalService.instance.setActiveAccount(res.account);
          this.router.navigate(["/simulador"]);
        }
        console.log("handleRedirectPromise() res end");
      }
    ).catch(
      error => {
        console.log("handleRedirectPromise() error start");
        console.log("handleRedirectPromise() error: " + error);
        console.log("handleRedirectPromise() error end");
      }
    );
    
    this.msalService.loginRedirect();

    //OAuth
    //this.oauthService.initImplicitFlow();
  }

  logout() {
    //MSAL
    this.msalService.logout();
    
    //OAuth
    //this.oauthService.logOut();
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
