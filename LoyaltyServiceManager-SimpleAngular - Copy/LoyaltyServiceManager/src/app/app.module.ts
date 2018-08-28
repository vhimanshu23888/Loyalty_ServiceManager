import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule} from '@angular/http';
import {HttpClient, HttpClientModule } from '@angular/common/http';

import { AppComponent }  from './app.component';
import { HomeComponent } from './home/home.component';
import {ServicesComponent} from './services/services.component';

import { app_routing } from './app.routing';
import { DataService } from './shared/data.service';
import { CovalentLayoutModule } from '@covalent/core/layout';
import { CovalentStepsModule  } from '@covalent/core/steps';
import { TestDatatableComponent } from './test-datatable/test-datatable.component';
import { CovalentSearchModule } from '@covalent/core';
import { CovalentDataTableModule } from '@covalent/core/data-table';
import { CovalentMediaModule } from '@covalent/core/media';


import {MatDividerModule} from '@angular/material/divider';
import { CovalentPagingModule } from '@covalent/core';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatRadioModule} from '@angular/material/radio';

@NgModule({

  imports:      [ BrowserModule, FormsModule, HttpModule,HttpClientModule, app_routing,CovalentLayoutModule,
                  CovalentStepsModule,CovalentSearchModule,CovalentDataTableModule,MatDividerModule,
                  CovalentPagingModule,MatSelectModule,BrowserAnimationsModule,MatIconModule,
                  MatListModule,MatInputModule, MatToolbarModule,CovalentMediaModule,MatButtonModule, MatCardModule,MatRadioModule ],
  declarations: [ AppComponent,ServicesComponent, HomeComponent, TestDatatableComponent],
  providers:    [ DataService ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }