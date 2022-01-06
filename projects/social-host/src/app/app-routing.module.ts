import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnterpriseComponent } from './controls/enterprise/enterprise.component';
import { HomeComponent } from './controls/home/home.component';
import { ProjectsComponent } from './controls/projects/projects.component';
import { RoutesComponent } from './controls/routes/routes.component';
import { SettingsComponent } from './controls/settings/settings.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'enterprises', component: EnterpriseComponent},
  { path: 'projects', component: ProjectsComponent },
  { path: 'routes', component: RoutesComponent},
  { path: 'settings', component: SettingsComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }