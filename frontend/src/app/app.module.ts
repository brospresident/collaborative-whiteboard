import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './components/auth/auth.component';

import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DrawerComponent } from './components/drawer/drawer.component';
import { ProjectComponent } from './components/project/project.component';
import { IconsComponent } from './components/icons/icons.component';
import { InvitationModalComponent } from './components/invitation-modal/invitation-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    DashboardComponent,
    SidebarComponent,
    DrawerComponent,
    ProjectComponent,
    IconsComponent,
    InvitationModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
