import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestMethod, RequestOptions} from '@angular/http';
import { CommonConstants } from '../shared/CommonConstants';
import { EnvironmentMaster } from '../shared/EnvironmentMaster.Model';
import { ServerMaster } from '../shared/ServerMaster.Model';
import { ServerTypeMaster } from '../shared/ServerTypeMaster.Model';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn, ITdDataTableRowClickEvent } from '@covalent/core/data-table';
import { IPageChangeEvent } from '@covalent/core';
import { TdLoadingService } from '@covalent/core/loading';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-server-master',
  templateUrl: './server-master.component.html',
  styleUrls: ['./server-master.component.scss']
})
export class ServerMasterComponent implements OnInit {

  columns: ITdDataTableColumn[] = [
    { name: 'ServerID', label: 'ServerID', width: 100,sortable: true },
    { name: 'ServerName', label: 'Server Name', width: 250,sortable: true },
    { name: 'ServerIP', label: 'Server IP', width: 250,sortable: true },
    { name: 'EnvironmentName', label: 'Environment Name', width: 250,sortable: true },
    { name: 'ServerTypeName', label: 'ServerType Name', width: 250,sortable: true },
    { name: 'Active', label: 'Is Active', hidden: true, width: 100,sortable: false }
  ];

  headers: Headers
  options: RequestOptions
  _serverMaster: ServerMaster = new ServerMaster();
  _serverName: string;
  _selectedEnvironment: string ='';
  _selectedServerType: string ='';
  _serverIP:string='';
  _response: string;
  _getResponse:ServerMaster;
  _getallEnvironmentsResponse:EnvironmentMaster[];
  _getallServerTypeResponse: ServerTypeMaster[];
  _getallServerMasterResponse: ServerMaster[];
  dataCopy: ServerMaster[];
  now: Date;
  filteredData: any[];
  filteredTotal: number;
  isUpdate: boolean = false;
  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 10;
  sortBy: string = 'ServerName';
  selectedRows: ServerMaster[] = [];
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;

  constructor(private _http: Http,private _dataTableService: TdDataTableService,private _loadingService: TdLoadingService) { }

  ngOnInit() {
    // this.getAllEnvironments();
    // this.filter();
  }
  InitializePage()
  {
    this.getAllServers();
    this.getAllServerTypes();
    this.getAllEnvironments();
  }

  InsertServerMaster() {
    // alert(this.apiUrl)
    this.headers = new Headers({ 'Content-Type': 'application/json' });

    if(!this.isUpdate)
    {
    var requestOptions = new RequestOptions({ method: RequestMethod.Post, headers: this.headers });
    this._serverMaster.ServerName = this._serverName;
    this._serverMaster.ServerIP = this._serverIP;
    this._serverMaster.EnvironmentName=this._selectedEnvironment;
    this._serverMaster.ServerTypeName = this._selectedServerType;
    this._serverMaster.Active = true;
    var body = JSON.stringify(this._serverMaster);
    console.log(CommonConstants.ApiURL + " - " + body);
    
    this._http.post(CommonConstants.ApiURL + "PostServerMaster", body, requestOptions)
      .subscribe(response => {
        this._response = response.json();
        this.getAllServers();
        this.isUpdate = false;
        this._serverName='' 
      });
    }
    else
    {
      this._serverMaster.ServerName = this._serverName;
      this._serverMaster.Active = true;
      var body = JSON.stringify(this._serverName);
      var requestOptions = new RequestOptions({ method: RequestMethod.Put, headers: this.headers });
      this._http.put(CommonConstants.ApiURL + "PutServerMaster", body, requestOptions)
        .subscribe(response => {
          this._response = response.json();
          this.getAllServers();
          this.isUpdate = false;
          this._serverName='' 
        });
      } 
  }
    getAllEnvironments(){
        this._http.get(CommonConstants.ApiURL + "GetAllEnvironmentNames?EnvironmentName=")
        .subscribe(response => {
          this._getallEnvironmentsResponse = response.json();
        });
  }
  getAllServerTypes(){
      this._http.get(CommonConstants.ApiURL + "GetAllServerTypes?ServerTypeName=")
      .subscribe(response => {
        this._getallServerTypeResponse = response.json();
      });
}
selectEnvironmentChanged(event: MatSelectChange)
{
  this._selectedEnvironment = event.value;
}

selectServerTypeChanged(event: MatSelectChange)
{
  this._selectedServerType = event.value;
}

getAllServers(){
  this._getallServerMasterResponse=[];
  this.dataCopy=[];
  this._loadingService.register('stringName');
    this._http.get(CommonConstants.ApiURL + "GetAllServerDetails?ServerMasterName=")
    .subscribe(response => {
      this._getallServerMasterResponse = response.json();
      this.dataCopy = response.json();
      this._loadingService.resolve('stringName');
      this.filter(); 
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
    this._serverMaster = event.row
    this._serverName = this._serverMaster.ServerName;
    this._serverIP = this._serverMaster.ServerIP;
    this._selectedEnvironment = this._serverMaster.EnvironmentName;
    this._selectedServerType = this._serverMaster.ServerTypeName;
  }

  filter(): void {
    let newData: ServerMaster[] = this.dataCopy;
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
    this._getallServerMasterResponse = newData;
  }
}
