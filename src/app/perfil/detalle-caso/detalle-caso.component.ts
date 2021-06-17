import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RdbCasoResueltoService } from 'src/app/services/rdb-caso-resuelto.service';
import { RdbCasosService } from 'src/app/services/rdb-casos.service';
import { RdbUsersService } from 'src/app/services/rdb-users.service';

@Component({
  selector: 'app-detalle-caso',
  templateUrl: './detalle-caso.component.html',
  styleUrls: ['./detalle-caso.component.css']
})
export class DetalleCasoComponent implements OnInit {

  //Información del estudiante
  nombre_estudiante: string = "";

  //Identificadores del caso
  id_caso: string = "";
  especialidad: string = ""
  nombre_caso: string = "";
  intento: number = 0;

  //Datos adicionales del caso
  fecha: string = "";
  tiempo_caso: string = "";
  diagnostico: string = "";
  puntaje: string = "";

  //Los posibles diagnósticos
  diagnosticos: string[] = [];

  //La impresión diagnóstica correcta
  impresion_correcta: string[] = [];

  //El diagnóstico final correcto
  diagnostico_correcto: string[] = [];

  //Notas que tomó el estudiante
  notas: string = "";

  //Respuestas del caso
  enfermedad_actual: string[] = [];
  icon_enfermedad_actual: string[] = [];

  antecedentes: string[] = [];
  icon_antecedentes: string [] = [];

  cardiovascular: string[] = [];
  icon_cardiovascular: string = "";
  respiratorio: string[] = [];
  icon_respiratorio: string = "";
  genitourinario: string[] = [];
  icon_genitourinario: string = "";
  endocrino: string[] = [];
  icon_endocrino: string = "";
  gastrointestinal: string[] = [];
  icon_gastrointestinal: string = "";
  osteomuscular: string[] = [];
  icon_osteomuscular: string = "";
  nervioso: string[] = [];
  icon_nervioso: string = "";

  impresion_diagnostica: string[] = [];
  icon_impresion: string[] = [];

  laboratorios: string[] = [];
  icon_lab: string[] = [];
  imgs_diagnosticas: string[] = [];
  icon_imgs_diag: string[] = [];
  otras_ayudas: string[] = [];
  icon_otras: string[] = [];

  diagnostico_final: string[] = [];
  icon_diag_final: string[] = [];

  tratamiento: string[] = [];
  icon_tratamiento: string[] = [];

  //Variables auxiliares con la ruta de las imágenes de respuesta
  img_correcta: string = "../../../assets/img/lbl_pregs/pregunta-correcta.png";
  img_incorrecta: string = "../../../assets/img/lbl_pregs/pregunta-incorrecta.png";
  img_omitible: string = "../../../assets/img/lbl_pregs/pregunta-no escogida.png";
  img_error: string = "../../../assets/img/lbl_pregs/pregunta-error.png";

  //URL para consultar la base de datos
  urlFirebasePts: string = "https://medicina-uniandes-default-rtdb.firebaseio.com/especialidades/";

  //Flags para controlar elementos colapsables
  public notasIsCollapsed = true;
  public enfermedadActualIsCollapsed = true;
  public antecedentesIsCollapsed = true;
  public sistemasIsCollapsed = true;
  public impresionIsCollapsed = true;
  public ayudasIsCollapsed = true;
  public diagnosticoIsCollapsed = true;
  public tratamientoIsCollapsed = true;

