import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResultadosMngrService {

  /** Indica el identificador a donde se deben subir las respuestas */
  id_actual: string = "";

  /** Indica el correo del estudiante que realizó el caso a subir */
  correo_actual: string = "";

  /** URLs auxiliares para las peticiones necesarias */
  urlUsers: string = "https://medicina-uniandes-default-rtdb.firebaseio.com/usuarios/estudiantes/";

  /** Respuestas del estudiante que deben ser subidas */
  enfermedad_acutal: string[] = [];

  antecedentes: string[] = [];

  cardiovascular: string[] = [];
  respiratorio: string[] = [];
  genitourinario: string[] = [];
  endocrino: string[] = [];
  gastrointestinal: string[] = [];
  osteomuscular: string[] = [];
  nervioso: string[] = [];

  impresion_diagnostica: string[] = [];

  laboratorios: string[] = [];
  imgs_diagnosticas: string[] = [];
  otras_ayudas: string[] = [];

  diagnostico_final: string[] = [];

  tratamiento: string[] = [];

  constructor(private http: HttpClient) { }

  subirEnfermedadActual() {
    var json_enfermedad_actual = {};

    this.enfermedad_acutal.forEach(
      (e,i) => {
        json_enfermedad_actual["r_" + i] = e;
      }
    );

    if (this.enfermedad_acutal.length != 0) {
      this.subirJSON("enfermedad%20actual/.json", json_enfermedad_actual).toPromise().then(
        resp => {
          this.enfermedad_acutal = [];
        }
      ).catch(
        error => {
          console.log("Error subiendo selecciones de enfermedad actual");
          console.log(error);
        }
      );
    }
  }

  subirAntecedentes() {
    var json_antecedentes = {};

    this.antecedentes.forEach(
      (e,i) => {
        json_antecedentes["r_" + i] = e;
      }
    );

    if (this.antecedentes.length != 0) {
      this.subirJSON("antecedentes/.json", json_antecedentes).toPromise().then(
        resp => {
          this.antecedentes = [];
        }
      ).catch(
        error => {
          console.log("Error subiendo selecciones de antecedentes");
          console.log(error);
        }
      );
    }
  }

  subirSistemas() {
    var json_sistemas = {
      "cardiovascular": {},
      "respiratorio": {},
      "genitourinario": {},
      "endocrino": {},
      "gastrointestinal": {},
      "osteomuscular": {},
      "nervioso": {}
    };

    if (this.cardiovascular.length != 0) {
      this.cardiovascular.forEach(
        (e,i) => {
          json_sistemas["cardiovascular"]["r_" + i] = e;
        }
      );
    }
    else {
      delete json_sistemas.cardiovascular;
    }
    
    if (this.respiratorio.length != 0) {
      this.respiratorio.forEach(
        (e,i) => {
          json_sistemas["respiratorio"]["r_" + i] = e;
        }
      );
    }
    else {
      delete json_sistemas.respiratorio;
    }
    
    if (this.genitourinario.length != 0) {
      this.genitourinario.forEach(
        (e,i) => {
          json_sistemas["genitourinario"]["r_" + i] = e;
        }
      );
    }
    else {
      delete json_sistemas.genitourinario;
    }
    
    if (this.endocrino.length != 0) {
      this.endocrino.forEach(
        (e,i) => {
          json_sistemas["endocrino"]["r_" + i] = e;
        }
      );
    }
    else {
      delete json_sistemas.endocrino;
    }
    
    if (this.gastrointestinal.length != 0) {
      this.gastrointestinal.forEach(
        (e,i) => {
          json_sistemas["gastrointestinal"]["r_" + i] = e;
        }
      );
    }
    else {
      delete json_sistemas.gastrointestinal;
    }
    
    if (this.osteomuscular.length != 0) {
      this.osteomuscular.forEach(
        (e,i) => {
          json_sistemas["osteomuscular"]["r_" + i] = e;
        }
      );
    }
    else {
      delete json_sistemas.osteomuscular;
    }
    
    if (this.nervioso.length != 0) {
      this.nervioso.forEach(
        (e,i) => {
          json_sistemas["nervioso"]["r_" + i] = e;
        }
      );
    }
    else {
      delete json_sistemas.nervioso;
    }

    if (!this.isEmpty(json_sistemas)) {
      this.subirJSON("sistemas/.json", json_sistemas).toPromise().then(
        resp => {
          this.cardiovascular = [];
          this.respiratorio = [];
          this.genitourinario = [];
          this.endocrino = [];
          this.gastrointestinal = [];
          this.osteomuscular = [];
          this.nervioso = [];
        }
      ).catch(
        error => {
          console.log("No fue posible subir las selecciones de sistemas");
          console.log(error);
        }
      );
    }
  }

  subirImpresion() {
    var json_impresion = {};
    var cnt: number;

    this.impresion_diagnostica.forEach(
      (e,i) => {
        cnt = i+1;
        json_impresion["r_" + cnt] = e; //Se suma 1 al índice para que cuadre con los diagnósticos guardados del caso
      }
    );

    if (this.impresion_diagnostica.length != 0) {
      this.subirJSON("impresión%20diagnóstica/.json", json_impresion).toPromise().then(
        resp => {
          this.impresion_diagnostica = [];
        }
      ).catch(
        error => {
          console.log("No fue posible subir las selecciones de impresión diagnóstica");
          console.log(error);
        }
      );
    }
  }

  subirAyudas() {
    var json_ayudas = {
      "laboratorios": {},
      "imágenes diagnósticas": {},
      "otras ayudas": {}
    };

    if (this.laboratorios.length != 0) {
      this.laboratorios.forEach(
        (e,i) => {
          json_ayudas["laboratorios"]["r_" + i] = e;
        }
      );
    }
    else {
      delete json_ayudas.laboratorios;
    }
    
    if (this.imgs_diagnosticas.length != 0) {
      this.imgs_diagnosticas.forEach(
        (e,i) => {
          json_ayudas["imágenes diagnósticas"]["r_" + i] = e;
        }
      );
    }
    else {
      delete json_ayudas['imágenes diagnósticas'];
    }

    if (this.otras_ayudas.length != 0) {
      this.otras_ayudas.forEach(
        (e,i) => {
          json_ayudas["otras ayudas"]["r_" + i] = e;
        }
      );
    }
    else {
      delete json_ayudas['otras ayudas'];
    }

    if (!this.isEmpty(json_ayudas)) {
      this.subirJSON("ayudas%20diagnósticas/.json", json_ayudas).toPromise().then(
        resp => {
          this.impresion_diagnostica = [];
        }
      ).catch(
        error => {
          console.log("No fue posible subir las selecciones de ayudas diagnósticas");
          console.log(error);
        }
      );
    }
  }

  subirDiagnostico() {
    var json_diag = {};
    var cnt: number;
    this.diagnostico_final.forEach(
      (e,i) => {
        cnt = i+1;
        json_diag["r_" + cnt] = e;
      }
    );

    if (this.diagnostico_final.length != 0) {
      this.subirJSON("diagnóstico%20final/.json", json_diag).toPromise().then(
        resp => {
          this.diagnostico_final = [];
        }
      ).catch(
        error => {
          console.log("No fue posible subir las selecciones de diagnóstico final");
          console.log(error);
        }
      );
    }
  }

  subirTratamiento() {
    var json_trat = {};

    this.tratamiento.forEach(
      (e,i) => {
        json_trat["r_" + i] = e;
      }
    );

    if (this.tratamiento.length != 0) {
      this.subirJSON("tratamiento/.json", json_trat).toPromise().then(
        resp => {
          this.tratamiento = [];
        }
      ).catch(
        error => {
          console.log("No fue posible subir las selecciones de tratamiento");
          console.log(error);
        }
      );
    }
  }

  /**
   * Sube el objeto que entra por parámetro a la URL terminada en el string que entra por parámetro
   * @param pFinUrl La última parte de la URL donde será subida la información
   * @param pJson Objeto a subir
   * @returns El Observable de la petición PUT
   */
  subirJSON(pFinUrl: string, pJson: any) {
    var urlAux = this.urlUsers + this.correo_actual + "/casos/" + this.id_actual + "/respuestas/" + pFinUrl;

    return this.http.put(urlAux, pJson);
  }

  /**
   * Función auxiliar para verificar si el objeto que entra por parámetro está vacío o no
   * @param obj El objeto a evaluar
   * @returns true si el objeto está vacío; false en caso contrario
   */
  isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
}
