import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { DatePersonaleComponent } from './membri/date-personale/date-personale.component';
import { CppsComponent } from './membri/cpps/cpps.component';

import { TestComponent } from './test/test.component';
import { Test2Component } from './test2/test2.component';
import { ContactComponent } from './membri/contact/contact.component';

import { CppResolve } from './shared/resolvers/cpp.resolver';
import { JudetResolve } from './shared/resolvers/judet.resolver';
import { TaraResolve  } from './shared/resolvers/tara.resolver';
import { AsiguratoriResolve } from './shared/resolvers/asigurator.resolver';
import { ReflectorComponent } from './shared/reflector/reflector.component';
import { AvizariComponent } from './membri/avizari/avizari.component';
import { FacResolve } from './shared/resolvers/fac.resolver';
import { CertificateComponent } from './membri/certificate/certificate.component';
import { TitluriProfesionaleComponent } from './membri/titluri-profesionale/titluri-profesionale.component';
import { TitluriResolve } from './shared/resolvers/titluri.resolver';


const appRoutes: Routes = [
  {path: '', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'reflector', component: ReflectorComponent, canActivate: [AuthGuard]},
  {path: 'membri', canActivate: [AuthGuard], children: [
    {path: 'nou', component: DatePersonaleComponent, resolve: {regTara: TaraResolve, regJud: JudetResolve, regFac: FacResolve} },
    {path: ':id/datepersonale', component: DatePersonaleComponent,
        resolve: {regTara: TaraResolve, regJud: JudetResolve, regFac: FacResolve} },
    {path: ':id/cpp', component: CppsComponent, resolve: {regCpp: CppResolve} },
    // tslint:disable-next-line:max-line-length
    // {path: ':id/titluri-profesionale', component: TitluriProfesionaleComponent, resolve: {regFac: FacResolve, regTitluri: TitluriResolve} },
    {path: ':id/contact', component: ContactComponent, resolve: {regTara: TaraResolve, regJud: JudetResolve}},
    {path: ':id/avizari', component: AvizariComponent, resolve: {regAsiguratori: AsiguratoriResolve }},
    {path: ':id/certificate', component: CertificateComponent}
  ]},
  {path: 'login', component: LoginComponent},
  {path: 'test', component: TestComponent},
  {path: 'test2', component: Test2Component, resolve: {regCpp: CppResolve}},
  {path: '**', redirectTo: ''}
];

export const routing = RouterModule.forRoot(appRoutes);
