import { Component, OnInit } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ReporteService, SessionService } from '../servicios/servicios.index'
import { NgForm } from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner'
import { NumerosALetras } from 'numero-a-letras'
import { Router } from '@angular/router';
import { trimTrailingNulls } from '@angular/compiler/src/render3/view/util';




@Component({
  selector: 'app-factura-venta',
  templateUrl: './factura-venta.component.html',
  styleUrls: ['./factura-venta.component.scss']
})
export class FacturaVentaComponent implements OnInit {

  lote=false
  aux:number
  mensaje:string
  validarPre:boolean
  validarIni:boolean
  validarFin:boolean
  existencia:boolean
  numeroInicial:string
  numeroFinal:string
  dataFacturas: any[];
  detalleFacturas: any[];
  cantidadTotal: number = 0;
  
  constructor(
    public service : ReporteService,
    public router: Router,
    public cerrar : SessionService,
    private spinnerService: NgxSpinnerService,
    ){
      this.validarPre=false
      this.validarIni=false
      this.validarFin=false
      this.existencia=false
     }  
  
   ngOnInit() { }

    limpiar(f:NgForm){
      if (this.lote===false) {
        focus()
        f.setValue({
          prefijo:' ',
          inicial:' ',
        })
      }else{
        f.setValue({
          prefijo:' ',
          inicial:' ',
          final:' '
        })
      }      
    }
    cerrarSesion() {
      this.cerrar.removerStorage()
      this.router.navigate(['/sesion'])
    }
   
