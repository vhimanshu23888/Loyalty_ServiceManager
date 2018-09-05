import { Component, OnInit } from '@angular/core';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core/data-table';
import { IPageChangeEvent } from '@covalent/core/paging';
import { Observable, of } from 'rxjs';
import { Http, Headers, RequestMethod, Response, RequestOptions } from '@angular/http';
import { Services } from '../shared/services';
import { ServiceResponse } from '../shared/Response';
import { CommonConstants } from '../shared/CommonConstants';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { MatRadioModule } from '@angular/material/radio';
import { debug } from 'util';
import { TdLoadingService } from '@covalent/core/loading';
const DECIMAL_FORMAT: (v: any) => any = (v: number) => v.toFixed(2);
@Component({
  selector: 'app-test-datatable',
  templateUrl: './test-datatable.component.html',
  styleUrls: ['./test-datatable.component.scss']
})
export class TestDatatableComponent implements OnInit {
  columns: ITdDataTableColumn[] = [
    { name: 'ServiceName', label: 'Service Name', width: 250,sortable: true },
    { name: 'ServiceStatus', label: 'Service Status', width: 150,sortable: true },
    { name: 'MachineName', label: 'Machine Name', hidden: false, width: 200,sortable: true },
    { name: 'DisplayName', label: 'Detailed Name', width: 350,sortable: true },
    { name: 'IsWebService', label: 'ServiceType', width: 150,sortable: true },
    { name: 'StatusToBeUpdated', label: 'Start Service', width: 150,filter:false },
    { name: 'StatusToBeUpdated1', label: 'Stop Service', width: 150,filter:false }
  ];
  ServiceOption: string = "false";
  data: any[];
  dataCopy: any[];
  now: Date;
  filteredData: any[];
  filteredTotal: number;

  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 10;
  sortBy: string = 'ServiceName';
  selectedRows: Services[] = [];
  _response: ServiceResponse[] = [];
  _defaultResponse: ServiceResponse = new ServiceResponse();

  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
  headers: Headers
  options: RequestOptions
  MachineName: string = '';
  constructor(private _dataTableService: TdDataTableService, private _http: Http, private _httpCLient: HttpClient,private _loadingService: TdLoadingService) { }

  ngOnInit(): void {
    this._defaultResponse.ErrorMessage = "";
    this._response[0] = this._defaultResponse;
    console.log("Service Called")
   // this.getServices();
  }
  getServices() 
  {
    this._loadingService.register('stringName');
    this.now = new Date();
    this.data = [];
    this.dataCopy =[];
    console.log(this.now)
    if (this.ServiceOption == "true" && this.MachineName == '') {
      alert('Server Name is Mandatory');
    }
    else if (this.ServiceOption == "true" && this.MachineName != '') {
      this._http.get(CommonConstants.ApiURL + "GetAllServicesByMachineName?MachineName=" + this.MachineName)
        .subscribe(response => {
          this.data = response.json();
          this.dataCopy = response.json();
          this._loadingService.resolve('stringName');
          this.filter();
        });
    }
    else {
      this._http.get(CommonConstants.ApiURL + "GetConfiguredServices")
        .subscribe(response => {
          this.data = response.json();
          this.dataCopy = response.json();
          this._loadingService.resolve('stringName');
          this.filter();
        });
    }
  }
  // Update()
  // {}
  Update(Status: number) {
    // alert(this.apiUrl)
    this.selectedRows[0].StatusToBeUpdated = Status;
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    var requestOptions = new RequestOptions({ method: RequestMethod.Put, headers: this.headers });
    var body = JSON.stringify(this.selectedRows);
    console.log(CommonConstants.ApiURL + " - " + body);
    return this._http.put(CommonConstants.ApiURL + "PutUpdateServiceStatus", body, requestOptions)
      .subscribe(response => {
        this._response = response.json()
        this.getServices();
      });
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
    //alert(pagingEvent.fromRow +" - " + pagingEvent.page + " - " + pagingEvent.pageSize)
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
    let newData: any[] = this.dataCopy;
    this.filteredTotal = newData.length;
    let excludedColumns: string[] = this.columns
      .filter((column: ITdDataTableColumn) => {
        return ((column.filter === undefined && column.hidden === true) ||
          (column.filter !== undefined && column.filter === false));
      }).map((column: ITdDataTableColumn) => {
        return column.name;
      });
      newData = this._dataTableService.filterData(newData, this.searchTerm, true, excludedColumns);
      newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
      newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
    this.data = newData;
  }

  
}