  constructor(
    private firebase_users: RdbUsersService,
    private firebase_caso_detalle: RdbCasoResueltoService,
    private router: Router,
    private firebase_casos: RdbCasosService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.nombre_estudiante = this.firebase_users.nombreActual;

    this.id_caso = "";

    this.nombre_caso = this.firebase_caso_detalle.titulo;
    this.especialidad = this.firebase_caso_detalle.especialidad;
    this.intento = this.firebase_caso_detalle.intento;
    this.fecha = this.firebase_caso_detalle.fecha;
    this.tiempo_caso = this.firebase_caso_detalle.tiempo;
    this.diagnostico = this.firebase_caso_detalle.diagnostico;
    this.puntaje = this.firebase_caso_detalle.puntaje;

    this.notas = "";

    this.enfermedad_actual = [];
    this.icon_enfermedad_actual = [];

    this.antecedentes = [];
    this.icon_antecedentes = [];

    this.cardiovascular = [];
    this.icon_cardiovascular = "";
    this.respiratorio = [];
    this.icon_respiratorio = "";
    this.genitourinario = [];
    this.icon_genitourinario = "";
    this.endocrino = [];
    this.icon_endocrino = "";
    this.gastrointestinal = [];
    this.icon_gastrointestinal = "";
    this.osteomuscular = [];
    this.icon_osteomuscular = "";
    this.nervioso = [];
    this.icon_nervioso = "";

    this.impresion_correcta = [];
    this.impresion_diagnostica = [];
    this.icon_impresion = [];

    this.laboratorios = [];
    this.icon_lab = [];
    this.imgs_diagnosticas = [];
    this.icon_imgs_diag = [];
    this.otras_ayudas = [];
    this.icon_otras = [];

    this.diagnostico_correcto = [];
    this.diagnostico_final = [];
    this.icon_diag_final = [];

    this.tratamiento = [];
    this.icon_tratamiento = [];

    this.diagnosticos = [];

    if (this.nombre_caso.trim() == "" || this.especialidad.trim() == "" || this.intento == 0) {
      this.router.navigate(["/perfil"]);
    }
    else {
      //Recuperar información del caso planteado
      this.firebase_casos.getCasosEspecialdiad(this.especialidad).toPromise().then(
        data => {
          for(let key in data) {
            if (data.hasOwnProperty(key)) {

              if (data[key]["título"] == this.nombre_caso) {
                this.id_caso = key;
                this.urlFirebasePts += this.especialidad.split(" ").join("%20") + "/" + this.id_caso + "/tipo%20puntuación/";

                //Posibles diagnósticos del caso
                this.diagnosticos.push(data[key]["impresión diagnóstica"]["d_1"]);
                this.diagnosticos.push(data[key]["impresión diagnóstica"]["d_2"]);
                this.diagnosticos.push(data[key]["impresión diagnóstica"]["d_3"]);
                this.diagnosticos.push(data[key]["impresión diagnóstica"]["d_4"]);
                this.diagnosticos.push(data[key]["impresión diagnóstica"]["d_5"]);

                this.impresion_correcta.push(data[key]["impresión diagnóstica"]["p_1"]);
                this.impresion_correcta.push(data[key]["impresión diagnóstica"]["p_2"]);
                this.impresion_correcta.push(data[key]["impresión diagnóstica"]["p_3"]);
                this.impresion_correcta.push(data[key]["impresión diagnóstica"]["p_4"]);
                this.impresion_correcta.push(data[key]["impresión diagnóstica"]["p_5"]);

                this.diagnostico_correcto.push(data[key]["diagnóstico final"]["f_1"]);
                this.diagnostico_correcto.push(data[key]["diagnóstico final"]["f_2"]);
                this.diagnostico_correcto.push(data[key]["diagnóstico final"]["f_3"]);
                this.diagnostico_correcto.push(data[key]["diagnóstico final"]["f_4"]);
                this.diagnostico_correcto.push(data[key]["diagnóstico final"]["f_5"]);

                //Recuperar información de las respuestas del estudiante
                this.firebase_caso_detalle.getCasosResueltos(this.firebase_users.correoActual).toPromise().then(
                  data_2 => {
                    var caso_aux;
                    var resps_aux;
                    for(let key in data_2) {
                      if (data_2.hasOwnProperty(key)) {
                        caso_aux = data_2[key];
            
                        if (caso_aux["especialidad"] == this.especialidad && caso_aux["título"] == this.nombre_caso
                        && caso_aux["intento"] == this.intento) {
          
                          resps_aux = caso_aux["respuestas"];
          
                          //Recuperar las notas que tomó el estudiante
                          this.notas = caso_aux["notas"];
                          if (this.notas.trim() == "") {
                            this.notas = "No se encontraron notas asociadas a este caso resuelto.";
                          }
          
                          //Recuperar enfermedad actual
                          if (resps_aux.hasOwnProperty("enfermedad actual")) {
                            for(let key_resp in resps_aux["enfermedad actual"]) {
                              if (resps_aux["enfermedad actual"].hasOwnProperty(key_resp)) {
                                this.enfermedad_actual.push(resps_aux["enfermedad actual"][key_resp]);
                                this.icon_enfermedad_actual.push(this.img_correcta); //Siempre es correcto preguntar por la enfermedad actual
                              }
                            }
                          }
          
                          //Recuperar antecedentes
                          if (resps_aux.hasOwnProperty("antecedentes")) {
                            for(let key_resp in resps_aux["antecedentes"]) {
                              if (resps_aux["antecedentes"].hasOwnProperty(key_resp)) {
                                this.antecedentes.push(resps_aux["antecedentes"][key_resp]);
                              }
                            }
                          }
          
                          //Íconos de antecedentes
                          this.antecedentes.forEach(
                            (e,i) => {
                              this.puntuarAntecedente(e,i);
                            }
                          );
          
                          //Recuperar sistemas
                          if (resps_aux.hasOwnProperty("sistemas")) {
                            var resps_sistemas = resps_aux["sistemas"];
          
                            //Recuperar cardiovascular
                            for(let key_resp in resps_sistemas["cardiovascular"]) {
                              if (resps_sistemas["cardiovascular"].hasOwnProperty(key_resp)) {
                                this.cardiovascular.push(resps_sistemas["cardiovascular"][key_resp]);
                                this.puntuarSistemas("Cardiovascular");
                              }
                            }
          
                            //Recuperar respiratorio
                            for(let key_resp in resps_sistemas["respiratorio"]) {
                              if (resps_sistemas["respiratorio"].hasOwnProperty(key_resp)) {
                                this.respiratorio.push(resps_sistemas["respiratorio"][key_resp]);
                                this.puntuarSistemas("Respiratorio");
                              }
                            }
          
                            //Recuperar genitourinario
                            for(let key_resp in resps_sistemas["genitourinario"]) {
                              if (resps_sistemas["genitourinario"].hasOwnProperty(key_resp)) {
                                this.genitourinario.push(resps_sistemas["genitourinario"][key_resp]);
                                this.puntuarSistemas("Genitourinario");
                              }
                            }
          
                            //Recuperar endocrino
                            for(let key_resp in resps_sistemas["endocrino"]) {
                              if (resps_sistemas["endocrino"].hasOwnProperty(key_resp)) {
                                this.endocrino.push(resps_sistemas["endocrino"][key_resp]);
                                this.puntuarSistemas("Endocrino");
                              }
                            }
          
                            //Recuperar gastrointestinal
                            for(let key_resp in resps_sistemas["gastrointestinal"]) {
                              if (resps_sistemas["gastrointestinal"].hasOwnProperty(key_resp)) {
                                this.gastrointestinal.push(resps_sistemas["gastrointestinal"][key_resp]);
                                this.puntuarSistemas("Gastrointestinal");
                              }
                            }
          
                            //Recuperar osteomuscular
                            for(let key_resp in resps_sistemas["osteomuscular"]) {
                              if (resps_sistemas["osteomuscular"].hasOwnProperty(key_resp)) {
                                this.osteomuscular.push(resps_sistemas["osteomuscular"][key_resp]);
                                this.puntuarSistemas("Osteomuscular");
                              }
                            }
          
                            //Recuperar nervioso
                            for(let key_resp in resps_sistemas["nervioso"]) {
                              if (resps_sistemas["nervioso"].hasOwnProperty(key_resp)) {
                                this.nervioso.push(resps_sistemas["nervioso"][key_resp]);
                                this.puntuarSistemas("Nervioso");
                              }
                            }
                          }
          
                          //Recuperar impresión diagnóstica
                          if (resps_aux.hasOwnProperty("impresión diagnóstica")) {
                            for(let key_resp in resps_aux["impresión diagnóstica"]) {
                              if (resps_aux["impresión diagnóstica"].hasOwnProperty(key_resp)) {
                                this.impresion_diagnostica.push(resps_aux["impresión diagnóstica"][key_resp]);
                              }
                            }

                            this.impresion_diagnostica.forEach(
                              (e,i) => {
                                this.puntuarImpresion(e,i);
                              }
                            );
                          }
          
                          //Recuperar ayudas diagnósticas
                          if (resps_aux.hasOwnProperty("ayudas diagnósticas")) {
                            var resps_ayudas = resps_aux["ayudas diagnósticas"];
          
                            if (resps_ayudas.hasOwnProperty("laboratorios")) {
                              //Recuperar laboratorios
                              for(let key_resp in resps_ayudas["laboratorios"]) {
                                if (resps_ayudas["laboratorios"].hasOwnProperty(key_resp)) {
                                  this.laboratorios.push(resps_ayudas["laboratorios"][key_resp])
                                }
                              }

                              this.laboratorios.forEach(
                                (e,i) => {
                                  this.puntuarLab(e,i);
                                }
                              );
                            }
          
                            if (resps_ayudas.hasOwnProperty("imágenes diagnósticas")) {
                              //Recuperar imágenes diagnósticas
                              for(let key_resp in resps_ayudas["imágenes diagnósticas"]) {
                                if (resps_ayudas["imágenes diagnósticas"].hasOwnProperty(key_resp)) {
                                  this.imgs_diagnosticas.push(resps_ayudas["imágenes diagnósticas"][key_resp])
                                }
                              }

                              this.imgs_diagnosticas.forEach(
                                (e,i) => {
                                  this.puntuarImgs(e,i);
                                }
                              );
                            }
          
                            if (resps_ayudas.hasOwnProperty("otras ayudas")) {
                              //Recuperar otras ayudas
                              for(let key_resp in resps_ayudas["otras ayudas"]) {
                                if (resps_ayudas["otras ayudas"].hasOwnProperty(key_resp)) {
                                  this.otras_ayudas.push(resps_ayudas["otras ayudas"][key_resp])
                                }
                              }

                              this.otras_ayudas.forEach(
                                (e,i) => {
                                  this.puntuarOtras(e,i);
                                }
                              );
                            }
                          }
          
                          //Recuperar diagnóstico final
                          if (resps_aux.hasOwnProperty("diagnóstico final")) {
                            for(let key_resp in resps_aux["diagnóstico final"]) {
                              if (resps_aux["diagnóstico final"].hasOwnProperty(key_resp)) {
                                this.diagnostico_final.push(resps_aux["diagnóstico final"][key_resp])
                              }
                            }

                            this.diagnostico_final.forEach(
                              (e,i) => {
                                this.puntuarDiagnostico(e,i);
                              }
                            );
                          }
          
                          //Recuperar tratamiento
                          if (resps_aux.hasOwnProperty("tratamiento")) {
                            for(let key_resp in resps_aux["tratamiento"]) {
                              if (resps_aux["tratamiento"].hasOwnProperty(key_resp)) {
                                this.tratamiento.push(resps_aux["tratamiento"][key_resp])
                              }
                            }

                            this.tratamiento.forEach(
                              (e,i) => {
                                this.puntuarTratamiento(e,i);
                              }
                            );
                          }
          
                          break;
                        }
                      }
                    }
            
                  }
                ).catch(
                  error_2 => {
                    console.log("Error recuperando los casos de para el correo " + this.firebase_users.correoActual);
                    console.log(error_2);
                  }
                );

                break;
              }              
            }
          }
        }
      ).catch(
        error => {
          console.log("Error recuperando casos de " + this.especialidad);
          console.log(error);
          this.router.navigate(["/perfil"]);
        }
      );      
    }
  }

