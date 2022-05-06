import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    pais: ['', Validators.required]
  });

  //Llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];

  constructor( private fb: FormBuilder,
               private paisesService: PaisesService ) { }

  ngOnInit() {
    this.regiones = this.paisesService.regiones;
    console.log("regiones tiene ", this.regiones);

    //OBTENGO EXACTAMENTE EL CAMPO "region" CUANDO TIENE ALGUN CAMBIO
    this.miFormulario.get('region').valueChanges  
      .subscribe( region => {
        console.log(region);
        this.paisesService.getPaisesPorRegion(region)
          .subscribe( res => {
            this.paises = res;
            console.log("Mi arreglo de paises tiene como respuesta de http ", this.paises);
          })
    })
  }

  guardar() {
    console.log("Mi formulario value tiene, ", this.miFormulario.value);
  }

}
