import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './components/auth/auth.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DrawerComponent } from './componnents/drawer/drawer.component';

const routes: Routes = [
  {path: 'auth', component: AuthComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'canvas', component: DrawerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