  /**
   * Agrega al arreglo de icon_antecedentes el ícono adecuado para el antecedente que entra por parámetro
   * en la posición indicada
   * @param pAntecedente El antecedente a evaluar
   * @param pIndex El índice donde se debe guardar la respuesta
   */
  puntuarAntecedente(pAntecedente: string, pIndex: number){
    this.http.get(this.urlFirebasePts + "antecedentes/" + pAntecedente + "/.json").toPromise().then(
      data => {
        if (data == "positivo") {
          this.icon_antecedentes[pIndex] = this.img_correcta;
        }
        else if (data == "negativo") {
          this.icon_antecedentes[pIndex] = this.img_incorrecta;
        }
        else if (data == "omitible") {
          this.icon_antecedentes[pIndex] = this.img_omitible;
        }
        else {
          this.icon_antecedentes[pIndex] = this.img_error;
        }
      }
    ).catch(
      error => {
        console.log("Error recuperando tipo de puntuación del antecedente " + pAntecedente);
        this.icon_antecedentes[pIndex] = this.img_error;
        console.log(error);
      }
    );
  }

  /**
   * Agrega a la variable adecuada el ícono adecuado para el sistema que entra por parámetro
   * @param pSistema El sistema a evaluar
   */
  puntuarSistemas(pSistema: string) {
    var icon_ans: string = this.img_error;

    this.http.get(this.urlFirebasePts + "sistemas/" + pSistema + "/.json").toPromise().then(
      data => {
        if (data == "positivo") {
          icon_ans = this.img_correcta;
        }
        else if (data == "negativo") {
          icon_ans = this.img_incorrecta;
        }
        else if (data == "omitible") {
          icon_ans = this.img_omitible;
        }

        //Asignar el ícono encontrado a la variable correcta
        if (pSistema == "Cardiovascular") {
          this.icon_cardiovascular = icon_ans;
        }
        else if (pSistema == "Endocrino") {
          this.icon_endocrino = icon_ans;
        }
        else if (pSistema == "Gastrointestinal") {
          this.icon_gastrointestinal = icon_ans;
        }
        else if (pSistema == "Genitourinario") {
          this.icon_genitourinario = icon_ans;
        }
        else if (pSistema == "Nervioso") {
          this.icon_nervioso = icon_ans;
        }
        else if (pSistema == "Osteomuscular") {
          this.icon_osteomuscular = icon_ans;
        }
        else if (pSistema == "Respiratorio") {
          this.icon_respiratorio = icon_ans;
        }
      }
    ).catch(
      error => {
        console.log("Error recuperando tipo de puntuación del sistema " + pSistema);

        if (pSistema == "Cardiovascular") {
          this.icon_cardiovascular = this.img_error;
        }
        else if (pSistema == "Endocrino") {
          this.icon_endocrino = this.img_error;
        }
        else if (pSistema == "Gastrointestinal") {
          this.icon_gastrointestinal = this.img_error;
        }
        else if (pSistema == "Genitourinario") {
          this.icon_genitourinario = this.img_error;
        }
        else if (pSistema == "Nervioso") {
          this.icon_nervioso = this.img_error;
        }
        else if (pSistema == "Osteomuscular") {
          this.icon_osteomuscular = this.img_error;
        }
        else if (pSistema == "Respiratorio") {
          this.icon_respiratorio = this.img_error;
        }

        console.log(error);
      }
    );
  }

