var csvparser = require('csv-parse');

class CsvParser{
    //collection: database
    //file: the csvfile
    //type: type of the parking space 
    //addressIndex: array of index to column of csv file for address information
    //spaceIndex: single index to column of csv containing space info, 
    //if null (not present in file) then set to 1
    constructor(collection,file,type,addressIndex,spaceIndex){
            csvparser(file, function(err, output){
                var numRows = output.length;
                var aind = addressIndex.length;
                for (var i=1;i<numRows;i++){
                    //encapsulate for loop content in self-defined function and call it so
                    //asychronize mongo method would act synchronizely with respect to loop index
                    (function (i){
                        var info  = output[i]
                        var parkAddress : string = '';
                        
                        for (var j=0; j<aind;j++){
                            parkAddress = parkAddress + info[addressIndex[j]] + ' ';
                        }
                        
                        if (spaceIndex == null){
                            numSpace = 1;
                        }else {
                            var numSpace = info[spaceIndex];
                        }
                        var lat:number = null;
                        var lng:number = null;
                        //find element in db that has the same address as parkAdress. if found then udpate, else insert
                        collection.update({'address':parkAddress},
                            {$setOnInsert:{'type':type,'address':parkAddress,'space':numSpace,'lat':lat,'lng':lng,'comment':''}}
                            ,{upsert:true});
                        
                    })(i);
                }
                
                console.log(type+' csv file has been parsed');
            });
        };
}
export = CsvParser;