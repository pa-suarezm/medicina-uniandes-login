import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RdbCasosService {

  constructor(
    private http: HttpClient
  ) { }

  urlFirebase: string = "https://medicina-uniandes-default-rtdb.firebaseio.com/";

  //Recupera todos los casos de la especialidad indicada
  getCasosEspecialdiad(pEspecialidad: string) {
    var urlCasos = this.urlFirebase + "especialidades/" + pEspecialidad + "/.json";

    return this.http.get(urlCasos);
  }
}