  /**
   * Guarda el ícono adecuado en el índice indicado para la impresión diagnóstica que entra por parámetro
   * @param pImpresion Impresión diagnóstica a evaluar
   * @param pIndex Posición en icon_impresion donde se va a guardar el ícono
   */
  puntuarImpresion(pImpresion: string, pIndex: number) {
    var imp_correcta: string = this.impresion_correcta[pIndex];
    var img_ans: string = this.img_error;

    if (imp_correcta == pImpresion) {
      img_ans = this.img_correcta;
    }
    else if (imp_correcta.startsWith("Muy alta")) {
      if (pImpresion.startsWith("Alta")) {
        img_ans = this.img_omitible;
      }
      else if (pImpresion.startsWith("Baja") || pImpresion.startsWith("Muy baja")) {
        img_ans = this.img_incorrecta;
      }
    }
    else if (imp_correcta.startsWith("Alta")) {
      if (pImpresion.startsWith("Muy alta") || pImpresion.startsWith("Baja")) {
        img_ans = this.img_omitible;
      }
      else if (pImpresion.startsWith("Muy baja")) {
        img_ans = this.img_incorrecta;
      }
    }
    else if (imp_correcta.startsWith("Baja")) {
      if (pImpresion.startsWith("Alta") || pImpresion.startsWith("Muy baja")) {
        img_ans = this.img_omitible;
      }
      else if(pImpresion.startsWith("Muy alta")) {
        img_ans = this.img_incorrecta;
      }
    }
    else if (imp_correcta.startsWith("Muy baja")) {
      if (pImpresion.startsWith("Baja")) {
        img_ans = this.img_omitible;
      }
      else if (pImpresion.startsWith("Alta") || pImpresion.startsWith("Muy alta")) {
        img_ans = this.img_incorrecta;
      }
    }

    this.icon_impresion[pIndex] = img_ans;
  }

