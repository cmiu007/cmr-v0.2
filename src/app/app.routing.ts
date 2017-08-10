import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { DatePersonaleComponent } from './membri/date-personale/date-personale.component';
import { CppComponent } from './membri/cpp/cpp.component';
import { CppsComponent } from './membri/cpps/cpps.component';

import { TestComponent } from './test/test.component';
import { Test2Component } from './test2/test2.component';


const appRoutes: Routes = [
  {path: '', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'membri', canActivate: [AuthGuard], children: [
    {path: 'nou', component: DatePersonaleComponent },
    {path: ':id/datepersonale', component: DatePersonaleComponent },
    {path: ':id/cpp', component: CppComponent },
    {path: ':id/cpp2', component: CppsComponent }
  ]},
  {path: 'login', component: LoginComponent},
  {path: 'test', component: TestComponent},
  {path: 'test2', component: Test2Component},
  {path: '**', redirectTo: ''}
];

export const routing = RouterModule.forRoot(appRoutes);
