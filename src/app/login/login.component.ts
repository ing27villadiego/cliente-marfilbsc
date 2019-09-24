import { Component, OnInit } from '@angular/core';
import { SessionService } from '../servicios/servicios.index'
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner'

// model de user
import { Usuario } from '../modelos/usuario.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  msjError1:boolean;
  mensaje1: string;
  
  constructor(
    public router: Router,
    private sesionService: SessionService,
    private spinnerService: NgxSpinnerService
  ) {
    this.msjError1=false
   }
  

  ngOnInit() {
  
  }

  IniciarSesion(form:NgForm) {

    if (form.invalid) {
      return
    }
    this.spinnerService.show();
    let usuario = {
      "CODIGO_USUARIO": form.value.usuario,
      "CLAVE_ACCESO": form.value.password,
      "CODIGO_EMPRESA": "7",
      "COMPANY": "clickoffice_desarrollo"
    }
    
    this.sesionService.iniciarSesion(usuario)
    .subscribe(login => {
      this.router.navigate(['/facturas'])
      this.spinnerService.hide();
    },error => {
      this.spinnerService.hide();
      this.msjError1=true
      this.mensaje1 = error.error.error;
      
      setTimeout(()=>{
        this.msjError1 = false;
      }, 5000);
    }
    )
    
  }

}
