import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestMethod, RequestOptions} from '@angular/http';
import { CommonConstants } from '../shared/CommonConstants';
import { ServerTypeMaster } from '../shared/ServerTypeMaster.Model';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn, ITdDataTableRowClickEvent } from '@covalent/core/data-table';
import { IPageChangeEvent } from '@covalent/core';
import { TdLoadingService } from '@covalent/core/loading';
@Component({
  selector: 'app-server-type-master',
  templateUrl: './server-type-master.component.html',
  styleUrls: ['./server-type-master.component.scss']
})
export class ServerTypeMasterComponent implements OnInit {

  columns: ITdDataTableColumn[] = [
    { name: 'ID', label: 'ServerTypeID', width: 100,sortable: false },
    { name: 'ServerTypeName', label: 'ServerType Name', width: 250,sortable: true },
    { name: 'Active', label: 'Is Active', hidden: false, width: 100,sortable: false }
  ];

  headers: Headers
  options: RequestOptions
  _serverTypeMaster: ServerTypeMaster = new ServerTypeMaster();
  _serverTypeName: string
  _response: string;
  _getResponse:ServerTypeMaster;
  _getallResponse:ServerTypeMaster[];
  dataCopy: ServerTypeMaster[];
  now: Date;
  filteredData: any[];
  filteredTotal: number;
  isUpdate: boolean = false;
  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 10;
  sortBy: string = 'ServerTypeName';
  selectedRows: ServerTypeMaster[] = [];
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;

  constructor(private _http: Http,private _dataTableService: TdDataTableService,private _loadingService: TdLoadingService) { }

  ngOnInit() {
    this.getAllServerTypes();
    this.filter();
  }


  InsertServerType() {
    // alert(this.apiUrl)
    this.headers = new Headers({ 'Content-Type': 'application/json' });

    if(!this.isUpdate)
    {
    var requestOptions = new RequestOptions({ method: RequestMethod.Post, headers: this.headers });
    this._serverTypeMaster.ServerTypeName = this._serverTypeName;
    this._serverTypeMaster.Active = true;
    var body = JSON.stringify(this._serverTypeMaster);
    console.log(CommonConstants.ApiURL + " - " + body);
    
    this._http.post(CommonConstants.ApiURL + "PostServerTypeMaster", body, requestOptions)
      .subscribe(response => {
        this._response = response.json();
        this.getAllServerTypes(); 
        this.isUpdate = false;
        this._serverTypeName=''  
      });
    }
    else
    {
      this._serverTypeMaster.ServerTypeName = this._serverTypeName;
      var body = JSON.stringify(this._serverTypeMaster);
      var requestOptions = new RequestOptions({ method: RequestMethod.Put, headers: this.headers });
      this._http.put(CommonConstants.ApiURL + "PutServerTypeMaster", body, requestOptions)
        .subscribe(response => {
          this._response = response.json();
          this.getAllServerTypes(); 
          this.isUpdate = false;
          this._serverTypeName=''  
        });      
    }    
  }
  getServerType(ServerTypeName:string){
    this._loadingService.register('stringName');
    if(ServerTypeName=='')
    {
      alert('Select ServerType to update');
      this._loadingService.resolve('stringName');    
      return;
    }
    else
    {
      return this._http.get(CommonConstants.ApiURL + "GetAllServerTypes?ServerTypeName=" + ServerTypeName)
      .subscribe(response => {
        this._getResponse = response.json();        
      });
    }
  }
    getAllServerTypes(){
      this._loadingService.register('stringName');
        this._http.get(CommonConstants.ApiURL + "GetAllServerTypes?ServerTypeName=")
        .subscribe(response => {
          this._getallResponse = response.json();
          this.dataCopy = response.json();
          this.filter();      
        });
        this._loadingService.resolve('stringName');    
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
    this._serverTypeMaster = event.row
    this._serverTypeName = this._serverTypeMaster.ServerTypeName;
  }

  filter(): void {
    let newData: ServerTypeMaster[] = this.dataCopy;
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