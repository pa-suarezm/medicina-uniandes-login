import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'unity',
  templateUrl: './unity.component.html',
  styleUrls: ['./unity.component.css']
})
export class UnityComponent implements OnInit {

  name: string;
  username: string;

  gameInstance: any;
  progress = 0;
  percentage = 0;
  isReady = false;

  //Examen físico
  examenFisico = "";
  imgUrl = "";
  audioUrl = "";

  //Ayudas diagnósticas
  labActual = 0;
  labsTotales = 0;

  titleLab = "";
  valorLab = "";
  pathLab = "";
  urlImgLab = "";

  titlesLab = [];
  valoresLab = [];
  pathsLab = [];

  @ViewChild('contentImg')
  private contentImg: TemplateRef<any>;

  @ViewChild('contentAudio')
  private contentAudio: TemplateRef<any>;

  @ViewChild('contentLabs')
  private contentLabs: TemplateRef<any>;

  anteriorLab() {
    if (this.labActual == 0) {
      this.labActual = this.labsTotales - 1;
    }
    else {
      this.labActual--;
    }
    
    this.mostrarLab(this.labActual);
  }

  siguienteLab() {
    this.labActual++;
    this.labActual %= this.labsTotales;

    this.mostrarLab(this.labActual);
  }

  mostrarLab(index: number) {
    this.labActual = index;

    this.titleLab = this.titlesLab[this.labActual];
    this.valorLab = this.valoresLab[this.labActual];
    this.pathLab = this.pathsLab[this.labActual];

    this.urlImgLab = null;

    if (this.pathLab != null && this.pathLab != "N/A") {
      this.afStorage.ref(this.pathLab).getDownloadURL()
      .subscribe(
        downloadUrl => this.urlImgLab = downloadUrl,
        err => console.log('Observer got an error: ' + err),
        () => {}
      );
    }
  }

  constructor(private afStorage: AngularFireStorage, private modalService: NgbModal,
    private msalService: MsalService, private http: HttpClient) { }

  logout() {
    this.msalService.logout();
    this.msalService.instance.setActiveAccount(null);
  }

  ngOnInit(): void {
    const account = this.msalService.instance.getActiveAccount();
    this.name = account.name;
    this.username = account.username;

    const loader = (window as any).UnityLoader;

    this.gameInstance = loader.instantiate(
      'gameContainer', 
      '/assets/Build/Builds.json', {
      onProgress: (gameInstance: any, progress: number) => {
          this.progress = Math.round(progress);
          this.percentage = Math.round(progress*100);
          if (progress === 1) {
            this.isReady = true;
          }
        }
      }
    );

    //Se exponen estas funciones a Unity
    (window as any).getUsername = () => {
      //Se llama la función setUser del objeto GameStateManager con el valor del usuario
      this.gameInstance.SendMessage('GameStateManager', 'setUserAngular', this.username);
    }

    (window as any).getName = () => {
      //Se llama la función setName del objeto GameStateManager con el valor del nombre
      this.gameInstance.SendMessage('GameStateManager', 'setNameAngular', this.name);
    }

    (window as any).registerUsername = () => {
      var str_json: string = "{\"nombre\": \"" + this.name + "\"";
      //TODO: Registrar más información del usuario
      str_json += "}"

      var json_user = JSON.parse(str_json);
      var urlPutUser = "https://medicina-uniandes-default-rtdb.firebaseio.com/usuarios/estudiantes/" + this.username.split(".").join(",") + "/.json";
      
      this.http.put(urlPutUser, json_user).toPromise().then(
        resp => {
          console.log("Success registering " + this.username);
        }
      ).catch(
        error => {
          console.log("Error registering " + this.username + ": " + error);
        }
      );
    }

    (window as any).lanzarModalConImg = (imgUrl: string, title: string) => {

      this.afStorage.ref(imgUrl).getDownloadURL()
      .subscribe(
        downloadUrl => this.imgUrl = downloadUrl,
        err => console.log('Observer got an error: ' + err),
        () => {
          //Cuando se mande la notificación de completado
          this.examenFisico = title;

          this.modalService.open(this.contentImg, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            console.log(`Closed with: ${result}`);
          }, (reason) => {
            console.log(`Dismissed ${reason}`);
          });
        }
      );
    }

    (window as any).lanzarModalConAudio = (audioUrl: string, title: string) => {

      this.afStorage.ref(audioUrl).getDownloadURL()
      .subscribe(
        downloadUrl => this.audioUrl = downloadUrl,
        err => console.log('Observer got an error: ' + err),
        () => {
          //Cuando se mande la notificación de completado
          this.examenFisico = title;

          this.modalService.open(this.contentAudio, {ariaLabelledBy: 'modal-basic-title'}).result
          .then(
            (result) => {}, 
            (reason) => {}
          );
        }
      );
    }

    (window as any).lanzarModalLabs = () => {

      this.modalService.open(this.contentLabs, {ariaLabelledBy: 'modal-basic-title'}).result
      .then(
        (result) => {}, 
        (reason) => {}
      );

      this.mostrarLab(0);
    }

    (window as any).agregarLab = (title: string, valor: string, path: string) => {

      this.labsTotales++;

      this.titlesLab.push(title);
      this.valoresLab.push(valor);
      this.pathsLab.push(path);

    }

    (window as any).eliminarLabs = () => {

      this.titlesLab = [];
      this.valoresLab = [];
      this.pathsLab = [];

      this.labActual = 0;
      this.labsTotales = 0;

      this.titleLab = "";
      this.valorLab = "";
      this.pathLab = "";
      this.urlImgLab = "";
    }
  }

}
