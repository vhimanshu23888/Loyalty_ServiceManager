import { RouterModule, Routes } from '@angular/router';
import {TestDatatableComponent} from './test-datatable/test-datatable.component';
import { HomeComponent }     from './home/home.component';

const app_routes: Routes = [
  { path: '',  pathMatch:'full', redirectTo: '/home' },
  { path: 'home',  component: HomeComponent },
  { path: 'services', component: TestDatatableComponent }];

export const app_routing = RouterModule.forRoot(app_routes);