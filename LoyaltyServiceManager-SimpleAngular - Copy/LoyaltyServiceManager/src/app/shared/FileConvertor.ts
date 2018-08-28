// import {Component, NgModule} from '@angular/core'
// import {BrowserModule} from '@angular/platform-browser'

export class AppComponent {
  text  : any ;
  JSONData : any;
//  public string csvJSON(csvText) {
//    var lines = csvText.split("\n");

//    var result = [];

//    var headers = lines[0].split(",");
//    console.log(headers);
//    for (var i = 1; i < lines.length-1; i++) {

//        var obj = {};
//        var currentline = lines[i].split(",");

//        for (var j = 0; j < headers.length; j++) {
//            obj[headers[j]] = currentline[j];
//        }

//        result.push(obj);

//    }

//    //return result; //JavaScript object
//    console.log(JSON.stringify(result)); //JSON
//    //this.JSONData = 
//    return JSON.stringify(result);
// }

//  convertFile(input) {

//  const reader = new FileReader();
//  reader.readAsText(input.files[0]);
//  reader.onload = () => {
//    let text = reader.result;
//    this.text = text;
//    console.log(text);
//    this.csvJSON(text);
//  };

// }
// }

readFile(file) {                                                       
    var reader = new FileReader();
    // reader.onload = readSuccess;                                            
    // function readSuccess(evt) { 
    //     var field = document.getElementById('main');                        
    //     field.innerHTML = evt.target.result;                                
    // };
    reader.readAsText(file);                                              
} 
  uploadDatasource($event): void {
    //this.readFile($event.srcElement.files[0]);
    var text = [];
    var files = $event.srcElement.files;
    if(files[0].name.includes(".csv"))
    {
       var input = $event.target;
       var reader = new FileReader();
       //reader.readAsText(files[0]);
       //reader.onload = () => {
         let csvData = reader.result;
         let allTextLines = csvData.split(/\r\n|\n/);
         let headers = allTextLines[0].split(';');
         let lines = [];
         
         for (let i = 0; i < allTextLines.length; i++) {
          // split content based on comma
          let data = allTextLines[i].split(';');
          if (data.length == headers.length) {
            let tarr = [];
            for (let j = 0; j < headers.length; j++) {
              tarr.push(data[j]);
            }
            console.log(tarr);
            lines.push(tarr);
          }
        }
        console.log(lines);
      }
    }
}