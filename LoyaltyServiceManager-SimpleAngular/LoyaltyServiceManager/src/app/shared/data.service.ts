import { Injectable } from '@angular/core';
import {Services} from './services';
import {Http,Headers,RequestOptions, Response} from '@angular/http';
//import 'rxjs/Rx'; //get everything from Rx
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';
//import { Observable } from 'rxjs';
@Injectable()
export class DataService {
    
    apiUrl : string = "http://localhost:18522/api/service?MachineName=l43611";
    constructor(private _http:Http) { }
    
    getProjectName() {
        return 'Oasis Loyalty Service Manager ';
    }
  //  getTasks(): any {
       // return [        
      //  {'Id':'1','Title':'Go to Market 99','Status':'done'},
      //  {'Id':'2','Title':'Email to manager','Status':'pending'},
      //  {'Id':'3','Title':'Push code to GitHub','Status':'done'},
      //  {'Id':'4','Title':'Go for running','Status':'done'},
      //  {'Id':'5','Title':'Go to movie','Status':'pending'},
   // ]
  //  }
  
  // getServices(){
  //     return this._http.get(this.apiUrl)
  //     .subscribe((response) => response.json());
  // }

  // editTask(service:Services){
  //      let body = JSON.stringify(service);
  //      console.log("in service");
  //      console.log(body);
  //      let headers = new Headers({ 'Content-Type': 'application/json' });
  //      let options = new RequestOptions({ headers: headers });
  //      return this._http.put(this.apiUrl,body, options)
  //                    .map(this.extractData);                    
  // }

  private extractData(res: Response) {
  let body = res.json();
  return body.data || { };
}



}