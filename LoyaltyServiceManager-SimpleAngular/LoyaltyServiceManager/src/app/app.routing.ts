import { RouterModule, Routes } from '@angular/router';
import { TestDatatableComponent } from './test-datatable/test-datatable.component';
import { HomeComponent } from './home/home.component';
import { EnvironmentDetailsComponent } from './environment-details/environment-details.component';
import { UploadServersComponent } from './upload-servers/upload-servers.component';
import { ReadLogsComponent } from './read-logs/read-logs.component';

const app_routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home', component: HomeComponent, children: [
      { path: 'services', component: TestDatatableComponent },
      { path: 'applications', component: EnvironmentDetailsComponent },
      { path: 'upload', component: UploadServersComponent },
      { path: 'readlogs', component: ReadLogsComponent }

    ]
  }
]
export const app_routing = RouterModule.forRoot(app_routes);