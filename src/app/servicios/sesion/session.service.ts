import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { environment } from 'src/environments/environment';


// model de user
import { Usuario } from '../../modelos/usuario.model';


@Injectable({
  providedIn: 'root'
})
export class SessionService {
  iniciarsesion:string
  token_key: string
  usuario: Usuario;
  constructor(
    private http: HttpClient
  ) {
    this.validarStorage();
    this.iniciarsesion = environment.apiUrl;
   }

  private headers: HttpHeaders = new HttpHeaders({
    'Content-type' : 'application/json'
  });

  estadoSesion(){
    this.validarStorage();
    return (this.token_key.length > 5) ? true : false
  }

  guardarStorage(token_key: string){
    localStorage.setItem('token_key', token_key)
    this.token_key = token_key
  }


  validarStorage() {
    if ( localStorage.getItem('token_key')) {
      this.token_key = localStorage.getItem('token_key');
    } else {
      this.token_key = '';
    }
  }

  removerStorage(){
    localStorage.removeItem('token_key');
  }


  iniciarSesion(usuario: any) {
    const url: string = this.iniciarsesion + 'administrativo/usuar';
    return this.http.post( url, usuario,
                         { headers : this.headers})
                    .pipe(map((resp: any) => {
                      this.guardarStorage(resp["token"])
                      return true
                    }));
  }

}
