var geocoderProvider = 'google';
var httpAdapter = 'https';
var extra = {
    apiKey: 'AIzaSyCLODLlJyy_HAbsQIGIEMXK6Zs_zZkrUPs',
    formatter: null // 'gpx', 'string', ... 
};
var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);
var Geocoder = (function () {
    function Geocoder(collection) {
        collection.find({}, {}, function (err, docs) {
            for (var i = 0; i < docs.length; i++) {
                //calling self-defined function so loop index will not finish looping and be 
                //set to last index before our first geocoding and mongo actions
                (function (i) {
                    var address = docs[i].address;
                    if (docs[i] != undefined) {
                        var nolatlng = docs[i].lat == null || docs[i].lng == null;
                        if (nolatlng) {
                            geocoder.geocode(address, function (err, res) {
                                var lat;
                                var lng;
                                //check if we received response with empty content
                                if (res == undefined) {
                                    lat = null;
                                    lng = null;
                                }
                                else {
                                    if (res[0] == undefined) {
                                        lat = null;
                                        lng = null;
                                    }
                                    else {
                                        lat = res[0].latitude;
                                        lng = res[0].longitude;
                                    }
                                }
                                var type = docs[i].type;
                                var space = docs[i].space;
                                var comment = docs[i].comment;
                                //insert converted or default value into db      
                                collection.update({ "address": address, "lat": null, "lng": null }, { $set: { "lat": lat, "lng": lng } });
                            });
                        }
                    }
                })(i);
            }
            console.log('Lat Lng updated');
        });
    }
    return Geocoder;
})();
module.exports = Geocoder;
