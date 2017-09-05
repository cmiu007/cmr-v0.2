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
import { FormValidatorsService } from './services/form-validators.service';
import { FormSetModeService } from './services/form-set-mode.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './shared/header/header.component';
import { LoginComponent } from './login/login.component';

import { MembriService } from './services/membri.service';
import { DatePersonaleComponent } from './membri/date-personale/date-personale.component';

import { TestComponent } from './test/test.component';
import { Test2Component } from './test2/test2.component';
import { CppsComponent } from './membri/cpps/cpps.component';
import { CppListComponent } from './membri/cpps/cpp-list/cpp-list.component';
import { CppItemComponent } from './membri/cpps/cpp-item/cpp-item.component';
import { ContactComponent } from './membri/contact/contact.component';
import { EmailComponent } from './membri/contact/email/email.component';
import { AdresaComponent } from './membri/contact/adresa/adresa.component';
import { AdreseListComponent } from './membri/contact/adrese-list/adrese-list.component';

import { CppResolve } from './shared/resolvers/cpp.resolver';
import { JudetResolve } from './shared/resolvers/judet.resolver';
import { TaraResolve } from './shared/resolvers/tara.resolver';



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
    CppsComponent,
    CppListComponent,
    CppItemComponent,
    ContactComponent,
    EmailComponent,
    AdresaComponent,
    AdreseListComponent
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
    // fake backend
    fakeBackendProvider,
    MockBackend,
    BaseRequestOptions,
    GlobalDataService,
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    MembriService,
    NomenclatorService,
    CppResolve,
    JudetResolve,
    TaraResolve,
    FormValidatorsService,
    FormSetModeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