   getData (forma: NgForm){

    

    if (forma.invalid) {
      return alert('Favor llenar todos los campos')
    }

    this.spinnerService.show();

    if (this.lote===false) {
       this.aux= forma.value.inicial
    }else{
      this.aux= forma.value.final
    }    

    const parametros:any = {
      prefijo: forma.value.prefijo,
      inicial: forma.value.inicial,
      final:  this.aux
    }
    
    this.service.obtenerFactura(parametros)
      .subscribe(data => {
        this.dataFacturas = data["facturas"] 
        if (this.dataFacturas.length===0) {
          this.spinnerService.hide();
          this.existencia=true                 
        }  setTimeout(()=>{
          this.existencia=false
        },5000)
        this.dataFacturas.forEach(elemento => {
                
          this.detalleFacturas = elemento['detalle_facturas']
        
          pdfMake.vfs = pdfFonts.pdfMake.vfs
          this.cantidadTotal=0
          let body = []
          let titulos = new Array('Codigo', 'Descripcion','Und','Cantidad', 'Dcto', 'Iva', 'Valor unitario', 'Subtotal');
          body.push( titulos )
          this.detalleFacturas.forEach(detalle => {
              
              let  subtotal=detalle.CANTIDAD * detalle.PRECIO_UNITARIO
              this.cantidadTotal += parseInt(detalle.CANTIDAD);
              let fila = new Array(
              detalle.CODIGO_ARTICULO,
              detalle.CONCEPTO_ARTICULO,
              'UND',
              Math.floor(detalle.CANTIDAD),
              Math.floor(detalle.DESCUENTO),
              Math.floor(detalle.IVA),
              new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', useGrouping: true}).format(detalle.PRECIO_UNITARIO) ,
              new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', useGrouping: true}).format(subtotal),
              )                 
                body.push(fila)
                
            });
            
            var dd = {
              
              background: function(currentPage){
                return { 
                  margin: [0, 10, 20, 0],
                  text:' Pagina ' + currentPage , style:'paginado'
                }     
              },
              pageSize:'letter',
              pageMargins:[0,280,40,300],
               
              header:[
                { 
                  margin: [30, 40, 0, 0],
                  columns: [
                    
                    {
                      
                      image: 'mySuperImage',
                      width: 75,
                      height: 75,
                    },
                    { text: [
                      {text: elemento.NOMBRE_EMPRESA+'\n', bold:true},
                      {text: elemento.REGIMEN + '\n' + 'NIT: ' + elemento.IDENTIFICACION_EMPRESA, fontSize:'10'},
                    ]
                    }, 
                            
                    {
                      text : elemento.TELEFONOS_EMPRESA + '\n' + elemento.DIRECCION_EMPRESA + '\n' + 'BARRANQUILLA - ATLANTICO\n',
                      style: 'informacion',              
                    },
                  ]
                },
                '\n',
                {
                  margin: [30, 0, 0, 0],
                  columns: [
                    {
                      style:'tableCliente', 
                      table: {                
                        widths: [75, 190,],
                        body: [
                          [
                            {text:'Cliente:',border: [false, false, false, false],}, 
                            {text:elemento.RAZON_SOCIAL_CLIENTE.toUpperCase(),border: [false, false, false, false]}
                          ],
                          [
                            {text:'Identificacion:',border: [false, false, false, false]}, 
                            {text:elemento.IDENTIFICACION_CLIENTE,border: [false, false, false, false]}
                          ],
                          [
                            {text:'Telefonos:',border: [false, false, false, false]},
                            {text:elemento.TELEFONO_CLIENTE,border: [false, false, false, false]}
                          ],
                          [
                            {text:'Direccion:',border: [false, false, false, false]}, 
                            {text:elemento.DIRECCION_CLIENTE.toUpperCase(),border: [false, false, false, false]}
                          ],
                          [
                            {text:'Ciudad:',border: [false, false, false, false]}, 
                            {text:elemento.CLIUDAD_CLIENTE.toUpperCase(),border: [false, false, false, false]}],
                          [
                            {text:'Vendedor:',border: [false, false, false, false]}, 
                            {text:elemento.NOMBRE_VENDEDOR.toUpperCase(),border: [false, false, false, false]}],
                          [
                            {text:'Establecimiento:',border: [false, false, false, false]}, 
                            {text:elemento.ESTABLECIMIENTO.toUpperCase(),border: [false, false, false, false]}
                          ],
                        ]
                      },
                    },
                    
                    [  
                      {               
                        style:'fact',
                        text : [
                          {
                            text:'FACTURA DE VENTA'
                          },'\n',
                          {
                            text:'No.  ' + elemento.NUMERO_FACTURA.toUpperCase() + '\n', bold:false
                          }
                        ]                  
                      },
                      [ 
                        {        
                          text : 'Cufe: '+ elemento.codigo_cufe, margin:[10,0,0,0]            
                        },
                        {   
                          fontSize:8, margin:[10,0,20,0] ,    
                          text : elemento.RESOLUCION_FACTURA          
                        },
                        '\n',
                      ],
        
                      
                      { 
                        style:'tableEmision',             
                        table: {
                          widths: [58,58,30,77],
                          body: [
                            [
                              {text:'Emision',}, 
                              {text:'Vence',}, 
                              {text:'Plazo',}, 
                              {text:'Orden de compra',},
                            ],
                            [
                              {text:elemento.FECHA_FACTURA,}, 
                              {text:elemento.FECHA_PLAZO_FACTURA,}, 
                              {text:elemento.PLAZO_FACTURA,}, 
                              {text:elemento.ORDEN_COMPRA,}
                            ],                    
                          ]
                        },  
                        
                      },
                    ]
                  ]
                },
                
              ],
              

              content : [
                
                { 
                      
                  style:'tableDetalle',          
                  table: {
                    widths: [43,210,35,39,25,25,54,61],  
                    body: body
                    
                  },  
                  layout: {
                    fillColor: function (rowIndex) {
                      return (rowIndex  == 0) ? '#ccc' : null;
                    },
                    hLineWidth: function (i, node) {
                      return (i === 0 || i === node.table.body.length) ? 0.5 : 0.5;
                    },
                    vLineWidth: function (i, node) {
                      return (i === 0 || i === node.table.widths.length) ? 0.5 : 0.5;
                    },
                    hLineColor: function (i, node) {
                      return (i === 0 || i === node.table.body.length) ? '#ddd' : '#ddd';
                    },
                    vLineColor: function (i, node) {
                      return (i === 0 || i === node.table.widths.length) ? '#ddd' : '#ddd';
                    },             
                    
                  }        
                },
                     
              ],  
        
        
              footer:[        
                {
                columns: [
                  {
                    alignment:'justify',
                    style:'tablaCantidad', 
                    table: {
                      widths: [320], heights: [70, 70],
                      body: [
                        [ 
                          {
                            border: [false, false, false, false],
                            text:[
                              {
                                text:'Cantidades totales: ' 
                              },
                              {
                                text:this.cantidadTotal + '\n'
                              },
                              {
                                text:'SON:\n' + NumerosALetras(elemento.VALOR_NETO_FACTURA)
                              },
                            
                            ] 
                          } 
                        ],
                        
                        [
                          { border: [false, false, false, false],
                            text:[
                              {
                                text:'Observaciones:\n'
                              },
                              {
                                text:elemento.OBSERVACIONES_FACTURA.toUpperCase()
                              },
                            ] 
                          }
                        ],
                      ]
                    },  
                   
                  },
                  { 
                    style:'tablaTotal',
                    table: {
                      widths: [101,101],
                      body: 
                      [
                        ['Valor bruto:',
                          {
                            text:new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', useGrouping: true}).format(elemento.VALOR_DESCUENTO + elemento.VALOR_SUBTOTAL_SIN_IVA)
                          } 
                        ],
                        ['Descuento:', 
                          {
                            text:new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', useGrouping: true}).format(elemento.VALOR_DESCUENTO)
                          }
                        ],
                        ['Subtotal:', 
                          {
                            text:new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', useGrouping: true}).format(elemento.VALOR_SUBTOTAL_SIN_IVA)
                          }
                        ],
                        ['IVA:', 
                          {
                            text:new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', useGrouping: true}).format(elemento.VALOR_IVA)
                          }
                        ],
                        ['Flete:', 
                          {
                            text: new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', useGrouping: true}).format(elemento.VALOR_FLETE)
                          }
                        ],
                        ['Retefuente:', 
                          {
                            text:new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', useGrouping: true}).format(elemento.VALOR_RETENCION_FUENTE)
                          }
                        ],
                        ['Reteica:', 
                          {
                            text: new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', useGrouping: true}).format(elemento.VALOR_RETENCION_ICA)
                          }
                        ],
                        ['Reteiva:', 
                          {
                            text:new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', useGrouping: true}).format(elemento.VALOR_RETENCION_IVA)
                          }
                        ],
                        ['Total:', 
                          {
                            text:new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', useGrouping: true}).format(elemento.VALOR_NETO_FACTURA)  
                          }
                        ],
                      ]
                    },
                                                   
                  }
                ],
              }, 
                {
                  style: 'tableFooter', 
                  table: {
                    widths: [271,271],
                    body: [
                      [{border:[true,true,false,true],                
                        text: [
                        {text: 'La presente factura de venta tiene caracter de titulo valor y se rige por la ley 1231 de julio 17/2008. esta factura causa interes a la tasa maxima legal autorizada por el incumplimiento a la fecha acordada para el pago.'},'\n\n\n\n\n',
                        {text: '____________________________________________________________________________________'},'\n',
                        {text:'NIT / C.C. Nº:'},'\n\n',
                        {text:'Impreso por: ' + elemento.NOMBRE_EMPRESA}
                      ],},
                      {
                        border:[false,true,true,true],
                        text: [
                        {text: 'Certifico que hemos recibido a satisfaccion las mercancias relacionadas en el presente Titulo Valor indicando que lo aceptamos, pero de no presentar reclamos antes de 10 dias calendario a partir de la fecha de recibido del titulo de acuerdo a ley 1231 de 2008.'},'\n\n',
                        {text: 'Para envio nacionales se entiende como aceptacion y radicacion de esta factura el cumplimiento con la firma y sello de la guia de transporte. Se entiende que la persona que firma esta autorizada por el cliente.'},'\n\n',
                        {text:'FECHA RECIBIDO: ___________________________________________________________'},'\n\n',
                        {text:'NOMBRE:                ___________________________________________________________'},'\n\n',
                        {text:'IDENTIFICACION:  ___________________________________________________________'},'\n\n',
                      ],
                      }]
                    ]
                  },
                                              
                }
                
              ],
        
        
              styles : {
                paginado:{
                  fontSize:'8', 
                  alignment:'right',
                  
                },
                informacion: {
                  fontSize: 10,
                  alignment: 'right',
                  italics: 'true',
                  margin: [0, 0, 20, 0]
                },
        
                fact: {
                  fontSize:12,
                  bold:'true', 
                  alignment:'right',
                  margin: [0, 0, 20, 0]
                },
        
                tableCliente: {
                  fontSize:9.5,
                  fillColor:'#ddd'          
                },
                tableEmision:{
                  fontSize:10,
                  alignment:'center',
                  margin: [10, -6, 0, 0],
                },
                tableDetalle: {
                  fontSize:9,
                  margin: [30, 0, 0, 0],
                  alignment:'center',
        
                },
                tablaCantidad: {
                  fontSize:10,
                  margin: [30, 0, 0, 0],
                  fillColor:'#ddd'
                },
                tablaTotal: {
                  fontSize:10,
                  alignment: 'right',
                  margin: [10, 0, 0, 0],
                  fillColor: '#ccc',
                },
                tableFooter: {
                  fontSize:7,
                  margin: [30, 10, 0, 0],
                }
                
              },
             
              images: {
                mySuperImage: `data:image/jpeg;base64,${elemento.LOGO_EMPRESA}`
              }
            } 
            this.spinnerService.hide();
            pdfMake.createPdf(dd).download('factura de venta ' + elemento.NUMERO_FACTURA + '.pdf');
             
        }); 
        this.limpiar(forma)
      },error => {
        this.spinnerService.hide();
        if (error.error.errores.CODIGO_PREFIJO) {
          this.validarPre=true
          this.mensaje=error.error.errores.CODIGO_PREFIJO
        }
        if (error.error.errores.NUMERO_FACTURA_INICIAL) { 
          this.validarIni = true
          this.numeroInicial = error.error.errores.NUMERO_FACTURA_INICIAL 
          console.log(error.error.errores);
        }
        if (error.error.errores.NUMERO_FACTURA_FINAL) { 
          this.validarFin = true
          this.numeroFinal = error.error.errores.NUMERO_FACTURA_FINAL            
        }
          
        
        setTimeout(() => {
          this.validarPre=false
          this.validarIni=false
          this.validarFin=false
        }, 5000);
      })
   }
   
}
