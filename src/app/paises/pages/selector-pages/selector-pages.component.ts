import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';

import { PaisesService } from './../../services/paises.service';
import { PaisSmall } from './../../interfaces/paises.interface';

@Component({
  selector: 'app-selector-pages',
  templateUrl: './selector-pages.component.html',
  styleUrls: ['./selector-pages.component.css']
})
export class SelectorPagesComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required]
  });

  //PARA LLENAR SELECTORES
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: string[] = [];

  //UI
  cargando: boolean = false;

  constructor( private fb: FormBuilder,
               private paisesService: PaisesService ) { }

  ngOnInit() {
    this.regiones = this.paisesService.regiones;
    //console.log("regiones tiene ", this.regiones);

    //PRIMER MANERA DE OBTENER VALORES DEL SELECTOR Y SUSCRIBIRSE DESPUES AL SERVICIO PARA TENER SUS VALORES
    //OBTENGO EXACTAMENTE EL CAMPO "region" CUANDO TIENE ALGUN CAMBIO
    /* this.miFormulario.get('region').valueChanges  
      .subscribe( region => {
        console.log(region);
        this.paisesService.getPaisesPorRegion(region)
          .subscribe( res => {
            this.paises = res;
            console.log("Mi arreglo de paises tiene como respuesta de http ", this.paises);
          })
    }) */

    //SEGUNDA MANERA DE REALIZARLO, QUIZA MAS COMMPRENSIBLE CON USO DE LIBRERIA "rxjs/operators"
    this.miFormulario.get('region').valueChanges 
    .pipe(
      tap( (_) => {   //La nomenclatura "(_)" quiere decir que no me importa lo que regrese, en este caso regresaria la "region" seleccionada
        this.cargando = true;
        this.miFormulario.get('pais').reset('');      //No me interesa lo que regrese por que solo quiero resetear ese campo de mi formulario cuando region tenga algun cambio
      }),
      switchMap( region => this.paisesService.getPaisesPorRegion(region) )
    )
    .subscribe( pais => {
      console.log(pais);
      this.cargando = false;
      this.paises = pais;
    });


    //CADA QUE CAMBIE "pais" regresame su valor, el valor lo establecio en el HTML "value"
    this.miFormulario.get('pais').valueChanges
    .pipe(
      tap( () => {   //Otras manera de decir que no me importa el argumento
        this.fronteras = [];
        this.cargando = true;
        this.miFormulario.get('frontera').reset('');      //Ahora reseteo el valor de "frontera" cuando cambie "pais"
      }),
      switchMap( codigo => this.paisesService.getPaisPorCodigo(codigo) )
    )
    .subscribe( res  => {
      if(res === null){   //Por si tiene null mi respuesta no de error el programa
        this.cargando = false;
        return;
      }
      if(res[0].borders === undefined){   //Quiere decir que no tiene borders o "FRONTERAS" el pais seleccionado
        this.fronteras = ['No tiene fronteras'];
        this.cargando = false;
        return;
      }
        console.log("respuesta del servicio getPaisPorCodigo ", res);
        this.fronteras = res[0].borders;
        this.cargando = false;
        console.log("arreglo fronteras tiene ", this.fronteras);
    });




  }

  guardar() {
    console.log("Mi formulario value tiene, ", this.miFormulario.value);
  }

}