  /**
   * Guarda el ícono adecuado en el índice indicado para el laboratorio que entra por parámetro
   * @param pLab Laboratorio a evaluar
   * @param pIndex Posición de icon_lab donde se va a guardar el ícono evaluado
   */
  puntuarLab(pLab: string, pIndex: number) {
    this.http.get(this.urlFirebasePts + "ayudas%20diagnósticas/laboratorios/" + pLab.split("%").join("%25").split(" ").join("%20") + "/.json")
    .toPromise().then(
      data => {
        if (data == "positivo") {
          this.icon_lab[pIndex] = this.img_correcta;
        }
        else if (data == "omitible") {
          this.icon_lab[pIndex] = this.img_omitible;
        }
        else {
          this.icon_lab[pIndex] = this.img_incorrecta;
        }
      }
    ).catch(
      error => {
        console.log("Error recuperando la información de puntos del laboratorio " + pLab);
        this.icon_lab[pIndex] = this.img_error;
        console.log(error);
      }
    );
  }

  /**
   * Guarda el ícono adecuado en el índice indicado para la imagen diagnóstica que entra por parámetro
   * @param pImg Imagen diagnóstica a evaluar
   * @param pIndex Posición de icon_imgs_diag donde se va a guardar el ícono evaluado
   */
   puntuarImgs(pImg: string, pIndex: number) {
    this.http.get(this.urlFirebasePts + "ayudas%20diagnósticas/imágenes%20diagnósticas/" + pImg.split(" ").join("%20") + "/.json")
    .toPromise().then(
      data => {
        if (data == "positivo") {
          this.icon_imgs_diag[pIndex] = this.img_correcta;
        }
        else if (data == "omitible") {
          this.icon_imgs_diag[pIndex] = this.img_omitible;
        }
        else {
          this.icon_imgs_diag[pIndex] = this.img_incorrecta;
        }
      }
    ).catch(
      error => {
        console.log("Error recuperando la información de puntos de la imagen diagnóstica " + pImg);
        this.icon_imgs_diag[pIndex] = this.img_error;
        console.log(error);
      }
    );
  }

