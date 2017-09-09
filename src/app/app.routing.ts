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
import { ReflectorComponent } from './shared/reflector/reflector.component';


const appRoutes: Routes = [
  {path: '', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'reflector', component: ReflectorComponent, canActivate: [AuthGuard]},
  {path: 'membri', canActivate: [AuthGuard], children: [
    {path: 'nou', component: DatePersonaleComponent },
    {path: ':id/datepersonale', component: DatePersonaleComponent },
    {path: ':id/cpp', component: CppsComponent, resolve: {regCpp: CppResolve} },
    {path: ':id/contact', component: ContactComponent, resolve: {regTara: TaraResolve, regJud: JudetResolve}}
  ]},
  {path: 'login', component: LoginComponent},
  {path: 'test', component: TestComponent},
  {path: 'test2', component: Test2Component, resolve: {regCpp: CppResolve}},
  {path: '**', redirectTo: ''}
];

export const routing = RouterModule.forRoot(appRoutes);
