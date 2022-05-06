import { PaisSmall } from './../interfaces/paises.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {
                          //Solo dejo lo que es la constante, donde empieza a cambiar lo quito
                          //Utilizamos EndPoints de https://restcountries.com/#filter-response
  private baseUrl: string = 'https://restcountries.com/v2';
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones(): string[] {
    return [...this._regiones];  //Lo paso destructurado por si hago modificaciones a la propiedad, nunca modificar _regiones, por eso la hago privada tambien
  }

  constructor( private http: HttpClient ) { }

  getPaisesPorRegion(region: string): Observable<PaisSmall[]> {
    const url: string = `${ this.baseUrl }/region/${ region }?fields=name,alpha3Code`;
    return this.http.get<PaisSmall[]>( url );
  }

}