  /**
   * Guarda el ícono adecuado en el índice indicado para el laboratorio que entra por parámetro
   * @param pLab Laboratorio a evaluar
   * @param pIndex Posición de icon_otras donde se va a guardar el ícono evaluado
   */
   puntuarOtras(pLab: string, pIndex: number) {
    this.http.get(this.urlFirebasePts + "ayudas%20diagnósticas/otras%20ayudas/" + pLab.split("%").join("%25").split(" ").join("%20") + "/.json")
    .toPromise().then(
      data => {
        if (data == "positivo") {
          this.icon_otras[pIndex] = this.img_correcta;
        }
        else if (data == "omitible") {
          this.icon_otras[pIndex] = this.img_omitible;
        }
        else {
          this.icon_otras[pIndex] = this.img_incorrecta;
        }
      }
    ).catch(
      error => {
        console.log("Error recuperando la información de puntos del laboratorio " + pLab);
        this.icon_otras[pIndex] = this.img_error;
        console.log(error);
      }
    );
  }

  /**
   * Guarda el ícono adecuado en el índice indicado para el diagnóstico final que entra por parámetro
   * @param pDiagnostico Diagnóstico final a evaluar
   * @param pIndex Posición en icon_diag_final donde se va a guardar el ícono
   */
  puntuarDiagnostico(pDiagnostico: string, pIndex: number) {
    var diag_correcto: string = this.diagnostico_correcto[pIndex];
    var img_ans: string = "";

    if (diag_correcto == pDiagnostico) {
      img_ans = this.img_correcta;
    }
    else {
      img_ans = this.img_incorrecta;
    }

    this.icon_diag_final[pIndex] = img_ans;
  }
 
  /**
   * Guarda el ícono adecuado en el índice indicado para el tratamiento que entra por parámetro
   * @param pTrat El tratamiento a evaluar
   * @param pIndex Posición en icon_tratamiento donde se va a guardar el ícono
   */
  puntuarTratamiento(pTrat: string, pIndex: number) {
    //El soporte hídrico viene de la forma "<Soporte hídrico> :: <parámetros>"
    //Los parámetros del soporte son irrelevantes para puntuar. Se incluyen para que el profesor encargado
    //revise los parámetros ingresados por el estudiante
    this.http.get(this.urlFirebasePts + "tratamiento/" + 
                  pTrat.split("::")[0].trim().split("%").join("%25").split(" ").join("%20") + "/.json")
    .toPromise().then(
      data => {
        if (data == "positivo") {
          this.icon_tratamiento[pIndex] = this.img_correcta;
        }
        else {
          this.icon_tratamiento[pIndex] = this.img_incorrecta;
        }
      }
    ).catch(
      error => {
        console.log("Error recuperando el tratamiento " + pTrat);
        this.icon_tratamiento[pIndex] = this.img_error;
        console.log(error);
      }
    );
  }

}
