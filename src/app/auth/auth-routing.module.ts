import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { AuthPage } from './auth.page';


const routes: Routes = [
  {
    path: '',
    component: AuthPage
  },
  {
    path: 'pick-location',
    loadChildren: () => import('./pick-location/pick-location.module').then( m => m.PickLocationPageModule)
  }
 
  
];

@NgModule({
  imports: [RouterModule.forChild(routes), ],
  exports: [RouterModule],
})
export class AuthPageRoutingModule {}
