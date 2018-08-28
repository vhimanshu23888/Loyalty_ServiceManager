import { Component, OnInit } from '@angular/core';
import { FileUtil } from '../shared/file.util';
import { Router } from "@angular/router";
@Component({
  selector: 'app-file-reader',
  templateUrl: './file-reader.component.html',
  styleUrls: ['./file-reader.component.css']
})
export class FileReaderComponent implements OnInit {

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

constructor(private _router: Router,
  private _fileUtil: FileUtil
) { }

ngOnInit() { }

// METHOD CALLED WHEN CSV FILE IS IMPORTED
fileChangeListener($event): void {

  var text = [];
  var files = $event.srcElement.files;

  if(FileReaderComponent.validateHeaderAndRecordLengthFlag){
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
    //alert('Event Fired')
    let csvData = data.target.result;
    let csvRecordsArray = csvData.split(/\r\n|\n/);

    var headerLength = -1;
    if(FileReaderComponent.isHeaderPresentFlag){
      let headersRow = this._fileUtil.getHeaderArray(csvRecordsArray, FileReaderComponent.tokenDelimeter);
      headerLength = headersRow.length; 
    }
     
    this.csvRecords = this._fileUtil.getDataRecordsArrayFromCSVFile(csvRecordsArray, 
        headerLength, FileReaderComponent.validateHeaderAndRecordLengthFlag, FileReaderComponent.tokenDelimeter);
     console.log(this.csvRecords)
    if(this.csvRecords == null){
      //If control reached here it means csv file contains error, reset file.
      this.fileReset();
    }    
  }

  reader.onerror = function () {
    alert('Unable to read ' + input.files[0]);
  };
};

fileReset(){
  this.fileImportInput.nativeElement.value = "";
  this.csvRecords = '';
}
}
