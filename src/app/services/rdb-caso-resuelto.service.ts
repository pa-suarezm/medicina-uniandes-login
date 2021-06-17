import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RdbCasoResueltoService {

  constructor(private http: HttpClient) { }

  //URLs auxiliares para consultar Firebase
  urlFirebaseUsuarios = "https://medicina-uniandes-default-rtdb.firebaseio.com/usuarios/estudiantes/";

  //Propiedades del caso cuyo detalle se quiere consultar
  especialidad: string = "";
  titulo: string = "";
  intento: number = 0;
  tiempo: string = "";
  diagnostico: string = "";
  puntaje: string = "";
  fecha: string = "";

  /**
   * Recupera todos los casos que el usuario ha realizado y devuelve un Observable
   * con la información recuperada
   * @param pCorreo El correo del estudiante cuyos casos son consultados
   * @returns El Observable de la petición GET generada
   */
  getCasosResueltos(pCorreo: string) {
    var urlAux = this.urlFirebaseUsuarios + pCorreo.split(".").join(",") + "/casos/.json";

    return this.http.get(urlAux);
  }
}
