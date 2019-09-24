import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FacturaVentaComponent } from './factura-venta/factura-venta.component';
import { Error404Component } from './error404/error404.component'
import { SesionGuard } from './servicios/servicios.index'

const routes: Routes = [
  { 
    path: 'facturas', 
    component: FacturaVentaComponent,
    canActivate: [SesionGuard],
  },
  {
    path: 'sesion',
    component: LoginComponent,
    canActivate: [SesionGuard]
  },
  {
    path: '**',
    component: Error404Component
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot( 
      routes, 
      { 
        useHash: true
      },)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }

