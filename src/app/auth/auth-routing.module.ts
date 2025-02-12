import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { SignaturepadComponent } from './signaturepad/signaturepad.component';
import { guardGuard } from '../guard.guard';
const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
     // { path: 'Signaturepad', component: SignaturepadComponent },
      {
        path: 'Signaturepad',
        component: SignaturepadComponent,
        canDeactivate: [guardGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
