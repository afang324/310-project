//<reference path='..\..\types/DefinitelyTyped/googlemaps/google.maps.d.ts'/>
///<reference path='..\..\types/DefinitelyTyped/markerclustererplus/markerclustererplus.d.ts'/>

module Mapping {
    export class GoogleMap {
        private name:string;
        private map:any;
        private options:any;

        constructor(mapDiv:Element, type:string) {
            this.name = type;
            this.options = {
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: new google.maps.LatLng(49.2827, -123.2)
            };
            this.map = new google.maps.Map(mapDiv, this.options);
            var circle = new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: this.map,
                center: new google.maps.LatLng(+49.2617063, -123.2547626),
                radius: 2000
            });
            this.showCurrentLocation();
            /*
             var kmlUrl = 'http://data.vancouver.ca/download/kml/motorcycle_parking.kmz';
             var kmlOptions = {
             suppressInfoWindows: true,
             preserveViewport: true,
             map:this.map
             };
             //var kmllayer = new google.maps.KmlLayer(kmlUrl, kmlOptions);
             google.maps.event.addListener(new google.maps.KmlLayer(kmlUrl, kmlOptions), 'click', function(event) {
             var content = event.featureData.infoWindowHtml;
             var testimonial = document.getElementById('capture');
             testimonial.innerHTML = content;
             });
             console.log("finish!");*/
            /* switch(type) {
             case "DisabilityCar":
             var allMarkers;
             allMarkers=this.addMarkers( [ [49.272, -123.252], [49.2712, -123.2523], [49.2728, -123.24]]);
             this.removeOneMarker(allMarkers[0]);
             break;
             case"Bike":
             this.addMarkers( [ [49.271, -123.253], [49.270, -123.222], [49.272, -123.272]]);
             break;
             case"MotorBike":
             var kmlUrl = 'http://data.vancouver.ca/download/kml/motorcycle_parking.kmz';
             var kmlOptions = {
             suppressInfoWindows: true,
             preserveViewport: true,
             map:this.map
             };
             console.log("hi!")
             //new google.maps.KmlLayer(kmlUrl, kmlOptions).setMap(this.map);
             console.log("hi!!")
             this.addMarkers( [ [49.273, -123.2534], [49.232, -123.252], [49.282, -123.251]]);
             break;
             }*/

        }

        private showCurrentLocation():void {
            var myLatLng = this.getMyLatLng();
            console.log("my position" + "" + myLatLng);
            var mymarker;
            mymarker = new google.maps.Marker({
                position: new google.maps.LatLng(+49.2617063, -123.2547626),
                map: this.map, animation: google.maps.Animation.BOUNCE,
                title: "Your location is 49.2617063,-123.2547263 "
            });
            google.maps.event.addListener(mymarker, "click", function (e) {
                var infoWindow = new google.maps.InfoWindow();
                infoWindow.setContent(mymarker.getTitle());
                infoWindow.open(this.map, mymarker);
            });
        }

        private getMyLatLng() {
            var LatLng;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function (p) {
                        LatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
                        console.log("haha" + "" + LatLng);
                    }
                )
            }
            console.log("finish getMyLatLng");
        }


        public addOneMarker(lat:number, lng:number):google.maps.Marker {

            console.log("get called");
            var marker;
            var distance;

            distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(lat, lng), new google.maps.LatLng(+49.2617063, -123.2547626));
            if (distance > 1500) {
                var info = 'Latitude: ' + lat + '<br>Longitude: ' + lng + '<br> distance:' + distance + ' far';
            }
            else {
                var info = 'Latitude: ' + lat + '<br>Longitude: ' + lng + '<br> distance:' + distance;
            }
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                // map:this.map,
                title: info
            });
            marker.setMap(this.map);
            console.log("messahe");

            google.maps.event.addListener(marker, "click", function (e) {
                var infoWindow = new google.maps.InfoWindow();
                infoWindow.setContent(marker.getTitle());
                infoWindow.open(this.map, marker);
            });
            return marker;
        }

        public addMarkers(parkinglist:any):any {
            var markers = [];
            for (var i = 0; i < parkinglist.length; i++) {
                var lat:number = parkinglist[i].lat;
                var lng:number = parkinglist[i].lng;
                if (lat!=null && lng!=null){
                    markers.push(this.addOneMarker(lat,lng));
                }
            }
            console.log("yeah!");
            console.log(markers);
            return markers;
        }

        public removeOneMarker(marker:google.maps.Marker) {
            marker.setMap(null);
        }

        public removeMarkersFarAway(markers:google.maps.Marker[]) {
            for (var i = 0; i < markers.length; i++) {
                if (markers[i].getTitle().indexOf('far')>=0) {
                    this.removeOneMarker(markers[i]);
                }
            }
        }
    }
}