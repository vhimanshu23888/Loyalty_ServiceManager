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
  //apiUrl : string = "http://localhost/Service_Manager_API/api/service";

  filteredData: any[];
  filteredTotal: number;

  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 50;
  sortBy: string = 'ApplicationName';
  selectedRows: Services[] = [];
  _response: ServiceResponse[]=[];
  _defaultResponse: ServiceResponse = new ServiceResponse();

  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
  headers : Headers
  options : RequestOptions
  MachineName: string='';

  //keep the flag true if csv contains header else not, this falg will help in validations.
  static isHeaderPresentFlag = true; 
 
  //keep the flag true if you want to validate each records length to match with header length, false otherwise.
  static validateHeaderAndRecordLengthFlag = true;
   
  //keep the flag true if you want file with only .csv extensions should be read, false otherwise.
  static valildateFileExtenstionFlag = true;
  
  static tokenDelimeter = ",";
  
  // @ViewChild('fileImportInput')
  fileImportInput: any;
  
  csvRecords:string = '';
   constructor(private _dataTableService: TdDataTableService,private _http: Http, private _httpCLient: HttpClient,private _fileUtil: FileUtil,private _loadingService: TdLoadingService ) {}

   ngOnInit(): void {
    this._defaultResponse.ErrorMessage = "";
    this._response[0] = this._defaultResponse;
    //this.getEnvironmentDetails();
  }
  getEnvironmentDetails()
  {
    console.log('Get Applications Called')
    this._loadingService.register('stringName1');
    this.data = [];
      this._http.get(CommonConstants.ApiURL + "GetEnvironmentDetails?ServerName")
      .subscribe(response =>
        {
          this.data=  response.json();
          this.filter();
          this._loadingService.resolve('stringName1');
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

  // METHOD CALLED WHEN CSV FILE IS IMPORTED
fileChangeListener($event): void {

  var text = [];
  var files = $event.srcElement.files;

  if(EnvironmentDetailsComponent.validateHeaderAndRecordLengthFlag){
    if(!this._fileUtil.isCSVFile(files[0])){
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  var input = $event.target;
  var reader = new FileReader();
  reader.readAsText(input.files[0]);
  reader.onloadend = function(){
    alert('Read Ended')
  }
  
  reader.onloadend =  (data: any) => {
    
    let csvData = data.target.result;
    let csvRecordsArray = csvData.split(/\r\n|\n/);

    var headerLength = -1;
    if(EnvironmentDetailsComponent.isHeaderPresentFlag){
      let headersRow = this._fileUtil.getHeaderArray(csvRecordsArray, EnvironmentDetailsComponent.tokenDelimeter);
      headerLength = headersRow.length; 
    }
     
    this.csvRecords = this._fileUtil.getDataRecordsArrayFromCSVFile(csvRecordsArray, 
        headerLength, EnvironmentDetailsComponent.validateHeaderAndRecordLengthFlag, EnvironmentDetailsComponent.tokenDelimeter);
     console.log(this.csvRecords)
    if(this.csvRecords == null){
      this.fileReset();
    }
  }

  reader.onerror = function () {
    alert('Unable to read ' + input.files[0]);
  };
};

fileReset(){
  // this.fileImportInput.nativeElement.value = "";
  // this.csvRecords = '';
}
  
}