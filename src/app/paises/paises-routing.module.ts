import { SelectorPagesComponent } from './pages/selector-pages/selector-pages.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'selectores', component: SelectorPagesComponent },
      { path: '**', redirectTo: 'selectores' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaisesRoutingModule { }
