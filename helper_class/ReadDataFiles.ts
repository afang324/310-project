var fs = require('fs');
var request = require('request');
import CsvParser = require('./CsvParser');
class ReadDataFiles{
    constructor(database){
        //read motorcycle kmz file from server and download it
        console.log('going to request KML file');
        request('http://data.vancouver.ca/download/kml/motorcycle_parking.kmz').pipe(fs.createWriteStream('./data_file/motorcycle_parking.kmz'));
        console.log('KML file from server is downloaded to local file system');
        
        //read Bike csv file from filesystem
        fs.readFile('./data_file/bike_parking.csv', function (err, data) {
            if (err) {
                return console.error(err);
            }
            console.log("Asynchronous Bike csv Data Read Succeed");
            var addressIndex : number[] = [0,1,2];
            var spaceIndex : number = 5;
            new CsvParser(database,data,'Bike',addressIndex,spaceIndex);
        });
        
        //read Disability csv file from filesystem
        fs.readFile('./data_file/disability_parking.csv', function (err, data) {
            if (err) {
                return console.error(err);
            }
            console.log("Asynchronous Disability csv Data Read Succeed");
            var addressIndex : number[] = [4];
            var spaceIndex : number = 1;
            new CsvParser(database,data,'Disability',addressIndex,spaceIndex);
        });
        
        //read Motorcycle csv file from filesystem
        fs.readFile('./data_file/motorcycle_parking.csv', function (err, data) {
            if (err) {
                return console.error(err);
            }
            console.log("Asynchronous Motorcycle csv Data Read Succeed");
            var addressIndex : number[] = [6];
            var spaceIndex : number = null;
            new CsvParser(database,data,'Motorcycle',addressIndex,spaceIndex);
        });
    } 
}
export = ReadDataFiles;

