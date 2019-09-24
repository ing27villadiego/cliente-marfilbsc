import { Injectable } from '@angular/core'
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router'
import { SessionService } from '../sesion/session.service'

@Injectable()
export class SesionGuard implements CanActivate {
    
    constructor(
        public sesionService: SessionService,
        public router: Router
    ){}

    canActivate(ruta: ActivatedRouteSnapshot){
        if(ruta.url.toString() == "sesion"){
            if(this.sesionService.estadoSesion()){
                this.router.navigate(['/facturas'])
                return false;
            }else{
                return true;
            }
        }{
            if(ruta.url.toString() == "facturas"){
                if(this.sesionService.estadoSesion()){            
                    return true
                }else{
                    this.router.navigate(['/sesion'])
                    return false
                }
            }
        }
        
    }
}