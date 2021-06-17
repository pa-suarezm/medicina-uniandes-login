import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RdbUsersService {

  constructor(private http: HttpClient, private router: Router, private firebase_storage: AngularFireStorage) { }

  urlFirebaseUsers = "https://medicina-uniandes-default-rtdb.firebaseio.com/usuarios/";

  //Nombre y correo del estudiante cuyo detalle se quiere consultar
  nombreActual: string = "";
  correoActual: string = "";

  getEstudiantes() {
    return this.http.get(this.urlFirebaseUsers + "estudiantes/.json");
  }

  getAdministradores() {
    return this.http.get(this.urlFirebaseUsers + "administradores/.json");
  }

  getEstudiantePorCorreo(pCorreo: string) {
    return this.http.get(this.urlFirebaseUsers + "estudiantes/" + pCorreo.split(".").join(",") + "/.json");
  }

  putEstudiante(pCorreo: string, json_est: string) {
    return this.http.put(this.urlFirebaseUsers + "estudiantes/" + pCorreo.split(".").join(",") +"/.json", JSON.parse(json_est));
  }

  registrarEstudiante() {
    var new_user = {
      código: 100000000,
      nombre: this.nombreActual
    }
    return this.http.put(this.urlFirebaseUsers + "estudiantes/" + this.correoActual.split(".").join(",") + "/.json", new_user);
  }
}
