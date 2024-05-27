import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'manage-patients',
    loadChildren: () => import('./manage-patients/manage-patients.module').then( m => m.ManagePatientsPageModule)
  },
  {
    path: 'manage-departments',
    loadChildren: () => import('./manage-departments/manage-departments.module').then( m => m.ManageDepartmentsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
