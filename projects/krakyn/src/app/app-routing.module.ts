import { KrakynToolComponent } from './elements/krakyn-tool/krakyn-tool.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'krakyn', component: KrakynToolComponent },
  { path: '', redirectTo: 'krakyn', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
