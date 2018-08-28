import { Component, OnInit } from '@angular/core';
import { FileUtil } from '../shared/file.util';
import { CommonConstants } from '../shared/CommonConstants';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Http, Headers, RequestMethod, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { TdLoadingService } from '@covalent/core/loading';
@Component({
  selector: 'app-upload-servers',
  templateUrl: './upload-servers.component.html',
  styleUrls: ['./upload-servers.component.css']
})
export class UploadServersComponent implements OnInit 
{
  headers: Headers
  options: RequestOptions
  MachineName: string = '';
  //keep the flag true if csv contains header else not, this falg will help in validations.
  static isHeaderPresentFlag = true;
  //keep the flag true if you want to validate each records length to match with header length, false otherwise.
  static validateHeaderAndRecordLengthFlag = true;

  //keep the flag true if you want file with only .csv extensions should be read, false otherwise.
  static valildateFileExtenstionFlag = true;

  static tokenDelimeter = ",";

  // @ViewChild('fileImportInput')
  fileImportInput: any;

  csvRecords: string = '';
  constructor(private _fileUtil: FileUtil, private _http: Http,private _loadingService: TdLoadingService) { }


  ngOnInit() {
  }
  uploadServers() {
    if(this.csvRecords == null)
    {
      alert('No servers to upload.');
      return;
    }
    this._loadingService.register('stringName');
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    var requestOptions = new RequestOptions({ method: RequestMethod.Put, headers: this.headers });
    var body = '';
    var URL = CommonConstants.ApiURL + "PutUploadMachineNames?CSVData=" + this.csvRecords;
    alert(CommonConstants.ApiURL + "PutUploadMachineNames?CSVData=" + this.csvRecords);
    this._http.put(URL, body, requestOptions).subscribe(response => 
      {
      body = response.statusText;
      this.fileReset();
      this._loadingService.resolve('stringName');
      alert('Servers Uploaded Successfully');
    });
  }
    private extractData(res: Response) {
      let body = res.json();
      return body || {};
    }
    // METHOD CALLED WHEN CSV FILE IS IMPORTED
  fileChangeListener($event): void {

    var text = [];
    var files = $event.srcElement.files;

    if (UploadServersComponent.validateHeaderAndRecordLengthFlag) {
      if (!this._fileUtil.isCSVFile(files[0])) {
        alert("Please import valid .csv file.");
        this.fileReset();
      }
    }

    var input = $event.target;
    var reader = new FileReader();
    reader.readAsText(input.files[0]);

    reader.onloadend = (data: any) => {

      let csvData = data.target.result;
      let csvRecordsArray = csvData.split(/\r\n|\n/);

      var headerLength = -1;
      if (UploadServersComponent.isHeaderPresentFlag) {
        let headersRow = this._fileUtil.getHeaderArray(csvRecordsArray, UploadServersComponent.tokenDelimeter);
        headerLength = headersRow.length;
      }

      this.csvRecords = this._fileUtil.getDataRecordsArrayFromCSVFile(csvRecordsArray,
        headerLength, UploadServersComponent.validateHeaderAndRecordLengthFlag, UploadServersComponent.tokenDelimeter);
      console.log(this.csvRecords)
      if (this.csvRecords == null) {
        this.fileReset();
      }
    }

    reader.onerror = function () {
      alert('Unable to read ' + input.files[0]);
    };
  };

  fileReset() {
   // this.fileImportInput.nativeElement.value = "";
    this.csvRecords = '';
  }
}
