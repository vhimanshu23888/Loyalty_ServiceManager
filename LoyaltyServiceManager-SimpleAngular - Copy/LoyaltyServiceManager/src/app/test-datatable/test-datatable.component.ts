import { Component, OnInit } from '@angular/core';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core/data-table';
import { IPageChangeEvent } from '@covalent/core/paging';
import { Observable, of } from 'rxjs';
import {Http,Headers,RequestMethod,Response, RequestOptions} from '@angular/http';
import { Services } from '../shared/services';
import { ServiceResponse } from '../shared/Response';
import { HttpHeaders,HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import {MatRadioModule} from '@angular/material/radio';

const DECIMAL_FORMAT: (v: any) => any = (v: number) => v.toFixed(2);
@Component({
  selector: 'app-test-datatable',
  templateUrl: './test-datatable.component.html',
  styleUrls: ['./test-datatable.component.scss']
})
export class TestDatatableComponent implements OnInit {
  columns: ITdDataTableColumn[] = [
    { name: 'ServiceName',  label: 'Service Name', width: 250 },
    { name: 'ServiceStatus', label: 'Service Status' ,width:150},
    { name: 'MachineName', label: 'Machine Name', hidden: false,width:200 },
    { name: 'DisplayName', label: 'Detailed Name',  width: 350 },
    { name: 'IsWebService', label: 'IsWebService',width:150},
    {name: 'StatusToBeUpdated', label: 'Start Service',width:150},
    {name: 'StatusToBeUpdated1', label: 'Stop Service',width:150},
    {name: 'StatusToBeUpdated2', label: 'Pause Service',width:160},
    {name: 'StatusToBeUpdated3', label: 'Restart Service',width:160},
  ];
  ServiceOption: string = "false";
  data: any[];
  apiUrl : string = "http://localhost:8080/api/service";

  filteredData: any[];
  filteredTotal: number;

  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 50;
  sortBy: string = 'ServiceName';
  selectedRows: Services[] = [];
  _response: ServiceResponse[]=[];
  _defaultResponse: ServiceResponse = new ServiceResponse();

  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
  headers : Headers
  options : RequestOptions
  MachineName: string='';
  fileImportInput: any;

  csvRecords = [];
   constructor(private _dataTableService: TdDataTableService,private _http: Http, private _httpCLient: HttpClient) {}

  ngOnInit(): void {
    this._defaultResponse.ErrorMessage = "";
    this._response[0] = this._defaultResponse;
console.log("Service Called")
  }
  getServices()
  {
    if(this.ServiceOption == "true" && this.MachineName == '')
    {
        alert('Server Name is Mandatory');
        return;
    }
    else if(this.ServiceOption == "true" && this.MachineName != '')
    {
      return this._http.get(this.apiUrl + "?MachineName=" + this.MachineName)
      .subscribe(response =>this.data=  response.json());
    }
    else
    {
      return this._http.get(this.apiUrl)
      .subscribe(response =>this.data =  response.json());
    }
  }
  // Update()
  // {}
  Update(Status: number)
  {
    // alert(this.apiUrl)
    this.selectedRows[0].StatusToBeUpdated = Status;
    this.headers = new Headers({ 'Content-Type': 'application/json'}); 
    var requestOptions = new RequestOptions({ method: RequestMethod.Put, headers: this.headers });
    var body = JSON.stringify(this.selectedRows);
    console.log(this.apiUrl + " - " + body);
   return this._http.put(this.apiUrl,body,requestOptions)
    .subscribe(response =>
      {
        this._response=  response.json()
        this.getServices();
      });
  }
  
  private extractData(res: Response) {
    let body = res.json();
    return body || {};
}
  sort(sortEvent: ITdDataTableSortChangeEvent): void {
    this.sortBy = sortEvent.name;
    this.sortOrder = sortEvent.order;
    this.filter();
  }

  search(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filter();
  }

  page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.filter();
  }

  showAlert(event: any): void {
    let row: any = event.row;
    // .. do something with event.row
  }

  filter(): void {
    let newData: any[] = this.data;
    let excludedColumns: string[] = this.columns
    .filter((column: ITdDataTableColumn) => {
      return ((column.filter === undefined && column.hidden === true) ||
              (column.filter !== undefined && column.filter === false));
    }).map((column: ITdDataTableColumn) => {
      return column.name;
    });
    newData = this._dataTableService.filterData(newData, this.searchTerm, true, excludedColumns);
    this.filteredTotal = newData.length;
    newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
    newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    this.data = newData;
  }
  
}