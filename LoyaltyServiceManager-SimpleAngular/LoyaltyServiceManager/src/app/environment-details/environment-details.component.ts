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
import { FileUtil } from '../shared/file.util';
import { TdLoadingService } from '@covalent/core/loading';
import { CommonConstants } from '../shared/CommonConstants';

const DECIMAL_FORMAT: (v: any) => any = (v: number) => v.toFixed(2);
@Component({
  selector: 'app-environment-details',
  templateUrl: './environment-details.component.html',
  styleUrls: ['./environment-details.component.scss']
})
export class EnvironmentDetailsComponent implements OnInit {
  columns: ITdDataTableColumn[] = [
    { name: 'MachineName', label: 'Machine Name',width:100 },
    { name: 'ApplicationName',  label: 'Application Name', width: 350 },
    { name: 'Publisher', label: 'Publisher',  width: 250 },
    { name: 'ApplicationVersion', label: 'Version' ,width:150},
    { name: 'InstalledDate', label: 'Installation Date', width:150 },
  ];

  ServiceOption: string = "false";
  data: any[];
  dataCopy: any[];

  filteredData: any[];
  filteredTotal: number;

  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 10;
  sortBy: string = 'ApplicationName';
  selectedRows: Services[] = [];
  _response: ServiceResponse[]=[];
  _defaultResponse: ServiceResponse = new ServiceResponse();

  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
  headers : Headers
  options : RequestOptions
  MachineName: string='';  
  // @ViewChild('fileImportInput')
  fileImportInput: any;
  
  csvRecords:string = '';
   constructor(private _dataTableService: TdDataTableService,private _http: Http, private _httpCLient: HttpClient,private _fileUtil: FileUtil,private _loadingService: TdLoadingService ) {}

   ngOnInit(): void {
    //this.getEnvironmentDetails();
  }
  getEnvironmentDetails()
  {
    console.log('Get Applications Called')
    this._loadingService.register('stringName1');
    this.data = [];
    this.dataCopy = [];
      this._http.get(CommonConstants.ApiURL + "GetEnvironmentDetails?ServerName")
      .subscribe(response =>
        {
          this.data=  response.json();
          this.dataCopy = response.json();
          this.filter();
          this._loadingService.resolve('stringName1');
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
      newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
      newData = this._dataTableService.filterData(newData, this.searchTerm, true, excludedColumns);
      newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
    this.data = newData;
  }  
}