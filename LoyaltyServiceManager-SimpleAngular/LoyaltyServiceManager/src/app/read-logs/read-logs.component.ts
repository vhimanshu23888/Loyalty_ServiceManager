import { Component, OnInit } from '@angular/core';
import { TdLoadingService } from '@covalent/core/loading';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { CommonConstants } from '../shared/CommonConstants';

@Component({
  selector: 'app-read-logs',
  templateUrl: './read-logs.component.html',
  styleUrls: ['./read-logs.component.css']
})
export class ReadLogsComponent implements OnInit {
LogData:string =''
  constructor( private _http: Http, private _httpCLient: HttpClient,private _loadingService: TdLoadingService) { }

  ngOnInit(): void {
    this._loadingService.register('stringName');
    this.ReadLogs();
  }
  ReadLogs() 
  {
    this._http.get(CommonConstants.ApiURL + "GetLogs")
        .subscribe(response => {
          this.LogData = response.json();
          this._loadingService.resolve('stringName');
        });
    }

}
