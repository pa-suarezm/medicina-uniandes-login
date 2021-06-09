import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';
import { ResultadosMngrService } from '../services/resultados-mngr/resultados-mngr.service';

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
    private msalService: MsalService, private http: HttpClient, private resultadosService: ResultadosMngrService) { }

  logout() {
    this.msalService.logout();
    this.msalService.instance.setActiveAccount(null);
  }

  ngOnInit(): void {
    const account = this.msalService.instance.getActiveAccount();
    this.name = account.name;
    this.username = account.username;

    this.resultadosService.correo_actual = this.username.split(".").join(",");

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

    //Registra el caso completado en Firebase
    (window as any).registrarCasoCompletado = (especialidad: string, puntaje: string, tiempo: string, titulo: string, notas: string, modo: string) => {
      var urlGetCasos: string = "https://medicina-uniandes-default-rtdb.firebaseio.com/usuarios/estudiantes/" + this.username.split(".").join(",")
        + "/casos/.json";
      
      var urlPutCaso: string = "https://medicina-uniandes-default-rtdb.firebaseio.com/usuarios/estudiantes/" + this.username.split(".").join(",")
      + "/casos/"; //Hay que agregar el identificador. Para saber el siguiente identificador, hay que primero recorrer todos los casos
                  //que han sido registrados para este usuario

      var meses: string[] = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
      var fecha: Date = new Date(Date.now());
      var fecha_str: string = `${fecha.getFullYear()}-${meses[fecha.getMonth()]}-${fecha.getDate()}`
      
      var json_caso = {
        "especialidad": especialidad,
        "fecha": fecha_str,
        "notas": notas,
        "puntaje": puntaje,
        "tiempo": tiempo,
        "título": titulo,
        "modo": modo
      };

      this.http.get(urlGetCasos).toPromise().then(
        data => {
          var key_aux: string;
          var cnt_intentos: number = 1;          
          var cnt: number = 0;
          if (data != null) {
            while(true) {
              key_aux = "c_" + cnt;
              if (data[key_aux] == null) {
                break; //Se busca cuál es la siguiente posición vacía en la que se puede insertar el nuevo caso
              }
              else {
                if (data[key_aux]["especialidad"] == json_caso.especialidad
                && data[key_aux]["título"] == json_caso.título) {
                  cnt_intentos++;
                }
              }
              cnt++;
            }
          }
          else {
            key_aux = "c_0";
          }


          json_caso["intento"] = cnt_intentos;

          urlPutCaso += key_aux + "/.json";

          this.http.put(urlPutCaso, json_caso).toPromise().then(
            resp => {
              console.log("Finalizó la carga de " + key_aux + " para " + this.username);
              
              this.resultadosService.id_actual = key_aux;
              (window as any).subirPregsSeleccionadas();
            }
          ).catch(
            error => {
              console.log("Error subiendo el caso " + key_aux + " a " + urlPutCaso + ": " + error);
            }
          );

        }
      ).catch(
        error => {
          console.log("Error recuperando casos de " + this.username + ": " + error);
        }
      );
    }

    (window as any).agregarEnfermedadActual = (pPreg: string) => {
      this.resultadosService.enfermedad_acutal.push(pPreg);
    }

    (window as any).agregarAntecedente = (pPreg: string) => {
      this.resultadosService.antecedentes.push(pPreg);
    }

    (window as any).agregarSistema = (pPreg: string, pSistema: string) => {
      if (pSistema == "cardiovascular") {
        this.resultadosService.cardiovascular.push(pPreg);
      }
      else if (pSistema == "respiratorio") {
        this.resultadosService.respiratorio.push(pPreg);
      }
      else if (pSistema == "genitourinario") {
        this.resultadosService.genitourinario.push(pPreg);
      }
      else if (pSistema == "endocrino") {
        this.resultadosService.endocrino.push(pPreg);
      }
      else if (pSistema == "gastrointestinal") {
        this.resultadosService.gastrointestinal.push(pPreg);
      }
      else if (pSistema == "osteomuscular") {
        this.resultadosService.osteomuscular.push(pPreg);
      }
      else if (pSistema == "nervioso") {
        this.resultadosService.nervioso.push(pPreg);
      }
    }

    (window as any).agregarImpresion = (pImpr: string) => {
      this.resultadosService.impresion_diagnostica.push(pImpr);
    }

    (window as any).agregarAyuda = (pAyuda: string, pTipo: string) => {
      if (pTipo == "lab") {
        this.resultadosService.laboratorios.push(pAyuda);
      }
      else if (pTipo == "img") {
        this.resultadosService.imgs_diagnosticas.push(pAyuda);
      }
      else if (pTipo == "otras") {
        this.resultadosService.otras_ayudas.push(pAyuda);
      }
    }

    (window as any).agregarDiagnostico = (pDiag: string) => {
      this.resultadosService.diagnostico_final.push(pDiag);
    }

    (window as any).agregarTratamiento = (pTrat: string) => {
      this.resultadosService.tratamiento.push(pTrat);
    }

    (window as any).subirPregsSeleccionadas = () => {
      this.resultadosService.subirEnfermedadActual();
      this.resultadosService.subirAntecedentes();
      this.resultadosService.subirSistemas();
      this.resultadosService.subirImpresion();
      this.resultadosService.subirAyudas();
      this.resultadosService.subirDiagnostico();
      this.resultadosService.subirTratamiento();
    }

    //Estas funciones muestran los recursos que Unity requiera
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
