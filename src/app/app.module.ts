import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AngularMaterialModule } from './shared/angular-material/angular-material.module';
// fake backend
import { fakeBackendProvider } from './_helpers/fake-backend';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { GlobalDataService } from './services/global-data.service';
import { AlertComponent } from './shared/alert/alert.component';
import { AuthGuard } from './guards/auth.guard';
import { AlertService } from './services/alert.service';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';
import { NomenclatorService } from './services/nomenclator.service';

import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './shared/header/header.component';
import { LoginComponent } from './login/login.component';

import { MembriService } from './services/membri.service';
import { DatePersonaleComponent } from './membri/date-personale/date-personale.component';

import { TestComponent } from './test/test.component';
import { Test2Component } from './test2/test2.component';
import { CppComponent } from './membri/cpp/cpp.component';
import { CppsComponent } from './membri/cpps/cpps.component';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    DashboardComponent,
    HeaderComponent,
    LoginComponent,
    DatePersonaleComponent,
    TestComponent,
    Test2Component,
    CppComponent,
    CppsComponent
  ],
  imports: [
    BrowserModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing
  ],
  providers: [
    GlobalDataService,
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    MembriService,
    // fake backend
    fakeBackendProvider,
    MockBackend,
    BaseRequestOptions,
    NomenclatorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
