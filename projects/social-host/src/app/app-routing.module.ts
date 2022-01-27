import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationsComponent } from './controls/applications/applications.component';
import { EnterpriseComponent } from './controls/enterprise/enterprise.component';
import { ProjectsComponent } from './controls/projects/projects.component';
import { RoutesComponent } from './controls/routes/routes.component';

const routes: Routes = [
  { path: 'applications/:appLookup/:projectLookup', component: ApplicationsComponent },
  { path: 'enterprises', component: EnterpriseComponent },
  { path: 'projects/:projectLookup', component: ProjectsComponent },
  { path: 'routes/:appRoute/:projectLookup', component: RoutesComponent },
  { path: '', redirectTo: 'enterprises', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
