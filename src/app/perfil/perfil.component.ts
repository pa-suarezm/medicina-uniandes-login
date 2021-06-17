import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { RdbCasosService } from '../services/rdb-casos.service';
import { RdbUsersService } from '../services/rdb-users.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  constructor(
    private router: Router,
    private rdb_users: RdbUsersService,
    private rdb_casos: RdbCasosService,
    private msalService: MsalService
  ) { }

  //Información personal
  nombre: string = "";
  codigo: string = "";
  correo: string = "";

  //Casos de estudio realizados
  casos_estudio: string[] = [];
  especialidades_estudio: string[] = [];
  tiempos_estudio: string[] = [];
  puntajes_estudio: string[] = [];
  fechas_estudio: string[] = [];
  diagnosticos_estudio: string[] = [];
  intentos_estudio: number[] = [];

  //Casos de evaluación realizados
  casos_evaluacion: string[] = [];
  especialidades_evaluacion: string[] = [];
  tiempos_evaluacion: string[] = [];
  puntajes_evaluacion: string[] = [];
  fechas_evaluacion: string[] = [];
  diagnosticos_evaluacion: string[] = [];
  intentos_evaluacion: number[] = [];

  //Control de render
  renderInfo: boolean = true;
  renderCasosEstudio: boolean = false;
  renderCasosEvaluacion: boolean = false;

  ngOnInit(): void {
    /*
    this.firebase_rdb_detalle_caso.diagnostico = "";
    this.firebase_rdb_detalle_caso.especialidad = "";
    this.firebase_rdb_detalle_caso.puntaje = "";
    this.firebase_rdb_detalle_caso.tiempo = "";
    this.firebase_rdb_detalle_caso.titulo = "";
    this.firebase_rdb_detalle_caso.fecha = "";
    */

    if (this.rdb_users.correoActual.trim() == "" || 
        this.rdb_users.nombreActual.trim() == "") {
      this.router.navigate(["/landing"]);
    }
    else {
      this.nombre = this.rdb_users.nombreActual;

      this.rdb_users.getEstudiantePorCorreo(this.rdb_users.correoActual).toPromise().then(
        resp => {
          if (resp != null) {
            this.codigo = resp["código"];
            this.correo = this.rdb_users.correoActual;

            this.rdb_users.nombreActual = this.nombre;

            var casos_json = null;
            var key_aux: string = "";
            var caso_aux: string = null;
            var cnt = 0;

            var esp_aux: string = "";
            var fecha_aux: string = "";
            var puntaje_aux: string = "";
            var tiempo_aux: string = "";
            var titulo_aux: string = "";
            var intento_aux: number = 0;

            casos_json = resp["casos"];
            if (casos_json != null) {
              while (true) {
                key_aux = "c_" + cnt;
                caso_aux = casos_json[key_aux];

                if (caso_aux == null) {
                  break;
                }
                  esp_aux = caso_aux["especialidad"];
                  fecha_aux = caso_aux["fecha"];
                  puntaje_aux = caso_aux["puntaje"];
                  tiempo_aux = caso_aux["tiempo"];
                  titulo_aux = caso_aux["título"];
                  intento_aux = caso_aux["intento"];

                  if (caso_aux["modo"] == "Evaluación") {
                    this.especialidades_evaluacion.push(esp_aux);
                    this.fechas_evaluacion.push(fecha_aux);
                    this.puntajes_evaluacion.push(puntaje_aux);
                    this.tiempos_evaluacion.push(tiempo_aux);
                    this.casos_evaluacion.push(titulo_aux);
                    this.intentos_evaluacion.push(intento_aux);
                  }
                  else if (caso_aux["modo"] == "Estudio") {
                    this.especialidades_estudio.push(esp_aux);
                    this.fechas_estudio.push(fecha_aux);
                    this.puntajes_estudio.push(puntaje_aux);
                    this.tiempos_estudio.push(tiempo_aux);
                    this.casos_estudio.push(titulo_aux);
                    this.intentos_estudio.push(intento_aux);
                  }

                cnt++;
              }
            }

            //Recuperar info de diagnósticos finales
            this.casos_evaluacion.forEach(
              (e,i) => {
                this.recuperarDiagnosticoFinal(e, i, "Evaluación");
              }
            );
            
            this.casos_estudio.forEach(
              (e,i) => {
                this.recuperarDiagnosticoFinal(e, i, "Estudio");
              }
            );
          }
        }
      ).catch(
        error => {
          console.log("Error recuperando info de " + this.rdb_users.correoActual + ": " + error);
        }
      );
    }
  }

  /**
   * Busca en la base de datos el caso cuyo título entra por parámetro de la especialidad especialidades[index]
   * Dentro del caso busca a cuál diagnóstico se le asignó la etiqueta "Diagnóstico final" y guarda el nombre
   * de dicho diagnóstico en diagnosticos[index]
   * @param titulo_caso El título del caso a evaluar
   * @param index La posición del caso en los arreglos que guardan la información
   * @param modo El modo del caso a evaluar
   */
  recuperarDiagnosticoFinal(titulo_caso: string, index: number, modo: string) {
    var diag_aux: string;

    var diag_cnt_aux: number;
    var diag_cnt: number;

    var caso_json_aux = null;
    var diags_json = null;
    var lbl_json = null;

    var especialidades;

    if (modo == "Evaluación") {
      especialidades = this.especialidades_evaluacion;
    }
    else {
      especialidades = this.especialidades_estudio;
    }

    this.rdb_casos.getCasosEspecialdiad(especialidades[index]).toPromise().then(
      resp => {
        diag_aux = "No hay diagnóstico final";
        
        diag_cnt_aux = 1;
        diag_cnt = -1;

        if (resp != null) {
          for (let key in resp) {
            if (resp.hasOwnProperty(key)) {
              caso_json_aux = resp[key];

              if (caso_json_aux["título"] == titulo_caso) {
                lbl_json = caso_json_aux["diagnóstico final"];

                for (let lbl in lbl_json) {
                  if (lbl_json.hasOwnProperty(lbl) && lbl_json[lbl] == "Diagnóstico final") {
                    diag_cnt = diag_cnt_aux;
                    break;
                  }
                  diag_cnt_aux ++;
                }

                //Si se encontró algún diagnóstico final
                if (diag_cnt != -1) {
                  diags_json = caso_json_aux["impresión diagnóstica"];

                  diag_aux = diags_json["d_" + diag_cnt];
                }

                break;
              }
            }
          }
          
        }
        
        if (modo == "Evaluación") {
          this.diagnosticos_evaluacion[index] = diag_aux;
        }
        else {
          this.diagnosticos_estudio[index] = diag_aux;
        }
      }
    ).catch(
      error => {
        console.log("Error buscando el diagnóstico final de " + especialidades[index] + "/" + titulo_caso);
        console.log(error);
      }
    );

  }

  navegarAInfo() {
    this.renderInfo = true;
    this.renderCasosEstudio = false;
    this.renderCasosEvaluacion = false;
  }

  navegarACasosEstudio() {
    this.renderInfo = false;
    this.renderCasosEstudio = true;
    this.renderCasosEvaluacion = false;
  }

  navegarACasosEvaluacion() {
    this.renderInfo = false;
    this.renderCasosEstudio = false;
    this.renderCasosEvaluacion = true;
  }

  /**
   * Guarda los detalles conocidos del caso y abre el módulo de detalle de caso resuelto usando los detalles
   * guardados para identificar el caso necesario
   * @param index La posición en el arreglo correspondiente de casos para extraer la información
   * @param modo El modo del caso (i.e. "Estudio" o "Evaluación")
   
  verDetalleCasoResuelto(index: number, modo: string) {
    var diagnosticos;
    var especialidades;
    var puntajes;
    var tiempos;
    var casos;
    var fechas;
    var intentos;

    if (modo == "Evaluación") {
      diagnosticos = this.diagnosticos_evaluacion;
      especialidades = this.especialidades_evaluacion;
      puntajes = this.puntajes_evaluacion;
      tiempos = this.tiempos_evaluacion;
      casos = this.casos_evaluacion;
      fechas = this.fechas_evaluacion;
      intentos = this.intentos_evaluacion;
    }
    else {
      diagnosticos = this.diagnosticos_estudio;
      especialidades = this.especialidades_estudio;
      puntajes = this.puntajes_estudio;
      tiempos = this.tiempos_estudio;
      casos = this.casos_estudio;
      fechas = this.fechas_estudio;
      intentos = this.intentos_estudio;
    }

    this.firebase_rdb_detalle_caso.diagnostico = diagnosticos[index];
    this.firebase_rdb_detalle_caso.especialidad = especialidades[index];
    this.firebase_rdb_detalle_caso.puntaje = puntajes[index];
    this.firebase_rdb_detalle_caso.tiempo = tiempos[index];
    this.firebase_rdb_detalle_caso.titulo = casos[index];
    this.firebase_rdb_detalle_caso.fecha = fechas[index];
    this.firebase_rdb_detalle_caso.intento = intentos[index];

    this.router.navigate(["/panel/detalle-estudiante-caso"]);
  }
  */

  logout() {
    this.msalService.logout();
    this.msalService.instance.setActiveAccount(null);
    this.rdb_users.correoActual = "";
    this.rdb_users.nombreActual = "";
  }
}
