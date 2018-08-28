import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {Http} from '@angular/http';
import { Services } from '../shared/services';
@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  Services : Observable<Services[]>
  //_http: Http
  apiUrl : string = "http://localhost:18522/api/service?MachineName=l43611";
  constructor(private _http: Http) {  
  } 

  ngOnInit() {
    this.getServices();
  }
  getServices()
  {
      return this._http.get(this.apiUrl)
      .subscribe(response =>this.Services=  response.json());
  }
  UpdateService()
  {
    alert('Update Service');
  }
}

