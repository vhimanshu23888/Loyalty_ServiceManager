import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestMethod, RequestOptions} from '@angular/http';
import { CommonConstants } from '../shared/CommonConstants';
import { EnvironmentMaster } from '../shared/EnvironmentMaster.Model';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn, ITdDataTableRowClickEvent } from '@covalent/core/data-table';
import { IPageChangeEvent } from '@covalent/core';
import { TdLoadingService } from '@covalent/core/loading';
@Component({
  selector: 'app-environment-master',
  templateUrl: './environment-master.component.html',
  styleUrls: ['./environment-master.component.scss']
})
export class EnvironmentMasterComponent implements OnInit {


  columns: ITdDataTableColumn[] = [
    { name: 'EnvironmentID', label: 'EnvironmentID', width: 100,sortable: false },
    { name: 'EnvironmentName', label: 'Environment Name', width: 250,sortable: true },
    { name: 'Active', label: 'IsActive', width:150,hidden:true}
  ];

  headers: Headers
  options: RequestOptions
  _environmentMaster: EnvironmentMaster = new EnvironmentMaster();
  _environmentName: string
  _response: string;
  _getResponse:EnvironmentMaster;
  _getallResponse:EnvironmentMaster[];
  dataCopy: EnvironmentMaster[];
  now: Date;
  filteredData: any[];
  filteredTotal: number;
  isUpdate: boolean = false;
  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 10;
  sortBy: string = 'EnvironmentName';
  selectedRows: EnvironmentMaster[] = [];
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;

  constructor(private _http: Http,private _dataTableService: TdDataTableService,private _loadingService: TdLoadingService) { }

  ngOnInit() {
    // this.getAllEnvironments();
    // this.filter();
  }


  InsertEnvironmentMaster() {
    // alert(this.apiUrl)
    this.headers = new Headers({ 'Content-Type': 'application/json' });

    if(!this.isUpdate)
    {
    var requestOptions = new RequestOptions({ method: RequestMethod.Post, headers: this.headers });
    this._environmentMaster.EnvironmentName = this._environmentName;
    this._environmentMaster.Active = true;
    var body = JSON.stringify(this._environmentMaster);
    console.log(CommonConstants.ApiURL + " - " + body);
    
    this._http.post(CommonConstants.ApiURL + "PostEnvironmentMaster", body, requestOptions)
      .subscribe(response => {
        this._response = response.json();
        this.getAllEnvironments();
        this.isUpdate = false;
        this._environmentName='' 
      });
    }
    else
    {
      this._environmentMaster.EnvironmentName = this._environmentName;
      this._environmentMaster.Active = true;
      var body = JSON.stringify(this._environmentMaster);
      var requestOptions = new RequestOptions({ method: RequestMethod.Put, headers: this.headers });
      this._http.put(CommonConstants.ApiURL + "PutEnvironmentMaster", body, requestOptions)
        .subscribe(response => {
          this._response = response.json();
          this.getAllEnvironments();
          this.isUpdate = false;
          this._environmentName='' 
        });
      } 
  }
  getEnvironment(ServerTypeName:string){
    this._loadingService.register('stringName');
    if(ServerTypeName=='')
    {
      alert('Select ServerType to update');
      this._loadingService.resolve('stringName');
      return;
    }
    else
    {
      return this._http.get(CommonConstants.ApiURL + "GetAllEnvironmentNames?EnvironmentName=" + ServerTypeName)
      .subscribe(response => {
        this._getResponse = response.json();  
        this._loadingService.resolve('stringName');      
      });
    }
  }
    getAllEnvironments(){
      this._loadingService.register('stringName');
        return this._http.get(CommonConstants.ApiURL + "GetAllEnvironmentNames?EnvironmentName=")
        .subscribe(response => {
          this._getallResponse = response.json();
          this.dataCopy = response.json();
          this.filter();   
          this._loadingService.resolve('stringName');   
        });
  }
  search(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filter();
  }
  sort(sortEvent: ITdDataTableSortChangeEvent): void {
    this.sortBy = sortEvent.name;
    this.sortOrder = sortEvent.order;
    this.filter();
  }
  page(pagingEvent: IPageChangeEvent): void {
    //alert(pagingEvent.fromRow +" - " + pagingEvent.page + " - " + pagingEvent.pageSize)
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.filter();
  }

  showAlert(event: ITdDataTableRowClickEvent): void {
    this.isUpdate = true;
    this._environmentMaster = event.row
    this._environmentName = this._environmentMaster.EnvironmentName;
  }

  filter(): void {
    let newData: EnvironmentMaster[] = this.dataCopy;
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
    this._getallResponse = newData;
  }
}